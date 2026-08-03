'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    stepNumber: '01.',
    title: 'Select Topic & AI Model',
    highlightSentence: 'select your topic & AI engine',
    description:
      'Choose between Nemotron 30B Nano (1 credit, 5 chapters) for quick overviews or DeepSeek V4 Flash (5 credits, 20 chapters) for exhaustive deep dives.',
    badge: '1 or 5 Credits',
  },
  {
    id: 2,
    stepNumber: '02.',
    title: 'AI Slide Structuring',
    highlightSentence: 'structure 5+ native slide layouts & speaker notes',
    description:
      'Writara automatically parses your subject into structured slide layouts (Title, 2-Column, Key Metric, Summary) complete with comprehensive speaker notes.',
    badge: 'Automated Layouts',
  },
  {
    id: 3,
    stepNumber: '03.',
    title: 'Present & Share Deck',
    highlightSentence: 'present your slide deck with total clarity',
    description:
      'Review your finalized slide deck in the interactive presenter viewer. If background generation encounters a timeout, credits are automatically restored.',
    badge: 'Zero-Risk Refund',
  },
];

export function HowItWorksScroll() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section id="how-it-works" className="w-full pt-20 pb-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
        {/* Left Sticky Container (Stays pinned smoothly until bottom of section) */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6 self-start">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            <span>How it works</span>
          </div>

          {/* Display Title & Subtitle */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Get started in <span className="italic text-sky-500 font-serif">seconds</span>
            </h2>

            {/* Dynamic Highlighted Sentence */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Step 0{activeStep} of 03
              </span>
              <p className="text-base font-bold text-slate-800 leading-snug">
                Simply{' '}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="text-sky-500 underline decoration-sky-300 decoration-wavy decoration-2 underline-offset-4 inline"
                  >
                    {STEPS.find((s) => s.id === activeStep)?.highlightSentence}
                  </motion.span>
                </AnimatePresence>
                .
              </p>
            </div>
          </div>

          {/* Interactive Step Progress Pills */}
          <div className="flex items-center gap-2 pt-2">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeStep === s.id
                    ? 'bg-sky-500 w-10'
                    : 'bg-slate-200 hover:bg-slate-300 w-4'
                }`}
                aria-label={`Jump to step ${s.stepNumber}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Typography-Driven Step List (Paced for smooth scroll reveal) */}
        <div className="lg:col-span-7 space-y-36 sm:space-y-48 lg:space-y-56 py-12">
          {STEPS.map((item) => {
            const isActive = activeStep === item.id;

            return (
              <motion.div
                key={item.id}
                onViewportEnter={() => setActiveStep(item.id)}
                viewport={{ amount: 0.6, margin: '-10% 0px -10% 0px' }}
                initial={{ opacity: 0.25 }}
                animate={{
                  opacity: isActive ? 1 : 0.25,
                  scale: isActive ? 1 : 0.98,
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="grid grid-cols-12 gap-6 items-start cursor-default select-none min-h-[160px]"
              >
                {/* Step Number */}
                <div className="col-span-3 sm:col-span-2">
                  <span
                    className={`text-5xl sm:text-6xl font-black tracking-tight transition-colors duration-500 block ${
                      isActive ? 'text-slate-900' : 'text-slate-300'
                    }`}
                  >
                    {item.stepNumber}
                  </span>
                </div>

                {/* Step Content */}
                <div className="col-span-9 sm:col-span-10 space-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    <h3
                      className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-500 ${
                        isActive ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'
                      }`}
                    >
                      {item.title}
                    </h3>

                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] font-bold uppercase tracking-wider text-sky-600 px-3 py-1 rounded-full bg-sky-50 border border-sky-100"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </div>

                  <p
                    className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${
                      isActive ? 'text-slate-600 font-normal' : 'text-slate-400 font-normal'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
