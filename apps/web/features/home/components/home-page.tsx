'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { UserHeader } from './user-header';
import { HeroUnboxingCards } from './hero-unboxing-cards';
import { useSession, useUserStore } from '@/features/auth';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Presentation,
  ArrowRight,
  Zap,
  Cpu,
} from 'lucide-react';

import { HowItWorksScroll } from './how-it-works-scroll';
import { ModelsCatalog } from './models-catalog';
import { FeaturesBento } from './features-bento';
import { Footer } from './footer';

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
              <span>Workspace Active — {user.name || 'Creator'}</span>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                AI Presentation Decks in <span className="text-sky-500">Seconds</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Writara transforms your topics into presentation-native slide decks with automated layouts, speaker notes, and key learning takeaways. Select an AI model below to generate your next deck.
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
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                AI Presentation Decks in <span className="text-sky-500">Seconds</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Writara helps educators and creators structure complex topics into presentation-native slide decks. Powered by DeepSeek V4 Flash and Nemotron 30B to automate slide layouts, speaker notes, and learning takeaways.
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
        <ModelsCatalog />

        {/* FEATURES BENTO GRID */}
        <FeaturesBento />

        {/* 3-STEP PROCESS SECTION */}
        <HowItWorksScroll />
      </main>

      <Footer />
    </div>
  );
}
