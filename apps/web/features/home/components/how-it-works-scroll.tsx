'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, LayoutGrid, Presentation, Sparkles, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    step: '01',
    title: 'Select Topic & AI Model',
    highlightSentence: 'enter your topic & select your AI model',
    description:
      'Input your presentation topic and choose between Nemotron 30B Nano (1 credit, 5 chapters) for quick overviews or DeepSeek V4 Flash (5 credits, 20 chapters) for exhaustive deep dives.',
    badge: '1 or 5 Credits',
    icon: Cpu,
    details: ['Nemotron 30B (Free)', 'DeepSeek V4 (Pro)', 'Flexible Credit Pool'],
  },
  {
    id: 2,
    step: '02',
    title: 'AI Slide Structuring',
    highlightSentence: 'structure 5+ native slide layouts & speaker notes',
    description:
      'Writara automatically parses your subject into structured slide layouts including Title slides, Bullet Points, 2-Column Comparisons, Key Metrics, and Summary takeaways — complete with detailed speaker notes.',
    badge: 'Automated Layouts',
    icon: LayoutGrid,
    details: ['Speaker Notes Included', '5+ Native Layouts', 'Key Takeaways'],
  },
  {
    id: 3,
    step: '03',
    title: 'Present & Share Deck',
    highlightSentence: 'present your slide deck with total clarity',
    description:
      'Review your finalized slide deck in the interactive presenter viewer. If background generation encounters a timeout, credits are automatically restored to your account balance.',
    badge: 'Zero-Risk Refund',
    icon: Presentation,
    details: ['Interactive Presenter', 'Auto-Refund Guarantee', 'Lifetime Access'],
  },
];

export function HowItWorksScroll() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="how-it-works" className="space-y-12 pt-16 pb-12">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-sky-500" />
          <span>WORKFLOW ENGINE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          How Writara Works
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Scroll through to explore the automated presentation generation process.
        </p>
      </div>

      {/* 2-Column Split: Left Sticky Sentence & Right Scrollable Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
        {/* Left Sticky Interactive Sentence */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Live Process Tracker
            </span>
          </div>

          {/* Dynamic Highlighted Sentence */}
          <div className="space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-snug">
              Simply{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="text-sky-500 underline decoration-sky-300 decoration-wavy decoration-2 underline-offset-4 inline"
                >
                  {STEPS.find((s) => s.id === activeStep)?.highlightSentence}
                </motion.span>
              </AnimatePresence>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Step <span className="font-bold text-slate-900">0{activeStep}</span> of 03 in active focus. Scroll down to advance through the workflow.
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                  activeStep === s.id
                    ? 'bg-sky-500 w-full'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Jump to step ${s.step}`}
              />
            ))}
          </div>
        </div>

        {/* Right Scrollable Step Cards */}
        <div className="lg:col-span-7 space-y-8">
          {STEPS.map((item) => {
            const Icon = item.icon;
            const isActive = activeStep === item.id;

            return (
              <motion.div
                key={item.id}
                onViewportEnter={() => setActiveStep(item.id)}
                viewport={{ amount: 0.5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`bg-white rounded-3xl p-6 sm:p-8 transition-all border-2 space-y-5 ${
                  isActive
                    ? 'border-sky-500 shadow-xl shadow-sky-500/10'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm opacity-90'
                }`}
              >
                {/* Card Top Row: Step Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 px-3 py-1 rounded-full bg-sky-50 border border-sky-100">
                      {item.badge}
                    </span>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-sky-50 text-sky-500' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Card Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Feature Chips */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                  {item.details.map((detail) => (
                    <div
                      key={detail}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]"
                    >
                      <CheckCircle2 className="h-3 w-3 text-sky-500" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
