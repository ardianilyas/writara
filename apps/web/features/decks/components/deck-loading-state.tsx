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
    <Card className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-slate-950 text-white border-slate-800 shadow-2xl max-w-3xl mx-auto space-y-8 select-none min-h-[580px] rounded-2xl relative overflow-hidden">
      {/* Background Radial Glow Effect */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-sky-500/20 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header & Test Controls */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-1.5 text-xs font-semibold border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          )}
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-xs border-sky-500/30 bg-sky-500/10 text-sky-400"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
            <span>AI Reasoning Command Center</span>
          </Badge>
        </div>

        {/* Demo Animation Control Toolbar */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-xs font-medium gap-1 text-slate-400 hover:text-white hover:bg-slate-900"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs font-medium gap-1 text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restart</span>
          </Button>
        </div>
      </div>

      {/* Main Hero Pulsing Command Header */}
      <div className="text-center space-y-4 max-w-md mx-auto z-10 relative">
        <div className="relative inline-flex items-center justify-center">
          {/* Animated Glow Ring */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-400 blur-lg opacity-40 animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-xl flex items-center justify-center text-sky-400 relative">
            <Loader2 className="h-7 w-7 animate-spin text-sky-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Synthesizing "{topic}"
          </h2>
          <div className="flex items-center justify-center gap-2.5 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1 text-sky-400 font-bold">
              <Clock className="h-3.5 w-3.5" />
              <span>Elapsed: {formatTime(seconds)}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-bold">{progressPercent}% Complete</span>
          </div>
        </div>
      </div>

      {/* Custom Gradient Progress Bar */}
      <div className="space-y-1.5 z-10">
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-400 transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          </div>
        </div>
      </div>

      {/* 4-Step Interactive Pipeline Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 z-10">
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isActive = idx === activeStepIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-sky-500/10 border-sky-500/50 text-white ring-1 ring-sky-500/40 shadow-lg shadow-sky-500/5'
                  : isDone
                  ? 'bg-slate-900/90 border-slate-800/90 text-slate-300 hover:border-slate-700'
                  : 'bg-slate-900/40 border-slate-800/40 opacity-40 hover:opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold ${
                        isActive ? 'text-sky-300' : isDone ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    {isActive && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-sky-400 bg-sky-500/20 border border-sky-500/30 px-1.5 py-0.2 rounded-xs">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rotating Micro-Tips Banner */}
      <Card className="p-4 bg-slate-900/90 border-slate-800/90 space-y-1.5 transition-all duration-500 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
            <Zap className="h-3.5 w-3.5 text-sky-400" />
            <span>{currentTip?.category}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {tipIndex + 1} / {MICRO_TIPS.length}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "{currentTip?.text}"
        </p>
      </Card>
    </Card>
  );
}
