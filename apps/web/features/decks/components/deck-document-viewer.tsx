'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Users,
  MessageSquareQuote,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { GenerationRecord, Slide } from '../api/use-decks';
import { DeckLoadingState } from './deck-loading-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DeckDocumentViewerProps {
  deck: GenerationRecord;
  onBackToChat: () => void;
}

export function DeckDocumentViewer({ deck, onBackToChat }: DeckDocumentViewerProps) {
  const [copied, setCopied] = useState(false);

  const isGenerating =
    deck.status === 'PENDING' ||
    deck.status === 'GENERATING' ||
    (deck.status as string) === 'IN_PROGRESS';

  const payload = deck.content || deck.generatedContent;

  const handleCopyMarkdown = () => {
    if (!payload) return;

    let text = `# ${payload.generatedTitle || (payload as any).title || deck.topic}\n\n`;
    if (payload.targetAudience) text += `**Target Audience:** ${payload.targetAudience}\n`;
    if (payload.estimatedDurationMinutes) text += `**Estimated Duration:** ${payload.estimatedDurationMinutes} mins\n\n`;

    payload.chapters?.forEach((ch) => {
      text += `## Chapter ${ch.chapterNumber}: ${ch.title}\n\n`;
      if (ch.summary) text += `${ch.summary}\n\n`;

      if (ch.sections?.length) {
        ch.sections.forEach((sec) => {
          text += `### ${sec.heading}\n`;
          if (sec.explanation) text += `${sec.explanation}\n\n`;
          sec.keyPoints?.forEach((pt) => (text += `- ${pt}\n`));
          if (sec.speakerScript) {
            text += `\n> **Presenter Script:** ${sec.speakerScript}\n\n`;
          }
        });
      } else if (ch.slides?.length) {
        ch.slides.forEach((slide) => {
          text += `### ${slide.title}\n`;
          if (slide.subtitle) text += `*${slide.subtitle}*\n\n`;

          const points =
            slide.bulletPoints ||
            slide.leftColumnContent ||
            slide.rightColumnContent ||
            [];
          points.forEach((pt) => (text += `- ${pt}\n`));

          if (slide.speakerNotes) {
            text += `\n> **Speaker Notes:** ${slide.speakerNotes}\n\n`;
          }
        });
      }

      const takeaways = ch.chapterTakeaways || ch.keyTakeaways;
      if (takeaways?.length) {
        text += `### Key Takeaways:\n`;
        takeaways.forEach((tk) => (text += `- ${tk}\n`));
        text += `\n`;
      }
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Document copied to clipboard as Markdown!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isGenerating) {
    return <DeckLoadingState topic={deck.topic} onBack={onBackToChat} />;
  }

  return (
    <Card className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-card border-border shadow-xs overflow-y-auto max-h-[calc(100vh-4.5rem)] scrollbar-thin">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBackToChat} className="gap-2 text-xs font-semibold">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Generator</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyMarkdown} className="gap-1.5 text-xs font-semibold">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs font-semibold hidden sm:flex">
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      {/* Main Document Content Canvas */}
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Document Header */}
        <div className="space-y-4 border-b border-border pb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200">
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              Topic Guide
            </Badge>

            {payload?.estimatedDurationMinutes && (
              <Badge variant="outline" className="text-xs font-medium text-muted-foreground gap-1">
                <Clock className="h-3 w-3" />
                <span>{payload.estimatedDurationMinutes} Mins Read</span>
              </Badge>
            )}

            {payload?.targetAudience && (
              <Badge variant="outline" className="text-xs font-medium text-muted-foreground gap-1.5 h-auto py-1 max-w-full text-wrap text-left break-words leading-relaxed">
                <Users className="h-3.5 w-3.5 shrink-0 text-sky-500" />
                <span>Target: {payload.targetAudience}</span>
              </Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
            {payload?.generatedTitle || (payload as any)?.title || deck.topic}
          </h1>
        </div>

        {/* Executive Summary Card */}
        {(payload?.executiveSummary || payload?.chapters?.[0]?.summary) && (
          <Card className="p-5 bg-sky-50/50 border-sky-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
              <Sparkles className="h-4 w-4" />
              <span>Executive Overview</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {payload.executiveSummary || payload.chapters?.[0]?.summary}
            </p>
          </Card>
        )}

        {/* Chapter Modules */}
        {payload?.chapters && payload.chapters.length > 0 ? (
          <div className="space-y-10">
            {payload.chapters.map((chapter, chIdx) => (
              <section key={chIdx} className="space-y-6 border-b border-border/60 pb-8 last:border-none">
                {/* Chapter Title Badge */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                    Chapter {chapter.chapterNumber || chIdx + 1}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                    {chapter.title}
                  </h2>
                  {chapter.summary && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {chapter.summary}
                    </p>
                  )}
                </div>

                {/* New Educational Sections Format */}
                {chapter.sections && chapter.sections.length > 0 ? (
                  <div className="space-y-5">
                    {chapter.sections.map((sec, secIdx) => (
                      <div key={secIdx} className="space-y-3 bg-card border border-border/80 rounded-xl p-5 shadow-2xs">
                        <h3 className="text-sm sm:text-base font-bold text-foreground">
                          {sec.heading}
                        </h3>

                        {sec.explanation && (
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {sec.explanation}
                          </p>
                        )}

                        {sec.keyPoints && sec.keyPoints.length > 0 && (
                          <ul className="space-y-2 text-xs text-slate-700 pt-1">
                            {sec.keyPoints.map((pt, ptIdx) => (
                              <li key={ptIdx} className="flex items-start gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {sec.speakerScript && (
                          <div className="mt-3 bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
                            <MessageSquareQuote className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-bold text-[11px] uppercase tracking-wider text-amber-700 block">Presenter Talking Points</span>
                              <p className="leading-relaxed italic">{sec.speakerScript}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Legacy Slides Fallback */
                  chapter.slides?.map((slide, slideIdx) => {
                    const points =
                      slide.bulletPoints ||
                      slide.leftColumnContent ||
                      slide.rightColumnContent ||
                      [];

                    return (
                      <div key={slideIdx} className="space-y-3 bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-foreground">
                            {slide.title}
                          </h3>
                          {slide.subtitle && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {slide.subtitle}
                            </p>
                          )}
                        </div>

                        {points.length > 0 && (
                          <ul className="space-y-2 text-xs text-slate-700 pt-1">
                            {points.map((pt, ptIdx) => (
                              <li key={ptIdx} className="flex items-start gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {slide.speakerNotes && (
                          <div className="mt-3 bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
                            <MessageSquareQuote className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-bold text-[11px] uppercase tracking-wider text-amber-700 block">Presenter Talking Script</span>
                              <p className="leading-relaxed italic">{slide.speakerNotes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Chapter Key Takeaways */}
                {(chapter.chapterTakeaways?.length || chapter.keyTakeaways?.length) && (
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-bold text-emerald-900 block">Chapter Takeaways</span>
                    <ul className="space-y-1.5 text-xs text-emerald-800">
                      {(chapter.chapterTakeaways || chapter.keyTakeaways)?.map((takeaway, tkIdx) => (
                        <li key={tkIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground text-xs">
            No topic content generated yet.
          </div>
        )}
      </div>
    </Card>
  );
}
