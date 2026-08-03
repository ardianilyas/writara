import { GenerationTemplate, GenerationStatus, Prisma } from '../../generated/client/index.js';
import { prisma } from '../../lib/prisma.js';
import { openRouter } from '../../lib/openrouter.js';
import { env } from '../../lib/env.js';
import { logger } from '../../lib/logger.js';
import { NotFoundError, BadRequestError } from '../../errors/index.js';
import { GeneratedContentPayload, CreateGenerationInput } from './generation.types.js';

/** Timeout for OpenRouter AI calls (in milliseconds). */
const AI_TIMEOUT_MS = 120_000; // 2 minutes

/** Stale job timeout threshold for cleanup (3 minutes). */
const STALE_JOB_THRESHOLD_MS = 3 * 60 * 1000;

export class GenerationService {
  /**
   * Creates a PENDING generation record and kicks off AI processing
   * in the background. Returns the PENDING record immediately so
   * the HTTP response is fast.
   */
  async createGeneration(userId: string, input: CreateGenerationInput) {
    const generation = await prisma.generation.create({
      data: {
        userId,
        topic: input.topic,
        template: input.template || GenerationTemplate.PRESENTATION,
        status: GenerationStatus.PENDING,
      },
    });

    // Fire-and-forget background processing
    this.processGeneration(generation.id, input).catch((error) => {
      logger.error({ generationId: generation.id, error: error.message }, 'Background generation failed');
    });

    return generation;
  }

  /**
   * Retries a previously failed (or interrupted) generation.
   */
  async retryGeneration(id: string, userId: string) {
    const existing = await this.getGenerationById(id, userId);

    if (existing.status === GenerationStatus.IN_PROGRESS || existing.status === GenerationStatus.PENDING) {
      throw new BadRequestError('Generation is currently in progress.');
    }

    const updated = await prisma.generation.update({
      where: { id },
      data: {
        status: GenerationStatus.PENDING,
        errorMessage: null,
      },
    });

    this.processGeneration(updated.id, {
      topic: updated.topic,
      template: updated.template,
    }).catch((error) => {
      logger.error({ generationId: updated.id, error: error.message }, 'Background retry generation failed');
    });

    return updated;
  }

  /**
   * Deletes a generation record owned by the user.
   */
  async deleteGeneration(id: string, userId: string) {
    await this.getGenerationById(id, userId);

    return prisma.generation.delete({
      where: { id },
    });
  }

  /**
   * Cleans up stale/orphaned generations stuck in PENDING or IN_PROGRESS
   * for longer than 3 minutes (e.g. after server restart or crash).
   */
  async cleanupStaleGenerations(): Promise<number> {
    const cutoffTime = new Date(Date.now() - STALE_JOB_THRESHOLD_MS);

    const result = await prisma.generation.updateMany({
      where: {
        status: { in: [GenerationStatus.PENDING, GenerationStatus.IN_PROGRESS] },
        updatedAt: { lt: cutoffTime },
      },
      data: {
        status: GenerationStatus.FAILED,
        errorMessage: 'Generation process was interrupted or timed out.',
      },
    });

    if (result.count > 0) {
      logger.warn({ count: result.count }, 'Cleaned up stale interrupted generation records');
    }

    return result.count;
  }

  /**
   * Background worker: calls OpenRouter, parses JSON, and updates
   * the DB record to COMPLETED or FAILED.
   */
  private async processGeneration(generationId: string, input: CreateGenerationInput): Promise<void> {
    try {
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: GenerationStatus.IN_PROGRESS },
      });

      const template = input.template || GenerationTemplate.PRESENTATION;

      const systemPrompt = `You are an expert educational content generator. Produce concise, high-quality learning material.
You MUST output ONLY valid JSON without markdown formatting or code block wrappers (no \`\`\`json or \`\`\`).`;

      const userPrompt = `Topic: "${input.topic}"
Template: ${template}

Generate structured material containing exactly 5 chapters.
Return ONLY valid JSON matching this exact structure:
{
  "topic": "${input.topic}",
  "template": "${template}",
  "totalChapters": 5,
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "Chapter Title",
      "summary": "Brief summary (1-2 sentences).",
      "learningObjectives": ["Objective 1", "Objective 2"],
      "content": "Detailed content in markdown (keep concise).",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2"]
    }
  ]
}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

      let result: any;
      try {
        result = await openRouter.chat.send({
          chatRequest: {
            model: env.OPENROUTER_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            maxTokens: 4096,
          },
        });
      } finally {
        clearTimeout(timeout);
      }

      const rawText = (result as any).choices?.[0]?.message?.content || '';
      const cleanedJsonText = rawText
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/```json|```/g, '')
        .trim();

      if (!cleanedJsonText) {
        throw new Error('Received empty response from AI provider');
      }

      let parsedPayload: GeneratedContentPayload;
      try {
        parsedPayload = JSON.parse(cleanedJsonText);
      } catch (parseError) {
        throw new Error(`Failed to parse AI JSON response: ${(parseError as Error).message}`);
      }

      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: GenerationStatus.COMPLETED,
          content: parsedPayload as unknown as Prisma.InputJsonValue,
        },
      });

      logger.info({ generationId }, 'Generation completed successfully');
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError'
        ? 'AI generation timed out after 2 minutes'
        : error.message || 'Generation failed';

      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: GenerationStatus.FAILED,
          errorMessage,
        },
      });

      logger.error({ generationId, error: errorMessage }, 'Generation failed');
    }
  }

  /**
   * Retrieve single generation record for authorized user.
   */
  async getGenerationById(id: string, userId: string) {
    const generation = await prisma.generation.findUnique({
      where: { id },
    });

    if (!generation || generation.userId !== userId) {
      throw new NotFoundError('Generation record not found.');
    }

    return generation;
  }

  /**
   * Retrieve list of generation records for user.
   */
  async getUserGenerations(userId: string) {
    return prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const generationService = new GenerationService();
