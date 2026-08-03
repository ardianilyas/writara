'use client';

import Link from 'next/link';
import { UserHeader } from './user-header';
import { useSession, useLogout, useUserStore } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Sparkles, Coins, Presentation, LogOut, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const { data: sessionData, isLoading } = useSession();
  const logoutMutation = useLogout();
  const storedUser = useUserStore((state) => state.user);

  const user = sessionData?.user || (storedUser?.email ? storedUser : null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      <UserHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center items-center relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24 text-slate-500">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Checking authentication...</p>
          </div>
        ) : user ? (
          /* LOGGED IN LIGHT MODE VIEW */
          <div className="w-full max-w-3xl space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Active Session</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                Welcome back, <span className="text-indigo-600">{user.name || 'Creator'}</span>!
              </h1>
              <p className="text-base text-slate-600 max-w-xl mx-auto">
                Ready to generate your next AI-powered educational presentation deck?
              </p>
            </div>

            {/* User Profile Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md text-left grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-indigo-100">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{user.name || 'User Account'}</h3>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 pt-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Authenticated Account</span>
                </div>
              </div>

              {/* Credit Status Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Available Credits</span>
                  <Coins className="h-4 w-4 text-amber-500" />
                </div>

                <div>
                  <p className="text-3xl font-extrabold text-slate-900">
                    {(sessionData?.user?.freeCredits || 0) + (sessionData?.user?.purchasedCredits || 0)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {sessionData?.user?.freeCredits || 0} Free Trial + {sessionData?.user?.purchasedCredits || 0} Lifetime
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTAs using shadcn UI Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                disabled
                className="w-full sm:w-auto gap-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md cursor-not-allowed opacity-90"
              >
                <Presentation className="h-4 w-4" />
                <span>Create New Presentation (Coming Soon)</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="w-full sm:w-auto gap-2 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        ) : (
          /* GUEST / LANDING HERO LIGHT MODE VIEW */
          <div className="w-full max-w-4xl space-y-8 text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Next-Gen AI Slide Deck Engine</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                Create structured, presentation-native decks in{' '}
                <span className="text-indigo-600">seconds.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Writara uses cutting-edge AI models (DeepSeek V4 Flash & Nemotron) to craft complete educational presentation decks with slide layouts, speaker notes, and learning takeaways.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100">
                <Link href="/register">
                  <span>Get Started Free (+3 Credits)</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100">
                <Link href="/login">
                  <span>Sign In to Your Account</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p>© {new Date().getFullYear()} Writara AI. Built with Next.js App Router, Tailwind CSS v4 & Better Auth.</p>
      </footer>
    </div>
  );
}
