import { z } from 'zod';
import { GenerationTemplate } from '../../generated/client/index.js';

export const createGenerationSchema = z.object({
  topic: z
    .string()
    .min(2, 'Topic must be at least 2 characters long')
    .max(200, 'Topic must not exceed 200 characters'),
  template: z
    .nativeEnum(GenerationTemplate)
    .optional()
    .default(GenerationTemplate.PRESENTATION),
  totalChapters: z
    .number()
    .int('Total chapters must be an integer')
    .min(1, 'Minimum 1 chapter is required')
    .max(20, 'Maximum 20 chapters allowed')
    .optional()
    .default(5),
  modelId: z
    .string()
    .optional()
    .default('nemotron-30b'),
});
