'use client';

import { Sparkles } from 'lucide-react';

const STEPS = [
  {
    stepNumber: '01.',
    title: 'Select Topic & AI Model',
    description:
      'Choose between Nemotron 30B Nano (1 credit, 5 chapters) for quick overviews or DeepSeek V4 Flash (5 credits, 20 chapters) for exhaustive deep dives.',
  },
  {
    stepNumber: '02.',
    title: 'AI Slide Structuring',
    description:
      'Writara automatically parses your subject into structured slide layouts — Title, 2-Column, Key Metric, and Summary — complete with comprehensive speaker notes.',
  },
  {
    stepNumber: '03.',
    title: 'Present & Share Deck',
    description:
      'Review your finalized slide deck in the interactive presenter viewer. Credits are automatically restored if generation encounters a timeout.',
  },
];

export function HowItWorksScroll() {
  return (
    <section id="how-it-works" className="w-full pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-16 md:gap-24">

          {/* Left Side — Section Header */}
          <div className="md:w-2/5 shrink-0 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span>How it works</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Get started in <span className="italic text-sky-500">seconds</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              From topic input to structured presentation slides in 3 simple steps.
            </p>
          </div>

          {/* Right Side — Numbered Steps */}
          <div className="flex-1 divide-y divide-slate-100">
            {STEPS.map((item) => (
              <div
                key={item.stepNumber}
                className="grid grid-cols-12 gap-4 items-start py-8"
              >
                {/* Step Number */}
                <div className="col-span-2">
                  <span className="text-4xl font-black tracking-tight text-slate-900 block">
                    {item.stepNumber}
                  </span>
                </div>

                {/* Step Content */}
                <div className="col-span-10 space-y-1.5 pt-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
