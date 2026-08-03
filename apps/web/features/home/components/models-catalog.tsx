'use client';

import { motion } from 'motion/react';
import { Cpu, Zap, Sparkles, Check, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function ModelsCatalog() {
  return (
    <section id="models" className="w-full pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <Cpu className="h-3.5 w-3.5 text-sky-500" />
            <span>AI Intelligence Engines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Select Your Intelligence Engine
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tailor your slide depth with instant lightweight outlines or exhaustive 20-chapter deep dives.
          </p>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Nemotron 30B Nano */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-7 md:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors relative overflow-hidden group"
          >
            {/* Background subtle gradient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-slate-100/50 rounded-full blur-2xl -z-10 group-hover:bg-slate-100 transition-colors" />

            <div className="space-y-6">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-900 shrink-0 shadow-xs">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">
                      Nemotron 30B Nano
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      nvidia/nemotron-3-nano-30b-a3b:free
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  Standard
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                Fast, lightweight reasoning engine designed for rapid deck outlines, executive summaries, and concise presentations up to 5 chapters.
              </p>

              {/* Visual Spec Matrix */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Generation Speed</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Standard Queue (~10-15s)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Chapter Limit</span>
                  <span className="font-bold text-slate-900">Up to 5 Chapters</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Slide Layouts</span>
                  <span className="font-bold text-slate-900">Title, Bullet, Summary</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Quick outline generation for short pitches</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Standard speaker notes included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Ideal for quick overview slides</span>
                </li>
              </ul>
            </div>

            {/* Card Footer Price & Action */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Cost per deck</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">1</span>
                  <span className="text-xs font-bold text-slate-600">Credit</span>
                </div>
              </div>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <span>Use Nemotron</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: DeepSeek V4 Flash (Flagship Pro) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 text-white rounded-3xl p-7 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group border border-slate-800"
          >
            {/* Electric Sky Blue ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl -z-10 group-hover:bg-sky-500/25 transition-colors" />

            <div className="space-y-6">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-500/30">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight flex items-center gap-2">
                      DeepSeek V4 Flash
                      <Sparkles className="h-4 w-4 text-sky-400" />
                    </h3>
                    <p className="text-xs font-mono text-sky-300/70 mt-0.5">
                      deepseek/deepseek-v4-flash
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 shrink-0">
                  Pro Flagship
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed">
                High-capacity AI reasoning engine engineered for comprehensive 20-chapter deep dives, multi-column analysis, and rich speaker notes.
              </p>

              {/* Visual Spec Matrix */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Generation Speed</span>
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    High Throughput
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Chapter Limit</span>
                  <span className="font-bold text-white">Up to 20 Chapters</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Slide Layouts</span>
                  <span className="font-bold text-white">All + 2-Column & Metric</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-sky-400 shrink-0" />
                  <span>Exhaustive multi-chapter reasoning & structure</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-sky-400 shrink-0" />
                  <span>Comprehensive speaker notes & key takeaways</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-sky-400 shrink-0" />
                  <span>2-Column comparison & key metric slide types</span>
                </li>
              </ul>
            </div>

            {/* Card Footer Price & Action */}
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Cost per deck</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">5</span>
                  <span className="text-xs font-bold text-sky-400">Credits</span>
                </div>
              </div>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors shadow-md shadow-sky-500/25"
              >
                <span>Use DeepSeek</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
