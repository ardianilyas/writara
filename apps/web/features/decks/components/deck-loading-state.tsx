'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Brain,
  BookOpen,
  FileText,
  MessageSquareQuote,
  Clock,
  Play,
  RotateCcw,
  Pause,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DeckLoadingStateProps {
  topic?: string;
  createdAt?: string | Date;
  onBack?: () => void;
}

const PIPELINE_STEPS = [
  {
    id: 1,
    title: 'Curriculum Planning',
    description: 'Deconstructing topic intent & defining target audience thesis...',
    icon: Brain,
  },
  {
    id: 2,
    title: 'Chapter Structuring',
    description: 'Outlining educational chapters & key subtopics...',
    icon: BookOpen,
  },
  {
    id: 3,
    title: 'Deep Content Synthesis',
    description: 'Writing 3-5 sentence section explanations & technical bullet points...',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Presenter Scripting',
    description: 'Preparing verbal talking scripts & chapter takeaways...',
    icon: MessageSquareQuote,
  },
];

const MICRO_TIPS = [
  {
    id: 1,
    category: 'PRO TIP',
    text: 'Structuring explanations into 3 core takeaways increases audience topic retention by over 40%.',
  },
  {
    id: 2,
    category: 'AI PIPELINE',
    text: 'DeepSeek V4 Flash processes up to 12,000 tokens of in-depth educational material in under 20 seconds.',
  },
  {
    id: 3,
    category: 'PRESENTATION SCRIPT',
    text: 'The Presenter Talking Script provides exact verbal phrases to speak out loud when presenting to your audience.',
  },
  {
    id: 4,
    category: 'EXPORT READY',
    text: 'You can copy the generated guide as clean Markdown directly into Notion, Obsidian, or print it to PDF.',
  },
];

export function DeckLoadingState({
  topic = 'Laravel Basics: Modern Web Development',
  createdAt,
  onBack,
}: DeckLoadingStateProps) {
  // Calculate real-world elapsed seconds from creation timestamp
  const getInitialSeconds = () => {
    if (!createdAt) return 0;
    const startMs = new Date(createdAt).getTime();
    if (isNaN(startMs)) return 0;
    const elapsed = Math.floor((Date.now() - startMs) / 1000);
    return Math.max(0, elapsed);
  };

  const [seconds, setSeconds] = useState(getInitialSeconds);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Sync elapsed seconds when createdAt prop updates
  useEffect(() => {
    if (createdAt) {
      setSeconds(getInitialSeconds());
    }
  }, [createdAt]);

  // Timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Advance pipeline steps based on time
  useEffect(() => {
    if (seconds < 4) setActiveStepIndex(0);
    else if (seconds < 9) setActiveStepIndex(1);
    else if (seconds < 15) setActiveStepIndex(2);
    else setActiveStepIndex(3);
  }, [seconds]);

  // Micro-tips rotation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % MICRO_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const progressPercent = Math.min(100, Math.round((seconds / 20) * 100));

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSeconds(0);
    setActiveStepIndex(0);
    setTipIndex(0);
    setIsPlaying(true);
  };

  const currentTip = MICRO_TIPS[tipIndex] || MICRO_TIPS[0];

  return (
    <Card className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-card text-foreground border-border shadow-sm max-w-3xl mx-auto space-y-8 select-none min-h-[560px] rounded-xl relative">
      {/* Top Header & Test Controls */}
      <div className="flex items-center justify-between border-b border-border pb-4 z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          )}
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-xs border-sky-200 bg-sky-50 text-sky-700"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
            <span>AI Reasoning Command Center</span>
          </Badge>
        </div>

        {/* Demo Animation Control Toolbar */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </Button>
        </div>
      </div>

      {/* Main Hero Header (Clean Light Mode) */}
      <div className="text-center space-y-3 max-w-md mx-auto z-10">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-500 flex items-center justify-center mx-auto shadow-2xs">
          <Loader2 className="h-7 w-7 animate-spin text-sky-500" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Synthesizing "{topic}"
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-mono">
            <Clock className="h-3.5 w-3.5 text-sky-500" />
            <span>Elapsed: {formatTime(seconds)}</span>
            <span>•</span>
            <span className="font-semibold text-sky-600">{progressPercent}% Complete</span>
          </div>
        </div>
      </div>

      {/* Single Accent Progress Bar */}
      <div className="space-y-1.5 z-10">
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative border border-border">
          <div
            className="h-full bg-sky-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4-Step Pipeline Cards Grid (Strict 2-Color Light Palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 z-10">
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isActive = idx === activeStepIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-300 shadow-2xs'
                  : isDone
                  ? 'bg-muted/50 border-border opacity-90'
                  : 'bg-card border-border/60 opacity-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-2xs'
                      : isDone
                      ? 'bg-slate-900 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold ${
                        isActive ? 'text-sky-950' : 'text-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                    {isActive && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded-xs">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rotating Micro-Tips Banner (Clean Slate/Sky Palette) */}
      <Card className="p-4 bg-slate-50 border-slate-200 space-y-1.5 transition-all duration-300 z-10 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-600">
            <Zap className="h-3.5 w-3.5 text-sky-500" />
            <span>{currentTip?.category}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            {tipIndex + 1} / {MICRO_TIPS.length}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed italic">
          "{currentTip?.text}"
        </p>
      </Card>
    </Card>
  );
}
