'use client';

import { motion } from 'motion/react';
import { LayoutGrid, Cpu, RefreshCw, Sparkles, Layers, Zap } from 'lucide-react';

export function HeroUnboxingCards() {
  return (
    <div className="w-full max-w-4xl mx-auto pt-8 flex flex-col items-center justify-center relative">
      {/* 3 Floating Cards popping out of the open box */}
      <div className="relative w-full h-[220px] flex items-end justify-center gap-4 sm:gap-6 z-10">
        {/* Card 1 (Left tilted) */}
        <motion.div
          initial={{ y: 60, opacity: 0, rotate: -8 }}
          animate={{ y: 0, opacity: 1, rotate: -6 }}
          whileHover={{ y: -12, rotate: -2, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-48 sm:w-56 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-900/5 cursor-pointer text-left space-y-2 select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block tracking-tight">Smart Slide Layouts</span>
          <p className="text-sm font-bold text-slate-900 leading-snug">5+ Native Layouts</p>
        </motion.div>

        {/* Card 2 (Center featured) */}
        <motion.div
          initial={{ y: 80, opacity: 0, rotate: 0 }}
          animate={{ y: -16, opacity: 1, rotate: 0 }}
          whileHover={{ y: -28, scale: 1.06 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-52 sm:w-60 bg-white border-2 border-sky-400/80 rounded-2xl p-5 shadow-2xl shadow-sky-500/10 cursor-pointer text-left space-y-2 select-none z-20 relative"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30">
            <Cpu className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-semibold text-sky-600 block tracking-tight">DeepSeek V4 & Nemotron</span>
          <p className="text-base font-extrabold text-slate-900 leading-snug">Real-Time AI Processing</p>
        </motion.div>

        {/* Card 3 (Right tilted) */}
        <motion.div
          initial={{ y: 60, opacity: 0, rotate: 8 }}
          animate={{ y: 0, opacity: 1, rotate: 6 }}
          whileHover={{ y: -12, rotate: 2, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-48 sm:w-56 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-900/5 cursor-pointer text-left space-y-2 select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <RefreshCw className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 block tracking-tight">Auto-Refund Guarantee</span>
          <p className="text-sm font-bold text-slate-900 leading-snug">Zero Risk Credits</p>
        </motion.div>
      </div>

      {/* 3D Box Container Base (Matching reference image white box) */}
      <div className="w-full max-w-3xl h-28 bg-gradient-to-b from-slate-100 to-slate-200/90 border-t border-x border-slate-300/80 rounded-t-3xl shadow-inner flex items-center justify-center relative -mt-16 z-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-300/60 to-transparent" />
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
          <Zap className="h-4 w-4 text-sky-500" />
          <span>Writara AI Deck Engine Container</span>
        </div>
      </div>

      {/* Bottom Kinetic Callout Line (Matching reference image bottom text) */}
      <div className="pt-8 text-center">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          It&apos;s time to transform your manual presentation <span className="text-sky-500 underline decoration-sky-300 decoration-2 underline-offset-4">decks</span>.
        </h3>
      </div>
    </div>
  );
}
