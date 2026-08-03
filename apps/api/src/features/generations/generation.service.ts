import { GenerationTemplate, GenerationStatus, Prisma } from '../../generated/client/index.js';
import { prisma } from '../../lib/prisma.js';
import { openRouter } from '../../lib/openrouter.js';
import { env } from '../../lib/env.js';
import { logger } from '../../lib/logger.js';
import { NotFoundError, BadRequestError } from '../../errors/index.js';
import { GeneratedContentPayload, CreateGenerationInput } from './generation.types.js';

import { creditService, DeductCreditResult } from '../credits/credit.service.js';

/** Timeout for OpenRouter AI calls (in milliseconds). */
const AI_TIMEOUT_MS = 120_000; // 2 minutes

/** Stale job timeout threshold for cleanup (3 minutes). */
const STALE_JOB_THRESHOLD_MS = 3 * 60 * 1000;

export class GenerationService {
  /**
   * Creates a PENDING generation record, deducts credits based on requested plan/chapters,
   * and kicks off AI processing in the background.
   */
  async createGeneration(userId: string, input: CreateGenerationInput) {
    const isPaid = input.modelTier === 'PAID';
    const model = isPaid ? env.OPENROUTER_PAID_MODEL : env.OPENROUTER_FREE_MODEL;
    const requiredCredits = isPaid ? 5 : 1;
    const totalChapters = input.totalChapters && input.totalChapters > 0 ? input.totalChapters : 5;

    // Free model tier safety check
    if (!isPaid && totalChapters > 5) {
      throw new BadRequestError(
        'Free model tier is limited to 5 chapters. Please select the PAID model tier for decks up to 20 chapters.'
      );
    }

    // 1. Deduct credits upfront (throws BadRequestError if insufficient)
    const deduction = await creditService.deductCredits(
      userId,
      requiredCredits,
      `Generation for "${input.topic}" (${totalChapters} chapters, ${isPaid ? 'PAID' : 'FREE'} model)`
    );

    // 2. Create database record with modelUsed
    const generation = await prisma.generation.create({
      data: {
        userId,
        topic: input.topic,
        template: input.template || GenerationTemplate.PRESENTATION,
        status: GenerationStatus.PENDING,
        modelUsed: model,
      },
    });

    // 3. Fire-and-forget background processing
    this.processGeneration(generation.id, userId, input, totalChapters, model, deduction).catch((error) => {
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

    const totalChapters = 5; // Default retry chapters
    const requiredCredits = 1;
    const model = env.OPENROUTER_FREE_MODEL;

    const deduction = await creditService.deductCredits(
      userId,
      requiredCredits,
      `Retry generation for "${existing.topic}"`
    );

    const updated = await prisma.generation.update({
      where: { id },
      data: {
        status: GenerationStatus.PENDING,
        errorMessage: null,
      },
    });

    this.processGeneration(
      updated.id,
      userId,
      { topic: updated.topic, template: updated.template },
      totalChapters,
      model,
      deduction
    ).catch((error) => {
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
   * Background worker: calls OpenRouter, parses JSON, and updates DB.
   * If generation fails, automatically refunds user credits.
   */
  private async processGeneration(
    generationId: string,
    userId: string,
    input: CreateGenerationInput,
    totalChapters: number,
    model: string,
    deduction: DeductCreditResult
  ): Promise<void> {
    try {
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: GenerationStatus.IN_PROGRESS },
      });

      const template = input.template || GenerationTemplate.PRESENTATION;

      const systemPrompt = [
        'You are a senior instructional designer who creates structured presentation decks.',
        'RULES:',
        '1. Output ONLY valid JSON. No markdown fences, no explanation, no text outside JSON.',
        '2. Every string value must be properly escaped.',
        '3. Do NOT truncate or abbreviate the output. Complete all chapters and slides.',
      ].join('\n');

      const userPrompt = `Create an educational presentation on the topic: "${input.topic}"

REQUIREMENTS:
- Generate exactly ${totalChapters} chapters, each with 2 to 3 slides.
- Use a single layout per slide, chosen from: "TITLE", "BULLET_POINTS", "TWO_COLUMN", "KEY_METRIC", "SUMMARY".
- Chapter 1, slide 1 MUST use the "TITLE" layout.
- The final chapter's last slide MUST use the "SUMMARY" layout.
- For speakerNotes: Provide 1-2 complete sentences for the presenter to say.
- For bulletPoints: Provide 3-5 short, punchy items (max 12 words each).
- For visualSuggestion: Provide a brief description of a supporting graphic.
- DO NOT use placeholders like "..." or truncate the output. Generate the FULL content.

Return ONLY a valid JSON object matching this TypeScript interface exactly:

interface Presentation {
  topic: string;
  template: string; // "${template}"
  totalChapters: number; // ${totalChapters}
  estimatedDurationMinutes: number;
  targetAudience: string;
  chapters: Array<{
    chapterNumber: number;
    title: string;
    summary: string;
    learningObjectives: string[];
    slides: Array<{
      slideNumber: number;
      title: string;
      layout: string;
      bulletPoints?: string[];
      speakerNotes: string;
      visualSuggestion?: string;
    }>;
    keyTakeaways: string[];
  }>;
}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

      let result: any;
      try {
        result = await openRouter.chat.send({
          chatRequest: {
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            maxTokens: 8192,
          },
        });
      } finally {
        clearTimeout(timeout);
      }

      const rawText = (result as any).choices?.[0]?.message?.content || '';

      if (!rawText.trim()) {
        throw new Error('Received empty response from AI provider');
      }

      let parsedPayload: GeneratedContentPayload;
      try {
        parsedPayload = this.extractJsonFromResponse(rawText);
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

      logger.info({ generationId, model, totalChapters }, 'Generation completed successfully');
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

      // Automatically refund deducted credits on generation failure
      await creditService.refundCredits(
        userId,
        deduction.freeDeducted,
        deduction.purchasedDeducted,
        `Refund for failed generation "${input.topic}"`
      );

      logger.error({ generationId, error: errorMessage }, 'Generation failed and credits refunded');
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

  /**
   * Robustly extracts and parses JSON from AI model response text.
   * Handles: <think> tags, markdown fences, conversational preamble text,
   * and any non-JSON content before or after the actual JSON object.
   */
  private extractJsonFromResponse(raw: string): GeneratedContentPayload {
    // 1. Strip thinking tags (Nemotron reasoning models)
    let text = raw.replace(/<think>[\s\S]*?<\/think>/gi, '');

    // 2. Strip markdown code fences
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');

    // 3. Find the first top-level JSON object by matching braces
    const startIdx = text.indexOf('{');
    if (startIdx === -1) {
      throw new Error('No JSON object found in AI response');
    }

    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx; i < text.length; i++) {
      if (text[i] === '{') depth++;
      if (text[i] === '}') depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }

    if (endIdx === -1) {
      throw new Error('Incomplete JSON object in AI response (unmatched braces)');
    }

    const jsonStr = text.substring(startIdx, endIdx + 1);
    return JSON.parse(jsonStr);
  }
}

export const generationService = new GenerationService();
