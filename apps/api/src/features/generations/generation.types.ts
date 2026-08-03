import { GenerationTemplate } from '../../generated/client/index.js';

/** Available slide layout types for presentation rendering. */
export type SlideLayout =
  | 'TITLE'
  | 'BULLET_POINTS'
  | 'TWO_COLUMN'
  | 'KEY_METRIC'
  | 'SUMMARY';

export interface KeyMetric {
  value: string;
  label: string;
}

export interface Slide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  bulletPoints?: string[];
  leftColumnContent?: string[];
  rightColumnContent?: string[];
  keyMetric?: KeyMetric;
  speakerNotes: string;
  visualSuggestion?: string;
}

export interface Chapter {
  chapterNumber: number;
  title: string;
  summary: string;
  learningObjectives: string[];
  slides: Slide[];
  keyTakeaways: string[];
}

export interface GeneratedContentPayload {
  topic: string;
  template: GenerationTemplate;
  totalChapters: number;
  estimatedDurationMinutes: number;
  targetAudience: string;
  chapters: Chapter[];
}

export type ModelTier = 'FREE' | 'PAID';

export interface CreateGenerationInput {
  topic: string;
  template?: GenerationTemplate;
  modelId?: string;
}
