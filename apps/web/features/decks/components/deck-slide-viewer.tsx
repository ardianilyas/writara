'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  ListOrdered,
  TrendingUp,
} from 'lucide-react';
import { GenerationRecord, Slide } from '../api/use-decks';

interface DeckSlideViewerProps {
  deck: GenerationRecord;
  onBackToChat: () => void;
}

export function DeckSlideViewer({ deck, onBackToChat }: DeckSlideViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);

  // Extract all slides from generated content chapters
  const allSlides: { slide: Slide; chapterTitle: string }[] = [];
  if (deck.generatedContent?.chapters) {
    deck.generatedContent.chapters.forEach((chapter) => {
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

  return (
    <div className="w-full h-full flex flex-col justify-between bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Chat</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          <div>
            <h2 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {deck.topic}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{deck.modelId}</span>
              <span>•</span>
              <span>{totalSlides} Slides</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              showSpeakerNotes ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Notes</span>
          </button>
          <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      {currentSlide ? (
        <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Slide Preview Box */}
          <div
            className={`bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between min-h-[380px] shadow-2xl relative ${
              showSpeakerNotes ? 'lg:col-span-8' : 'lg:col-span-12'
            }`}
          >
            {/* Header / Chapter Label */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                {currentItem.chapterTitle}
              </span>
              <span className="text-xs font-mono text-slate-600">
                Slide {currentSlideIndex + 1} / {totalSlides}
              </span>
            </div>

            {/* Slide Content based on layout */}
            <div className="my-auto space-y-6">
              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {currentSlide.title}
                </h3>
                {currentSlide.subtitle && (
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Layout Specific Renderers */}
              {currentSlide.layout === 'BULLET_POINTS' && currentSlide.bulletPoints && (
                <ul className="space-y-2.5 text-xs text-slate-300">
                  {currentSlide.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {currentSlide.layout === 'TWO_COLUMN' && (
                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                    {currentSlide.leftColumnContent?.map((item, i) => (
                      <p key={i} className="text-slate-300">{item}</p>
                    ))}
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                    {currentSlide.rightColumnContent?.map((item, i) => (
                      <p key={i} className="text-sky-300">{item}</p>
                    ))}
                  </div>
                </div>
              )}

              {currentSlide.layout === 'KEY_METRIC' && currentSlide.keyMetric && (
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6 text-center space-y-1">
                  <span className="text-5xl font-black text-sky-400 block tracking-tight">
                    {currentSlide.keyMetric.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {currentSlide.keyMetric.label}
                  </span>
                </div>
              )}
            </div>

            {/* Visual Suggestion Tag */}
            {currentSlide.visualSuggestion && (
              <div className="pt-4 border-t border-slate-900/80 flex items-center gap-2 text-[11px] text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span className="truncate">Visual Idea: {currentSlide.visualSuggestion}</span>
              </div>
            )}
          </div>

          {/* Speaker Notes Side Drawer */}
          {showSpeakerNotes && (
            <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 border-b border-slate-800 pb-2">
                  <FileText className="h-4 w-4" />
                  <span>Speaker Notes</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentSlide.speakerNotes}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200 block">Presenting Tip</span>
                <p>Pause after stating the core thesis before transitioning to bullet points.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="my-auto py-12 text-center text-slate-500">
          <p>No slides found for this deck.</p>
        </div>
      )}

      {/* Bottom Navigation Toolbar */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <button
          onClick={handlePrev}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Slide {currentSlideIndex + 1} of {totalSlides}
        </span>

        <button
          onClick={handleNext}
          disabled={currentSlideIndex === totalSlides - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
