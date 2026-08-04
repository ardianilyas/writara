'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, Send, Loader2, Zap, Cpu, SlidersHorizontal, Presentation } from 'lucide-react';
import { useSession } from '@/features/auth';
import { useCredits } from '@/features/credits/hooks/use-credits';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DeckChatInterfaceProps {
  onSubmitTopic: (topic: string, modelId: string, slideCount?: number) => void;
  isGenerating?: boolean;
}

const STARTER_CARDS = [
  {
    title: 'Investor Pitch Deck',
    description: '10-slide pitch deck with market size, business model, and milestones.',
    prompt: 'Create a 10-slide investor pitch deck for a B2B SaaS startup focusing on market size, traction, and business model.',
  },
  {
    title: 'Educational Course Deck',
    description: '15-chapter lecture deck complete with learning objectives and speaker notes.',
    prompt: 'Build a comprehensive 15-chapter lecture presentation on Machine Learning Fundamentals for university students.',
  },
  {
    title: 'Product Roadmap Update',
    description: 'Quarterly roadmap presentation with feature priorities and timelines.',
    prompt: 'Generate a crisp product roadmap presentation covering Q1-Q4 engineering goals and key metrics.',
  },
];

export function DeckChatInterface({ onSubmitTopic, isGenerating = false }: DeckChatInterfaceProps) {
  const { data: session } = useSession();
  const { data: creditData } = useCredits();
  const [topic, setTopic] = useState('');
  const [selectedModel, setSelectedModel] = useState<'deepseek-v4-flash' | 'nemotron-30b'>('nemotron-30b');
  const [chapterCount, setChapterCount] = useState(5);

  const userName = session?.user?.name?.split(' ')[0] || 'Creator';
  const creditsBalance = creditData?.totalCredits ?? 3;
  const isFreeModel = selectedModel === 'nemotron-30b';

  const handleModelChange = (model: 'deepseek-v4-flash' | 'nemotron-30b') => {
    setSelectedModel(model);
    if (model === 'nemotron-30b' && chapterCount > 5) {
      setChapterCount(5);
    }
  };

  const availableChapterOptions = selectedModel === 'nemotron-30b'
    ? [3, 4, 5]
    : [3, 5, 8, 10, 12, 15];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim() || isGenerating) return;
    onSubmitTopic(topic.trim(), selectedModel, chapterCount);
  };

  return (
    <Card className="w-full h-full flex flex-col justify-between p-6 bg-card border-border shadow-xs relative overflow-hidden">
      {/* Top Controls: Header Info & Credits */}
      <div className="flex items-center justify-between z-10 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs font-semibold bg-muted/60">
            <Presentation className="h-3.5 w-3.5 text-sky-500" />
            <span>Writara AI Generator</span>
          </Badge>
        </div>

        {/* Credit Balance Badge */}
        <Badge variant="outline" className="gap-1.5 px-3 py-1 font-semibold text-xs border-sky-200 bg-sky-50 text-sky-700">
          <Sparkles className="h-3.5 w-3.5 text-sky-500" />
          <span>{creditsBalance} Trial Credits</span>
        </Badge>
      </div>

      {/* Hero Welcome & Starter Cards */}
      <div className="my-auto py-6 space-y-8 max-w-3xl mx-auto w-full text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-200 text-sky-500 flex items-center justify-center mx-auto mb-3">
            <Presentation className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Welcome, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Type your topic below or select a template starter card to generate an educational topic guide.
          </p>
        </div>

        {/* Starter Cards using Shadcn Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {STARTER_CARDS.map((card, idx) => (
            <Card
              key={idx}
              onClick={() => setTopic(card.prompt)}
              className="p-4 hover:border-sky-400 cursor-pointer transition-colors shadow-2xs hover:shadow-xs border-border"
            >
              <h3 className="text-xs font-bold text-foreground mb-1">{card.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{card.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Chat Prompt Textarea Box */}
      <div className="max-w-3xl mx-auto w-full space-y-2">
        <form onSubmit={handleSubmit} className="bg-background border border-border rounded-xl p-3 space-y-3 shadow-xs">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your educational topic (e.g. 'Laravel Basics', 'Quantum Computing Intro')..."
            rows={2}
            className="w-full text-xs text-foreground placeholder:text-muted-foreground bg-transparent border-none outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2 border-t border-border flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {/* Model Selector Dropdown inside Chat Section */}
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold border-border bg-muted/30 hover:bg-muted/60 text-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground font-normal">Model:</span>
                      {selectedModel === 'deepseek-v4-flash' ? (
                        <>
                          <Zap className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                          <span className="font-bold">DeepSeek V4 Flash</span>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-sky-100 text-sky-700 font-bold border-none">Pro</Badge>
                        </>
                      ) : (
                        <>
                          <Cpu className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="font-bold">Nemotron 30B Nano</span>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-amber-100 text-amber-700 font-bold border-none">Free</Badge>
                        </>
                      )}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1" />
                  </Button>
                } />
                <DropdownMenuContent align="start" className="w-72 p-2">
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1">Select AI Generation Model</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleModelChange('deepseek-v4-flash')}
                    className={`flex flex-col items-start gap-1 p-2 cursor-pointer rounded-lg ${
                      selectedModel === 'deepseek-v4-flash' ? 'bg-sky-50 text-sky-900 font-medium border border-sky-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Zap className="h-3.5 w-3.5 text-sky-500" />
                        <span>DeepSeek V4 Flash</span>
                      </div>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-sky-100 text-sky-700 font-bold">Pro · Paid</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-snug">
                      Unlocks up to 15 deep chapters with extended 12k token explanations & speaker scripts.
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleModelChange('nemotron-30b')}
                    className={`flex flex-col items-start gap-1 p-2 cursor-pointer rounded-lg mt-1 ${
                      selectedModel === 'nemotron-30b' ? 'bg-amber-50 text-amber-900 font-medium border border-amber-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Cpu className="h-3.5 w-3.5 text-amber-500" />
                        <span>Nemotron 30B Nano</span>
                      </div>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-amber-100 text-amber-700 font-bold">Free</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground leading-snug">
                      Standard queue free model. Capped at max 5 chapters per generation.
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Chapters Count Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground font-medium hover:text-foreground">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>{chapterCount} Chapters</span>
                    {selectedModel === 'nemotron-30b' && (
                      <span className="text-[10px] text-amber-600 font-semibold">(Max 5)</span>
                    )}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                } />
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                    {selectedModel === 'nemotron-30b' ? 'Chapter Count (Free Model Max 5)' : 'Chapter Count'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableChapterOptions.map((num) => (
                    <DropdownMenuItem
                      key={num}
                      onClick={() => setChapterCount(num)}
                      className={`text-xs cursor-pointer ${chapterCount === num ? 'font-bold text-sky-600 bg-sky-50' : ''}`}
                    >
                      {num} Chapters
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="sm"
              disabled={!topic.trim() || isGenerating}
              className="gap-2 font-bold bg-sky-500 hover:bg-sky-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate Guide</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="text-[10px] text-center text-muted-foreground">
          Credits are automatically refunded if background generation encounters a timeout.
        </p>
      </div>
    </Card>
  );
}
