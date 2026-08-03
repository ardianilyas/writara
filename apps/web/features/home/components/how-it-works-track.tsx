'use client';

import { motion } from 'motion/react';
import { Cpu, LayoutGrid, Presentation, ArrowRight, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Select Topic & AI Model',
    description:
      'Enter your subject topic and pick your AI engine — Nemotron 30B for fast overview decks or DeepSeek V4 Flash for exhaustive 20-chapter deep dives.',
    badge: '1 or 5 Credits',
    icon: Cpu,
    details: ['Nemotron 30B (Free)', 'DeepSeek V4 (Pro)'],
  },
  {
    step: '02',
    title: 'AI Slide Structuring',
    description:
      'Writara parses your subject into presentation-native slide layouts (Title, 2-Column, Bullet Points, Key Metric, Summary) complete with speaker notes.',
    badge: 'Auto Layouts',
    icon: LayoutGrid,
    details: ['Speaker Notes Included', '5+ Native Layouts'],
  },
  {
    step: '03',
    title: 'Present & Share Deck',
    description:
      'Review your structured slide deck in the interactive presentation viewer, complete with key learning takeaways for your audience.',
    badge: 'Zero Risk Refund',
    icon: Presentation,
    details: ['Interactive Viewer', 'Export & Present'],
  },
];

export function HowItWorksTrack() {
  return (
    <section id="how-it-works" className="space-y-12 pt-12 pb-6">
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
          From topic input to structured presentation slides in 3 seamless steps.
        </p>
      </div>

      {/* Connected Horizontal Kinetic Track */}
      <div className="relative max-w-5xl mx-auto">
        {/* Connecting Progress Line behind cards (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-16 right-16 h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 -translate-y-6 z-0 rounded-full opacity-30" />

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white border-2 border-slate-200 hover:border-sky-500 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all flex flex-col justify-between space-y-6 group cursor-default"
              >
                {/* Step Top Header: Number Pill & Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 font-black text-sm flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-100">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Step Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Micro Detail Pills */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                  {item.details.map((detail) => (
                    <span
                      key={detail}
                      className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold"
                    >
                      {detail}
                    </span>
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
