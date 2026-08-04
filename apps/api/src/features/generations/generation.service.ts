import { GenerationTemplate, GenerationStatus, Prisma } from '../../generated/client/index.js';
import { prisma } from '../../lib/prisma.js';
import { openRouter } from '../../lib/openrouter.js';
import { env } from '../../lib/env.js';
import { logger } from '../../lib/logger.js';
import { NotFoundError, BadRequestError } from '../../errors/index.js';
import { GeneratedContentPayload, CreateGenerationInput } from './generation.types.js';

import { creditService, DeductCreditResult } from '../credits/credit.service.js';
import { modelsService } from '../models/models.service.js';

/** Timeout for OpenRouter AI calls (in milliseconds). */
const AI_TIMEOUT_MS = 120_000; // 2 minutes

/** Stale job timeout threshold for cleanup (3 minutes). */
const STALE_JOB_THRESHOLD_MS = 3 * 60 * 1000;

export class GenerationService {
  /**
   * Creates a PENDING generation record, deducts credits based on selected AI model,
   * and kicks off AI processing in the background.
   */
  async createGeneration(userId: string, input: CreateGenerationInput) {
    // 1. Resolve selected AI model from database
    const selectedModel = await modelsService.getModelByIdOrSlug(input.modelId || 'nemotron-30b');
    const totalChapters = selectedModel.maxChapters;
    const requiredCredits = selectedModel.creditCost;
    const model = selectedModel.modelKey;

    // 3. Deduct credits upfront (throws BadRequestError if insufficient)
    const deduction = await creditService.deductCredits(
      userId,
      requiredCredits,
      `Generation for "${input.topic}" (${totalChapters} chapters via ${selectedModel.name})`
    );

    // 4. Create database record
    const generation = await prisma.generation.create({
      data: {
        userId,
        topic: input.topic,
        template: input.template || GenerationTemplate.PRESENTATION,
        status: GenerationStatus.PENDING,
        modelUsed: model,
        aiModelId: selectedModel.id,
      },
    });

    // 5. Fire-and-forget background processing
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

      // STAGE 1: Fast Intent & Scope Expansion
      let stage1Plan: {
        generatedTitle?: string;
        expandedTitle?: string;
        topicThesis?: string;
        targetAudience?: string;
        keySubtopics?: string[];
      } = {
        generatedTitle: undefined,
        expandedTitle: input.topic,
        topicThesis: `A comprehensive educational guide covering core concepts and practical implementation of ${input.topic}.`,
        targetAudience: 'Developers and learners seeking a clear topic walkthrough.',
        keySubtopics: [],
      };

      try {
        const stage1SystemPrompt = 'You are an expert curriculum planner and instructional designer. Output ONLY valid JSON.';
        const stage1UserPrompt = `Analyze the user input topic: "${input.topic}".
Formulate a focused learning thesis, target audience, key subtopics, and a polished educational title.
CRITICAL: Create a NEW, professional, high-impact title (e.g. if input is "laravel basic", generate "Laravel Basics: A Complete Developer Guide"). Do NOT return raw "${input.topic}".

Return ONLY valid JSON matching this schema:
{
  "generatedTitle": "Polished, high-impact title",
  "topicThesis": "1-2 sentence core educational thesis explaining what this guide covers and why it matters",
  "targetAudience": "Specific target audience description",
  "keySubtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3", "Subtopic 4"]
}`;

        const stage1Controller = new AbortController();
        const stage1Timeout = setTimeout(() => stage1Controller.abort(), 15000);

        let stage1Result: any;
        try {
          stage1Result = await openRouter.chat.send({
            chatRequest: {
              model,
              messages: [
                { role: 'system', content: stage1SystemPrompt },
                { role: 'user', content: stage1UserPrompt },
              ],
              maxTokens: 512,
            },
          });
        } finally {
          clearTimeout(stage1Timeout);
        }

        const stage1Text = (stage1Result as any).choices?.[0]?.message?.content || '';
        if (stage1Text.trim()) {
          const parsedPlan = this.extractJsonFromResponse(stage1Text);
          if (parsedPlan) {
            stage1Plan = { ...stage1Plan, ...parsedPlan };
            logger.info({ generationId, stage1Plan }, 'Stage 1 intent planning succeeded');
          }
        }
      } catch (stage1Err: any) {
        logger.warn({ generationId, error: stage1Err.message }, 'Stage 1 intent planning skipped, proceeding to Stage 2');
      }

      // STAGE 2: Deep Educational Content Generation using Stage 1 Plan
      const systemPrompt = [
        'You are an expert educator, technical author, and master presenter.',
        'Your mission is to generate REAL, DEEP, HIGHLY INFORMATIVE, EDUCATIONAL CONTENT for the requested topic thesis.',
        'CRITICAL CONTENT RULES:',
        '1. DO NOT write meta-advice about how a speaker should behave (e.g. do NOT write "The speaker should pause here" or "The speaker should look confident").',
        '2. DO write DETAILED EDUCATIONAL EXPLANATIONS that explain the topic thoroughly to the reader/audience.',
        '3. For every section heading (e.g. "1. What is Laravel?"), write a comprehensive 3 to 5 sentence detailed explanation defining the core concept, architecture, and practical use cases.',
        '4. Under explanation, provide 3 to 5 concrete keyPoints with factual details and technical advantages.',
        '5. In speakerScript, write 2 to 3 complete verbal sentences guiding the presenter on the exact talking points to explain out loud.',
        '6. Output ONLY valid, parseable JSON matching the exact schema.',
      ].join('\n');

      const userPrompt = `Create a comprehensive, in-depth educational topic guide based on this planned curriculum:

PLANNED TITLE: "${stage1Plan.generatedTitle || stage1Plan.expandedTitle}"
EDUCATIONAL THESIS: "${stage1Plan.topicThesis}"
TARGET AUDIENCE: "${stage1Plan.targetAudience}"
PLANNED SUBTOPICS: ${JSON.stringify(stage1Plan.keySubtopics)}

STRICT LAYOUT & CONTENT REQUIREMENTS:
- Generate exactly ${totalChapters} chapters, aligning with the planned subtopics.
- Each chapter MUST contain 2 to 4 detailed sections explaining key subtopics thoroughly.
- Every section MUST include:
  - heading: Clear question or subtopic name (e.g. "1. What is Laravel?", "2. Why Use Laravel?", "3. Model-View-Controller Architecture").
  - explanation: A detailed 3 to 5 sentence explanation unpacking the concept, core mechanics, and real-world application.
  - keyPoints: 3 to 5 punchy bullet points providing specific facts, features, or benefits.
  - speakerScript: 2 to 3 detailed verbal sentences for the presenter to say out loud to teach the concept effectively.

Return ONLY a valid JSON object matching this TypeScript interface exactly:

interface Presentation {
  generatedTitle: string; // "${stage1Plan.generatedTitle || stage1Plan.expandedTitle}"
  topic: string; // "${input.topic}"
  template: string; // "${template}"
  totalChapters: number; // ${totalChapters}
  estimatedDurationMinutes: number;
  targetAudience: string; // "${stage1Plan.targetAudience}"
  executiveSummary: string; // "${stage1Plan.topicThesis}"
  chapters: Array<{
    chapterNumber: number;
    title: string;
    summary: string;
    sections: Array<{
      sectionNumber: number;
      heading: string;
      explanation: string;
      keyPoints: string[];
      speakerScript: string;
    }>;
    chapterTakeaways: string[];
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
            maxTokens: 12288,
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

      let aiTitle =
        (parsedPayload as any).generatedTitle ||
        (parsedPayload as any).title ||
        stage1Plan.generatedTitle ||
        stage1Plan.expandedTitle;

      if (!aiTitle || aiTitle.toLowerCase().trim() === input.topic.toLowerCase().trim()) {
        if (stage1Plan.generatedTitle && stage1Plan.generatedTitle.toLowerCase().trim() !== input.topic.toLowerCase().trim()) {
          aiTitle = stage1Plan.generatedTitle;
        } else if (stage1Plan.expandedTitle && stage1Plan.expandedTitle.toLowerCase().trim() !== input.topic.toLowerCase().trim()) {
          aiTitle = stage1Plan.expandedTitle;
        } else {
          aiTitle = `${input.topic.charAt(0).toUpperCase() + input.topic.slice(1)}: Complete Guide`;
        }
      }

      parsedPayload.generatedTitle = aiTitle;

      await prisma.generation.update({
        where: { id: generationId },
        data: {
          topic: aiTitle,
          status: GenerationStatus.COMPLETED,
          content: parsedPayload as unknown as Prisma.InputJsonValue,
        },
      });

      logger.info({ generationId, model, totalChapters, aiTitle }, 'Generation completed successfully with AI title');
    } catch (error: any) {
      const errorMessage = error.name === 'AbortError'
        ? 'AI generation timed out after 2 minutes'
        : error.message || 'Generation failed';

      // Automatically refund deducted credits on generation failure
      await creditService.refundCredits(
        userId,
        deduction.freeDeducted,
        deduction.purchasedDeducted,
        `Refund for failed generation "${input.topic}"`
      );

      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: GenerationStatus.FAILED,
          errorMessage,
        },
      });

      // Delete failed generation record from DB as requested
      await prisma.generation.delete({
        where: { id: generationId },
      }).catch((delErr) => {
        logger.error({ generationId, error: delErr.message }, 'Failed to delete failed generation record');
      });

      logger.error({ generationId, error: errorMessage }, 'Generation failed, credits refunded, and record removed from DB');
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

    if (generation.status === GenerationStatus.FAILED) {
      await prisma.generation.delete({ where: { id } }).catch(() => {});
      throw new NotFoundError('Generation failed and was removed.');
    }

    return generation;
  }

  /**
   * Retrieve lightweight sidebar items (title, count, status) for logged-in user.
   */
  async getUserGenerationsSidebar(userId: string) {
    await prisma.generation.deleteMany({
      where: {
        userId,
        status: GenerationStatus.FAILED,
      },
    }).catch(() => {});

    const items = await prisma.generation.findMany({
      where: {
        userId,
        status: { not: GenerationStatus.FAILED },
      },
      select: {
        id: true,
        topic: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      count: items.length,
      items: items.map((i) => ({
        id: i.id,
        title: i.topic,
        status: i.status,
        createdAt: i.createdAt,
      })),
    };
  }

  /**
   * Retrieve list of generation records for user.
   */
  async getUserGenerations(userId: string) {
    await prisma.generation.deleteMany({
      where: {
        userId,
        status: GenerationStatus.FAILED,
      },
    }).catch(() => {});

    return prisma.generation.findMany({
      where: {
        userId,
        status: { not: GenerationStatus.FAILED },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Robustly extracts and parses JSON from AI model response text.
   * Handles: <think> tags, markdown fences, conversational preamble text,
  /**
   * Robustly extracts and parses JSON from AI model response text.
   * Handles: <think> tags, markdown fences, conversational preamble text,
   * escaped quotes, trailing commas, and unclosed arrays/objects.
   */
  private extractJsonFromResponse(raw: string): GeneratedContentPayload {
    // 1. Strip thinking tags (Nemotron reasoning models)
    let text = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // 2. Strip markdown code fences
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    // 3. Locate first '{' and last '}' intelligently ignoring quotes
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1) {
      throw new Error('No JSON object found in AI response');
    }

    let candidate = lastBrace > firstBrace
      ? text.substring(firstBrace, lastBrace + 1)
      : text.substring(firstBrace);

    // Try direct parse first
    try {
      return JSON.parse(candidate);
    } catch (e1) {
      // 4. Clean trailing commas & invalid control characters
      candidate = this.repairJsonString(candidate);

      try {
        return JSON.parse(candidate);
      } catch (e2) {
        // 5. Try auto-closing unclosed brackets/braces
        candidate = this.autoCloseJson(candidate);
        try {
          return JSON.parse(candidate);
        } catch (e3) {
          throw new Error(`Failed to parse AI JSON response: ${(e3 as Error).message}`);
        }
      }
    }
  }

  /**
   * Sanitizes trailing commas, unescaped newlines in strings, and control characters.
   */
  private repairJsonString(jsonStr: string): string {
    return jsonStr
      .replace(/,\s*([\}\]])/g, '$1') // Remove trailing commas before } or ]
      .replace(/[\u0000-\u001F]+/g, (match) => {
        if (match === '\n' || match === '\r' || match === '\t') return match;
        return '';
      });
  }

  /**
   * Auto-closes unclosed quotes, brackets, and braces if JSON was cut off near token limit.
   */
  private autoCloseJson(jsonStr: string): string {
    let inString = false;
    let isEscaped = false;
    const stack: string[] = [];

    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr[i];

      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === '\\') {
        isEscaped = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{' || char === '[') {
          stack.push(char);
        } else if (char === '}') {
          if (stack.length && stack[stack.length - 1] === '{') stack.pop();
        } else if (char === ']') {
          if (stack.length && stack[stack.length - 1] === '[') stack.pop();
        }
      }
    }

    let repaired = jsonStr;
    if (inString) {
      repaired += '"';
    }

    // Strip trailing incomplete key or comma
    repaired = repaired.replace(/,\s*$/, '').replace(/"[^"]*"\s*:\s*$/, '');

    while (stack.length > 0) {
      const open = stack.pop();
      if (open === '{') repaired += '}';
      if (open === '[') repaired += ']';
    }

    return repaired;
  }
}

export const generationService = new GenerationService();
