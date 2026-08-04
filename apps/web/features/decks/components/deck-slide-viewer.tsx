'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Sparkles, Loader2, RefreshCw } from 'lucide-react';
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
  const allSlides: { slide: Slide; chapterTitle: string }[] = [];
  if (payload?.chapters) {
    payload.chapters.forEach((chapter) => {
      chapter.slides.forEach((slide) => {
        allSlides.push({ slide, chapterTitle: chapter.title });
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

              {currentSlide.layout === 'BULLET_POINTS' && currentSlide.bulletPoints && (
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentSlide.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {currentSlide.layout === 'TWO_COLUMN' && (
                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
                    {currentSlide.leftColumnContent?.map((item, i) => (
                      <p key={i} className="text-slate-300">{item}</p>
                    ))}
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-1">
                    {currentSlide.rightColumnContent?.map((item, i) => (
                      <p key={i} className="text-sky-300">{item}</p>
                    ))}
                  </div>
                </div>
              )}

              {currentSlide.layout === 'KEY_METRIC' && currentSlide.keyMetric && (
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-6 text-center space-y-1">
                  <span className="text-4xl font-black text-sky-400 block tracking-tight">
                    {currentSlide.keyMetric.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {currentSlide.keyMetric.label}
                  </span>
                </div>
              )}
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
