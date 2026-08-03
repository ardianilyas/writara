import { GenerationTemplate, GenerationStatus, Prisma } from '../../generated/client/index.js';
import { prisma } from '../../lib/prisma.js';
import { openRouter } from '../../lib/openrouter.js';
import { env } from '../../lib/env.js';
import { logger } from '../../lib/logger.js';
import { NotFoundError } from '../../errors/index.js';
import { GeneratedContentPayload, CreateGenerationInput } from './generation.types.js';

/** Timeout for OpenRouter AI calls (in milliseconds). */
const AI_TIMEOUT_MS = 120_000; // 2 minutes

export class GenerationService {
  /**
   * Creates a PENDING generation record and kicks off AI processing
   * in the background. Returns the PENDING record immediately so
   * the HTTP response is fast.
   */
  async createGeneration(userId: string, input: CreateGenerationInput) {
    // 1. Create DB record with PENDING status — returned to client immediately
    const generation = await prisma.generation.create({
      data: {
        userId,
        topic: input.topic,
        template: input.template || GenerationTemplate.PRESENTATION,
        status: GenerationStatus.PENDING,
      },
    });

    // 2. Fire-and-forget background processing (not awaited)
    this.processGeneration(generation.id, input).catch((error) => {
      logger.error({ generationId: generation.id, error: error.message }, 'Background generation failed');
    });

    return generation;
  }

  /**
   * Background worker: calls OpenRouter, parses JSON, and updates
   * the DB record to COMPLETED or FAILED.
   */
  private async processGeneration(generationId: string, input: CreateGenerationInput): Promise<void> {
    try {
      // Mark as IN_PROGRESS
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

      // Call OpenRouter with timeout via AbortController
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

      // Extract and clean JSON response
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

      // Update DB record to COMPLETED
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
