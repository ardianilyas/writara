'use client';

import Link from 'next/link';
import { UserHeader } from './user-header';
import { useSession, useLogout, useUserStore } from '@/features/auth';
import { useCredits } from '@/features/credits';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Sparkles,
  Coins,
  Presentation,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  FileCheck2,
  RefreshCw,
  LayoutGrid,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const { data: sessionData, isLoading: isSessionLoading } = useSession();
  const { data: creditsData, isLoading: isCreditsLoading } = useCredits();
  const logoutMutation = useLogout();
  const storedUser = useUserStore((state) => state.user);

  const user = sessionData?.user || (storedUser?.email ? storedUser : null);
  const freeCredits = creditsData?.freeCredits ?? (sessionData?.user?.freeCredits || 0);
  const purchasedCredits = creditsData?.purchasedCredits ?? (sessionData?.user?.purchasedCredits || 0);
  const totalCredits = creditsData?.totalCredits ?? (freeCredits + purchasedCredits);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      <UserHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        {/* HERO SECTION */}
        {isSessionLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24 text-muted-foreground">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Checking authentication...</p>
          </div>
        ) : user ? (
          /* LOGGED IN USER DASHBOARD HERO */
          <section className="w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-card via-card to-muted/40 border border-border rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Authenticated Session</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                  Welcome back, <span className="text-primary">{user.name || 'Creator'}</span>
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Your workspace is ready. Select an AI model, specify your topic, and generate presentation-native slide decks in seconds.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button size="lg" disabled className="gap-2 cursor-not-allowed opacity-90">
                    <Presentation className="h-4 w-4" />
                    <span>Create Presentation Deck</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="destructive" size="lg" disabled={logoutMutation.isPending} className="gap-2">
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will be logged out of your session on Writara AI. You can sign back in at any time.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => logoutMutation.mutate()}>
                          Sign Out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* LIVE CREDITS BALANCE CARD */}
              <div className="bg-background border rounded-2xl p-6 shadow-sm min-w-[280px] space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Credit Balance</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                    Active
                  </span>
                </div>

                <div className="space-y-1">
                  {isCreditsLoading ? (
                    <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
                  ) : (
                    <p className="text-4xl font-black text-foreground tracking-tight">
                      {totalCredits} <span className="text-sm font-medium text-muted-foreground">Credits</span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {freeCredits} Free Trial + {purchasedCredits} Lifetime Top-Up
                  </p>
                </div>

                <div className="text-[11px] text-muted-foreground bg-muted/50 p-2.5 rounded-lg border flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Credits never expire. Auto-refunded if generation fails.</span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* GUEST HERO LANDING VIEW */
          <section className="w-full space-y-8 py-6">
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border text-muted-foreground text-xs font-semibold">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Next-Gen Presentation Engine</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                Generate structured, presentation-native decks in seconds.
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Writara transforms your topics into complete educational presentation decks with slide layouts, speaker notes, and learning takeaways powered by DeepSeek V4 Flash & Nemotron 30B.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Button variant="default" size="lg" asChild className="w-full sm:w-auto gap-2">
                  <Link href="/register">
                    <span>Get Started Free (+3 Credits)</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/login">
                    <span>Sign In to Account</span>
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* AI MODEL CATALOG SHOWCASE */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Available AI Generation Models</h2>
            <p className="text-sm text-muted-foreground">Select the model suited for your presentation depth and detail.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Tier Model Card */}
            <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-muted text-foreground">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Nemotron 30B Nano</h3>
                      <p className="text-xs text-muted-foreground">nvidia/nemotron-3-nano-30b-a3b:free</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                    Free Tier
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fast, lightweight reasoning model suited for quick overview decks and concise 5-chapter presentations.
                </p>
              </div>

              <div className="pt-4 border-t grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Credit Cost</span>
                  <span className="font-bold text-foreground">1 Credit / Deck</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Max Chapters</span>
                  <span className="font-bold text-foreground">5 Chapters</span>
                </div>
              </div>
            </div>

            {/* Paid Tier Model Card */}
            <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 shadow-xs space-y-5 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">DeepSeek V4 Flash</h3>
                      <p className="text-xs text-muted-foreground">deepseek/deepseek-v4-flash</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    Pro Model
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  High-capacity flagship AI model engineered for exhaustive 20-chapter deep dives with rich speaker notes and visual suggestions.
                </p>
              </div>

              <div className="pt-4 border-t grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Credit Cost</span>
                  <span className="font-bold text-foreground">5 Credits / Deck</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Max Chapters</span>
                  <span className="font-bold text-foreground">Up to 20 Chapters</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO FEATURE GRID */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Built for Presentation-Native Content</h2>
            <p className="text-sm text-muted-foreground">Everything you need to deliver engaging educational slide decks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Cell 1 */}
            <div className="bg-card border rounded-2xl p-6 space-y-3 md:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground mb-2">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Structured Slide Layouts</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generates native slide structures including Title slides, Bullet Points, 2-Column Comparisons, Key Metrics, and Summary takeaways.
              </p>
            </div>

            {/* Bento Cell 2 */}
            <div className="bg-card border rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground mb-2">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Speaker Notes & Takeaways</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every slide includes comprehensive speaker notes and key learning takeaways for presenters.
              </p>
            </div>

            {/* Bento Cell 3 */}
            <div className="bg-card border rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground mb-2">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Auto-Refund Guarantee</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If background AI generation encounters a timeout, credits are automatically refunded to your balance.
              </p>
            </div>

            {/* Bento Cell 4 */}
            <div className="bg-card border rounded-2xl p-6 space-y-3 md:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground mb-2">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Lifetime Credit Pool</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your credits never expire. 3 Free trial credits are awarded on registration, and top-ups remain active indefinitely.
              </p>
            </div>
          </div>
        </section>

        {/* 3-STEP PROCESS */}
        <section className="bg-muted/40 border rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-center">How Writara Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-foreground text-sm">Input Topic & Model</h4>
              <p className="text-xs text-muted-foreground">Enter your topic, template, and choose your preferred AI model.</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-foreground text-sm">AI Deck Generation</h4>
              <p className="text-xs text-muted-foreground">AI structures chapters, slide layouts, notes, and visual suggestions.</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-foreground text-sm">Present & Export</h4>
              <p className="text-xs text-muted-foreground">View your presentation deck in the interactive slide viewer.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground bg-background">
        <p>© {new Date().getFullYear()} Writara AI. Built with Next.js App Router, Better Auth & TanStack Query.</p>
      </footer>
    </div>
  );
}
