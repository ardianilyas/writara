'use client';

import { motion } from 'motion/react';
import { LayoutGrid, FileCheck2, RefreshCw, Lock, Coins, CheckCircle2 } from 'lucide-react';

// Mini Slide Layout Preview (CSS-based visual)
function SlideLayoutPreview() {
  return (
    <div className="w-full mt-4 rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm">
      {/* Title Slide */}
      <div className="bg-slate-900 px-4 py-3 flex flex-col gap-1">
        <div className="h-2 w-2/3 rounded-full bg-white/80" />
        <div className="h-1.5 w-1/2 rounded-full bg-white/30" />
      </div>
      {/* 2-Column Slide */}
      <div className="px-4 py-3 grid grid-cols-2 gap-2 border-t border-slate-100">
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-slate-200" />
          <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
          <div className="h-1.5 w-3/5 rounded-full bg-slate-100" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-sky-200" />
          <div className="h-1.5 w-4/5 rounded-full bg-sky-100" />
          <div className="h-1.5 w-3/5 rounded-full bg-sky-100" />
        </div>
      </div>
      {/* Bullet Points Slide */}
      <div className="px-4 py-3 border-t border-slate-100 space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
            <div className="h-1.5 rounded-full bg-slate-200" style={{ width: `${80 - i * 12}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Speaker Notes Visual
function SpeakerNotesPreview() {
  return (
    <div className="w-full mt-4 space-y-2">
      {['Introduction context for slide 1', 'Key talking points for audience', 'Learning takeaway summary'].map((note, i) => (
        <div key={i} className="flex items-start gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-600 leading-snug">{note}</p>
        </div>
      ))}
    </div>
  );
}

// Credit Balance Visual
function CreditBalancePreview() {
  return (
    <div className="w-full mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-sky-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-white" />
          <span className="text-white text-xs font-bold">Credit Pool</span>
        </div>
        <span className="text-white/80 text-[11px] font-semibold">Active</span>
      </div>
      {/* Balance */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Free Credits</span>
          <span className="font-bold text-slate-900">3</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Purchased Credits</span>
          <span className="font-bold text-slate-900">12</span>
        </div>
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
          <span className="text-slate-900">Total Available</span>
          <span className="text-sky-600">15 Credits</span>
        </div>
      </div>
    </div>
  );
}

// Auto-Refund Visual
function RefundPreview() {
  return (
    <div className="w-full mt-4 space-y-2">
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[11px] text-slate-700 font-medium">Generation successful</span>
        </div>
        <span className="text-[11px] text-slate-500">−5 credits</span>
      </div>
      <div className="bg-white border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] text-slate-700 font-medium">Generation timeout</span>
        </div>
        <span className="text-[11px] text-amber-600 font-semibold">Refunding…</span>
      </div>
      <div className="bg-white border border-sky-200 rounded-xl px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-500" />
          <span className="text-[11px] text-slate-700 font-medium">Credits restored</span>
        </div>
        <span className="text-[11px] text-sky-600 font-semibold">+5 credits</span>
      </div>
    </div>
  );
}

export function FeaturesBento() {
  return (
    <section id="features" className="w-full pt-4 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Presentation-Native Capabilities
          </h2>
          <p className="text-sm text-slate-600">
            Engineered specifically for slide structure, learning takeaways, and speaker clarity.
          </p>
        </div>

        {/* Bento Grid — matches reference image layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-auto gap-4">

          {/* Cell 1 — Wide left (col-span-7): Structured Slide Layouts */}
          <motion.div
            whileHover={{ y: -3 }}
            className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 overflow-hidden"
          >
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Where your slides live.
            </h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Every deck includes{' '}
              <strong className="text-slate-900">5+ native layouts</strong>{' '}
              — Title, 2-Column, Bullet Points, Key Metric, and Summary.
            </p>
            <SlideLayoutPreview />
          </motion.div>

          {/* Cell 2 — Right tall (col-span-5): Speaker Notes */}
          <motion.div
            whileHover={{ y: -3 }}
            className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-sm mb-4">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Speaker notes for every slide.
            </h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Writara writes detailed <strong className="text-slate-900">speaker notes</strong> and key learning takeaways alongside each slide automatically.
            </p>
            <SpeakerNotesPreview />
          </motion.div>

          {/* Cell 3 — Left wide (col-span-5): Auto-Refund Guarantee */}
          <motion.div
            whileHover={{ y: -3 }}
            className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-sm mb-4">
              <RefreshCw className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Zero-risk generation, always.
            </h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              If background AI generation encounters a timeout, credits are{' '}
              <strong className="text-slate-900">automatically refunded</strong> the exact moment it occurs.
            </p>
            <RefundPreview />
          </motion.div>

          {/* Cell 4 — Right wide (col-span-7): Lifetime Credit Pool */}
          <motion.div
            whileHover={{ y: -3 }}
            className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 overflow-hidden"
          >
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Lifetime credit pool, in a single view.
            </h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Your credits never expire. 3 free trial credits are awarded on registration, and{' '}
              <strong className="text-slate-900">top-ups remain active indefinitely</strong>.
            </p>
            <CreditBalancePreview />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
