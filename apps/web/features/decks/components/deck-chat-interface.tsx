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
  onSubmitTopic: (topic: string, modelId: string) => void;
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
    title: 'Executive Strategy Deck',
    description: 'Executive summary deck with 2-column comparisons and key metric slides.',
    prompt: 'Generate an executive strategy presentation reviewing Q3 engineering roadmaps and product metrics.',
  },
];

export function DeckChatInterface({ onSubmitTopic, isGenerating = false }: DeckChatInterfaceProps) {
  const { data: session } = useSession();
  const { data: creditData } = useCredits();
  const [topic, setTopic] = useState('');
  const [selectedModel, setSelectedModel] = useState<'deepseek-v4-flash' | 'nemotron-30b'>('deepseek-v4-flash');
  const [chaptersLimit, setChaptersLimit] = useState(10);

  const userName = session?.user?.name?.split(' ')[0] || 'Creator';
  const creditsBalance = creditData?.totalCredits ?? 3;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim() || isGenerating) return;
    onSubmitTopic(topic.trim(), selectedModel);
  };

  return (
    <Card className="w-full h-full flex flex-col justify-between p-6 bg-card border-border shadow-xs relative overflow-hidden">
      {/* Top Controls: Model Selector & Credits */}
      <div className="flex items-center justify-between z-10 border-b border-border pb-4">
        {/* Model Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" size="sm" className="gap-2 font-semibold text-xs">
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
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          } />
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Select AI Model</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedModel('deepseek-v4-flash')} className="flex flex-col items-start gap-0.5 cursor-pointer">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Zap className="h-3.5 w-3.5 text-sky-500" />
                <span>DeepSeek V4 Flash</span>
              </div>
              <span className="text-[10px] text-muted-foreground">5 Credits · 20 Chapters & Speaker Notes</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedModel('nemotron-30b')} className="flex flex-col items-start gap-0.5 cursor-pointer">
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <Cpu className="h-3.5 w-3.5 text-amber-500" />
                <span>Nemotron 30B Nano</span>
              </div>
              <span className="text-[10px] text-muted-foreground">1 Credit · 5 Chapters Quick Outline</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Credit Badge */}
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
            Script your topic or pick a template below to generate a presentation deck.
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

      {/* Bottom Prompt Textarea Box */}
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
            placeholder="Type your presentation topic..."
            rows={2}
            className="w-full text-xs text-foreground placeholder:text-muted-foreground bg-transparent border-none outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2 border-t border-border">
            {/* Chapters Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="xs" className="gap-1.5 text-xs text-muted-foreground font-medium">
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>{chaptersLimit} Chapters</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              } />
              <DropdownMenuContent align="start">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Chapter Count</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[5, 10, 15, 20].map((num) => (
                  <DropdownMenuItem key={num} onClick={() => setChaptersLimit(num)} className="text-xs cursor-pointer">
                    {num} Chapters
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
                  <span>Generate Deck</span>
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
