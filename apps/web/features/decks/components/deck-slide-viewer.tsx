'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { GenerationRecord, Slide } from '../api/use-decks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DeckSlideViewerProps {
  deck: GenerationRecord;
  onBackToChat: () => void;
}

export function DeckSlideViewer({ deck, onBackToChat }: DeckSlideViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);

  const isGenerating =
    deck.status === 'PENDING' ||
    deck.status === 'GENERATING' ||
    (deck.status as string) === 'IN_PROGRESS';

  // Extract all slides from generated content chapters
  const payload = deck.content || deck.generatedContent;
  const allSlides: { slide: Slide; chapterTitle: string; chapterSummary?: string; keyTakeaways?: string[]; learningObjectives?: string[] }[] = [];
  if (payload?.chapters) {
    payload.chapters.forEach((chapter) => {
      chapter.slides?.forEach((slide) => {
        allSlides.push({
          slide,
          chapterTitle: chapter.title,
          chapterSummary: chapter.summary,
          keyTakeaways: chapter.keyTakeaways || chapter.chapterTakeaways,
          learningObjectives: chapter.learningObjectives,
        });
      });
    });
  }

  const currentItem = allSlides[currentSlideIndex];
  const currentSlide = currentItem?.slide;
  const totalSlides = allSlides.length;

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  // Helper to extract rich slide content & fallback points
  const getSlideContent = (slide: Slide, chapter: { chapterSummary?: string; keyTakeaways?: string[]; learningObjectives?: string[] }) => {
    const rawPoints: string[] = [];

    if (slide.bulletPoints?.length) rawPoints.push(...slide.bulletPoints);
    if (slide.leftColumnContent?.length) rawPoints.push(...slide.leftColumnContent);
    if (slide.rightColumnContent?.length) rawPoints.push(...slide.rightColumnContent);
    if (chapter.keyTakeaways?.length) rawPoints.push(...chapter.keyTakeaways);
    if (chapter.learningObjectives?.length) rawPoints.push(...chapter.learningObjectives);

    // Fallback: If rawPoints is still empty, derive sentences from speakerNotes or subtitle
    if (rawPoints.length === 0) {
      if (slide.speakerNotes) {
        const sentences = slide.speakerNotes.split(/(?<=[.?!])\s+/).filter(Boolean);
        rawPoints.push(...sentences);
      }
      if (slide.subtitle) {
        rawPoints.push(slide.subtitle);
      }
      if (chapter.chapterSummary) {
        rawPoints.push(chapter.chapterSummary);
      }
    }

    // Deduplicate
    const points = Array.from(new Set(rawPoints)).filter(Boolean);

    // Ensure at least 2 points
    if (points.length === 0) {
      points.push(`Key Insights & Best Practices for ${slide.title}`);
      points.push(`Implementation & Execution Strategy`);
    }

    return points;
  };

  if (isGenerating) {
    return (
      <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-card border-border shadow-xs space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-200 flex items-center justify-center text-sky-500 shadow-xs relative">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <div className="space-y-2 max-w-md">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 font-semibold text-xs border-sky-200 bg-sky-50 text-sky-700">
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            <span>AI Reasoning In Progress</span>
          </Badge>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Structuring "{deck.topic}"
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Writara is building chapter layouts, speaker notes, and learning objectives. This takes a few seconds...
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onBackToChat} className="gap-2 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Chat</span>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col justify-between p-6 bg-card border-border shadow-xs">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBackToChat} className="gap-2 text-xs font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Generator</span>
          </Button>

          <div className="h-4 w-px bg-border" />

          <div className="truncate">
            <h2 className="text-sm font-bold text-foreground truncate max-w-xs sm:max-w-md">
              {deck.topic}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {deck.modelId}
              </Badge>
              <span>{totalSlides} Slides</span>
            </div>
          </div>
        </div>

        <Button
          variant={showSpeakerNotes ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
          className="gap-1.5 text-xs font-semibold"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Speaker Notes</span>
        </Button>
      </div>

      {/* Main Slide Canvas */}
      {currentSlide ? (
        <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Slide Preview Box */}
          <Card
            className={`p-8 flex flex-col justify-between min-h-[360px] border-border bg-slate-950 text-white shadow-md ${
              showSpeakerNotes ? 'lg:col-span-8' : 'lg:col-span-12'
            }`}
          >
            {/* Header / Chapter Label */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                {currentItem.chapterTitle}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Slide {currentSlideIndex + 1} / {totalSlides}
              </span>
            </div>

            {/* Slide Content based on layout */}
            <div className="my-auto space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {currentSlide.title}
                </h3>
                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* TWO_COLUMN layout with robust fallbacks */}
              {currentSlide.layout === 'TWO_COLUMN' && (() => {
                const points = getSlideContent(currentSlide, currentItem);
                const leftItems = currentSlide.leftColumnContent?.length
                  ? currentSlide.leftColumnContent
                  : points.slice(0, Math.ceil(points.length / 2));
                const rightItems = currentSlide.rightColumnContent?.length
                  ? currentSlide.rightColumnContent
                  : points.slice(Math.ceil(points.length / 2));

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">Architecture & Mechanism</span>
                      {leftItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Impact & Implementation</span>
                      {(rightItems.length ? rightItems : leftItems).map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* SUMMARY layout */}
              {currentSlide.layout === 'SUMMARY' && (() => {
                const points = getSlideContent(currentSlide, currentItem);
                return (
                  <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 border-b border-emerald-800/40 pb-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Executive Summary & Key Takeaways</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                      {points.map((point, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* KEY_METRIC layout with robust fallbacks */}
              {currentSlide.layout === 'KEY_METRIC' && (() => {
                const points = getSlideContent(currentSlide, currentItem);
                const metricValue = currentSlide.keyMetric?.value || (points[0]?.match(/\d+[\%\w\$\+]*/)?.[0]) || "Benchmark";
                const metricLabel = currentSlide.keyMetric?.label || currentSlide.subtitle || currentSlide.title;
                const supportingPoints = currentSlide.keyMetric ? points : points.slice(1);

                return (
                  <div className="space-y-4">
                    <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6 text-center space-y-1">
                      <span className="text-4xl sm:text-5xl font-black text-sky-400 block tracking-tight">
                        {metricValue}
                      </span>
                      <span className="text-xs font-semibold text-slate-300 block">
                        {metricLabel}
                      </span>
                    </div>
                    {supportingPoints.length > 0 && (
                      <div className="space-y-2 text-xs text-slate-300 pt-2">
                        {supportingPoints.map((point, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* BULLET_POINTS or default fallback */}
              {(currentSlide.layout === 'BULLET_POINTS' || currentSlide.layout === 'TITLE' || !['TWO_COLUMN', 'SUMMARY', 'KEY_METRIC'].includes(currentSlide.layout)) && (() => {
                const points = getSlideContent(currentSlide, currentItem);
                return (
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-slate-900/50 border border-slate-800/80 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>

            {currentSlide.visualSuggestion && (
              <div className="pt-4 border-t border-slate-900 flex items-center gap-2 text-[11px] text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span className="truncate">Visual Suggestion: {currentSlide.visualSuggestion}</span>
              </div>
            )}
          </Card>

          {/* Speaker Notes Drawer */}
          {showSpeakerNotes && (
            <Card className="lg:col-span-4 p-5 space-y-4 flex flex-col justify-between border-border bg-card">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600 border-b border-border pb-2">
                  <FileText className="h-4 w-4" />
                  <span>Speaker Notes</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentSlide.speakerNotes}
                </p>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="my-auto py-12 text-center text-muted-foreground">
          No slides found for this deck.
        </div>
      )}

      {/* Bottom Navigation Controls using Shadcn Button */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className="gap-1.5 text-xs font-semibold"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <span className="text-xs text-muted-foreground font-mono">
          Slide {currentSlideIndex + 1} of {totalSlides}
        </span>

        <Button
          variant="default"
          size="sm"
          onClick={handleNext}
          disabled={currentSlideIndex === totalSlides - 1}
          className="gap-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
