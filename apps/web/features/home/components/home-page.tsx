'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { UserHeader } from './user-header';
import { KineticText } from './kinetic-text';
import { HeroUnboxingCards } from './hero-unboxing-cards';
import { useSession, useUserStore } from '@/features/auth';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Presentation,
  ArrowRight,
  Zap,
  Cpu,
  RefreshCw,
  LayoutGrid,
  FileCheck2,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const { data: sessionData, isLoading: isSessionLoading } = useSession();
  const storedUser = useUserStore((state) => state.user);

  const user = sessionData?.user || (storedUser?.email ? storedUser : null);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
      <UserHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-24">
        {/* HERO SECTION */}
        {isSessionLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24 text-slate-400">
            <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Checking authentication...</p>
          </div>
        ) : user ? (
          /* LOGGED IN USER HERO */
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-8 text-center pt-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span>Active Session</span>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.2]">
                Welcome back, <span className="text-sky-500">{user.name || 'Creator'}</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Generate tailored <KineticText /> with automated slide layouts and speaker notes.
              </p>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex items-center justify-center pt-2">
              <Button size="lg" disabled className="rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/25 px-8 gap-2 cursor-not-allowed opacity-90 h-12 text-sm font-bold">
                <Presentation className="h-4 w-4" />
                <span>Create Presentation Deck</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.section>
        ) : (
          /* GUEST HERO LANDING VIEW */
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full space-y-8 text-center pt-6"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider cursor-default"
            >
              <Zap className="h-3.5 w-3.5 text-sky-500" />
              <span>WRITARA AI PRESENTATION ENGINE</span>
            </motion.div>

            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.25]">
                Generate tailored <KineticText />
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Writara helps educators and creators structure topics, automate slide layouts, and guide every presenter with clarity.
              </p>
            </div>

            {/* DUAL ACTION PILL BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" asChild className="rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-500/20 px-8 h-12 text-sm font-bold gap-2">
                  <Link href="/register">
                    <span>Schedule a demo</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" asChild className="rounded-full bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 px-8 h-12 text-sm font-semibold">
                  <Link href="/register">
                    <span>Start free for 3 credits</span>
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* HERO 3D UNBOXING CARDS VISUAL */}
            <HeroUnboxingCards />
          </motion.section>
        )}

        {/* AI MODEL CATALOG SHOWCASE */}
        <motion.section
          id="models"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 pt-8"
        >
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">AI Model Catalog</h2>
            <p className="text-sm text-slate-600">Choose between fast reasoning or deep exhaustive presentation generation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Tier Model Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Nemotron 30B Nano</h3>
                      <p className="text-xs text-slate-400">nvidia/nemotron-3-nano-30b-a3b:free</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    Free Tier
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast, lightweight reasoning model suited for quick overview decks and concise 5-chapter presentations.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Credit Usage</span>
                  <span className="font-bold text-slate-900">1 Credit / Deck</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Chapter Limit</span>
                  <span className="font-bold text-slate-900">5 Chapters</span>
                </div>
              </div>
            </motion.div>

            {/* Paid Tier Model Card */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white border-2 border-sky-500 rounded-3xl p-8 shadow-md space-y-6 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">DeepSeek V4 Flash</h3>
                      <p className="text-xs text-slate-400">deepseek/deepseek-v4-flash</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-100">
                    Pro Model
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  High-capacity flagship AI model engineered for exhaustive 20-chapter deep dives with rich speaker notes and visual suggestions.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Credit Usage</span>
                  <span className="font-bold text-slate-900">5 Credits / Deck</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Chapter Limit</span>
                  <span className="font-bold text-slate-900">Up to 20 Chapters</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* FEATURES BENTO GRID */}
        <motion.section
          id="features"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 pt-4"
        >
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Presentation-Native Capabilities</h2>
            <p className="text-sm text-slate-600">Engineered specifically for presentation structure, learning takeaways, and speaker clarity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 md:col-span-2 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 mb-1">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Structured Slide Layouts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates native slide structures including Title slides, Bullet Points, 2-Column Comparisons, Key Metrics, and Summary takeaways.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 mb-1">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Speaker Notes & Takeaways</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every slide includes comprehensive speaker notes and key learning takeaways for presenters.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 mb-1">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Auto-Refund Guarantee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If background AI generation encounters a timeout, credits are automatically refunded to your balance.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 md:col-span-2 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 mb-1">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Lifetime Credit Pool</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your credits never expire. 3 Free trial credits are awarded on registration, and top-ups remain active indefinitely.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* 3-STEP PROCESS SECTION */}
        <motion.section
          id="how-it-works"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-10 text-center space-y-8"
        >
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">How Writara Works</h2>
            <p className="text-xs text-slate-500">From topic input to structured presentation slides in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Select Topic & Model</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Enter your subject topic and pick your AI model (Nemotron or DeepSeek V4).</p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="font-bold text-slate-900 text-sm">AI Slide Structuring</h4>
              <p className="text-xs text-slate-500 leading-relaxed">AI engine builds chapter topics, slide layouts, speaker notes, and visual suggestions.</p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Present & Share</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Review your slide deck in the interactive presentation viewer.</p>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 bg-white">
        <p>© {new Date().getFullYear()} Writara AI. Built with Next.js App Router, Better Auth & TanStack Query.</p>
      </footer>
    </div>
  );
}
