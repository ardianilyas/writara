'use client';

import { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  MoreVertical,
  ImageIcon,
  FileText,
  Code2,
  Paperclip,
  Brain,
  SlidersHorizontal,
  Mic,
  Send,
  Loader2,
  Zap,
  Cpu,
} from 'lucide-react';
import { useSession } from '@/features/auth';
import { useCredits } from '@/features/credits/hooks/use-credits';

interface DeckChatInterfaceProps {
  onSubmitTopic: (topic: string, modelId: string) => void;
  isGenerating?: boolean;
}

const STARTER_CARDS = [
  {
    icon: ImageIcon,
    title: 'Investor Pitch Deck',
    description: 'Generate a 10-slide startup pitch deck with market size, business model, and financial milestones.',
    prompt: 'Create a 10-slide investor pitch deck for a B2B SaaS startup focusing on market size, traction, and business model.',
  },
  {
    icon: FileText,
    title: 'Educational Course Deck',
    description: 'Structure a 15-chapter lecture deck complete with learning objectives and detailed speaker notes.',
    prompt: 'Build a comprehensive 15-chapter lecture presentation on Machine Learning Fundamentals for university students.',
  },
  {
    icon: Code2,
    title: 'Executive Strategy',
    description: 'Create a concise executive summary deck with 2-column comparisons and key metric slides.',
    prompt: 'Generate an executive strategy presentation reviewing Q3 engineering roadmaps and product metrics.',
  },
];

export function DeckChatInterface({ onSubmitTopic, isGenerating = false }: DeckChatInterfaceProps) {
  const { data: session } = useSession();
  const { data: creditData } = useCredits();
  const [topic, setTopic] = useState('');
  const [selectedModel, setSelectedModel] = useState<'deepseek-v4-flash' | 'nemotron-30b'>('deepseek-v4-flash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [chaptersLimit, setChaptersLimit] = useState(10);
  const [showChaptersDropdown, setShowChaptersDropdown] = useState(false);

  const userName = session?.user?.name?.split(' ')[0] || 'Creator';
  const creditsBalance = creditData?.totalCredits ?? 3;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim() || isGenerating) return;
    onSubmitTopic(topic.trim(), selectedModel);
  };

  const handleCardClick = (promptText: string) => {
    setTopic(promptText);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
      {/* Background Soft Mesh Ambient Gradient (Matching Reference Image) */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-lime-100/60 via-sky-50/40 to-transparent pointer-events-none -z-0" />

      {/* Header Bar inside Card */}
      <div className="flex items-center justify-between relative z-10 mb-6">
        {/* Model Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            {selectedModel === 'deepseek-v4-flash' ? (
              <>
                <Zap className="h-3.5 w-3.5 text-sky-500" />
                <span>DeepSeek V4 Flash</span>
              </>
            ) : (
              <>
                <Cpu className="h-3.5 w-3.5 text-amber-500" />
                <span>Nemotron 30B Nano</span>
              </>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Model Dropdown List */}
          {showModelDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1">
              <button
                onClick={() => {
                  setSelectedModel('deepseek-v4-flash');
                  setShowModelDropdown(false);
                }}
                className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors ${
                  selectedModel === 'deepseek-v4-flash' ? 'bg-sky-50 border border-sky-100' : 'hover:bg-slate-50'
                }`}
              >
                <Zap className="h-4 w-4 text-sky-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">DeepSeek V4 Flash</div>
                  <div className="text-[10px] text-slate-500">5 Credits · Up to 20 Chapters & Notes</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedModel('nemotron-30b');
                  setShowModelDropdown(false);
                }}
                className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors ${
                  selectedModel === 'nemotron-30b' ? 'bg-amber-50 border border-amber-100' : 'hover:bg-slate-50'
                }`}
              >
                <Cpu className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Nemotron 30B Nano</div>
                  <div className="text-[10px] text-slate-500">1 Credit · Up to 5 Chapters Outline</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Highlight Upgrade Pill Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-lime-300 via-emerald-300 to-sky-300 text-slate-900 text-xs font-bold shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-slate-900" />
            <span>{creditsBalance} Trial Credits Available</span>
          </div>
          <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Center Hero Welcome & Template Suggestions */}
      <div className="my-auto py-8 space-y-10 relative z-10 max-w-4xl mx-auto w-full text-center">
        {/* Animated AI Orb Graphic */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-lime-400 via-sky-400 to-emerald-400 animate-spin blur-md opacity-70" />
          <div className="w-16 h-16 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-lime-400 to-sky-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Welcome Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Welcome, {userName}
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            Start by scripting a topic, and let the AI deck engine take over. Not sure where to start?
          </p>
        </div>

        {/* Starter Template Suggestion Cards (3 Horizontal Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {STARTER_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCardClick(card.prompt)}
                className="bg-white border border-slate-200/90 hover:border-sky-300 rounded-2xl p-5 space-y-3 cursor-pointer shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-sky-50 flex items-center justify-center text-slate-700 group-hover:text-sky-600 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Prompt Textarea Box */}
      <div className="relative z-10 max-w-4xl mx-auto w-full space-y-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-900/5 space-y-3 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 transition-all"
        >
          {/* Multi-line Textarea */}
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-lime-500 mt-1 shrink-0" />
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Start your topic request, and let Writara handle everything..."
              rows={2}
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Bottom Controls Toolbar Inside Prompt Card */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {/* Left Tools */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Attach link"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Attach document"
              >
                <FileText className="h-4 w-4" />
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1" />

              {/* Reasoning Mode Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                <Brain className="h-3.5 w-3.5 text-sky-500" />
                <span>Reasoning</span>
              </div>

              {/* Chapters Limit Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowChaptersDropdown(!showChaptersDropdown)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/60 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                  <span>{chaptersLimit} Chapters</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {showChaptersDropdown && (
                  <div className="absolute bottom-full left-0 mb-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 space-y-0.5">
                    {[5, 10, 15, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setChaptersLimit(num);
                          setShowChaptersDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          chaptersLimit === num ? 'bg-sky-50 text-sky-600 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {num} Chapters
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Tools: Voice & Send */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                type="submit"
                disabled={!topic.trim() || isGenerating}
                className={`p-2.5 rounded-full flex items-center justify-center text-white transition-all shadow-md ${
                  !topic.trim() || isGenerating
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-lime-400 via-emerald-500 to-sky-500 hover:opacity-90 shadow-emerald-500/25 active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Footer Disclaimer */}
        <p className="text-[11px] text-center text-slate-400">
          Writara may take a moment to reason slide structures. Credits are auto-refunded on timeout.
        </p>
      </div>
    </div>
  );
}
