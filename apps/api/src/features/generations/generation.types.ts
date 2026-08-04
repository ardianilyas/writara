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

export interface GeneratedSection {
  sectionNumber?: number;
  heading: string;
  explanation: string;
  keyPoints: string[];
  speakerScript?: string;
}

export interface Chapter {
  chapterNumber: number;
  title: string;
  summary: string;
  learningObjectives?: string[];
  sections?: GeneratedSection[];
  slides?: Slide[];
  chapterTakeaways?: string[];
  keyTakeaways?: string[];
}

export interface GeneratedContentPayload {
  generatedTitle?: string;
  topic: string;
  template: GenerationTemplate;
  totalChapters: number;
  estimatedDurationMinutes: number;
  targetAudience: string;
  executiveSummary?: string;
  chapters: Chapter[];
}

export type ModelTier = 'FREE' | 'PAID';

export interface CreateGenerationInput {
  topic: string;
  template?: GenerationTemplate;
  modelId?: string;
  slideCount?: number;
}
