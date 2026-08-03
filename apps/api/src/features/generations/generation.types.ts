import { GenerationTemplate } from '@prisma/client';

export interface Chapter {
  chapterNumber: number;
  title: string;
  summary: string;
  learningObjectives: string[];
  content: string;
  keyTakeaways: string[];
}

export interface GeneratedContentPayload {
  topic: string;
  template: GenerationTemplate;
  totalChapters: number;
  chapters: Chapter[];
}

export interface CreateGenerationInput {
  topic: string;
  template?: GenerationTemplate;
}
