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
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 pt-8 md:pt-12 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span>Welcome Back</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.08]">
              AI Presentation Decks in Seconds
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Writara transforms your topics into structured slide decks with automated layouts, speaker notes, and key learning takeaways.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" disabled className="bg-sky-500 text-white shadow-lg shadow-sky-500/25 px-8 gap-2 cursor-not-allowed opacity-90 h-12 text-sm font-bold">
                <Presentation className="h-5 w-5" />
                <span>Generating presentation deck...</span>
              </Button>
            </div>

            {/* HERO 3D UNBOXING CARDS VISUAL */}
            <HeroUnboxingCards />
          </motion.section>
        ) : (
          /* GUEST HERO */
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8 pt-8 md:pt-12 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider cursor-default">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span>AI Deck Generator</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.08]">
              AI Presentation Decks in Seconds
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Powered by DeepSeek V4 Flash and Nemotron 30B to automate slide layouts, speaker notes, and learning takeaways — in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" asChild className="bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-500/20 px-8 h-12 text-sm font-bold gap-2">
                  <Link href="/login">
                    <span>Schedule a demo</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" asChild className="bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 px-8 h-12 text-sm font-semibold">
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
