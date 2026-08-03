'use client';

import Link from 'next/link';
import { UserHeader } from './user-header';
import { useSession, useLogout, useUserStore } from '@/features/auth';
import { Sparkles, Coins, Presentation, LogOut, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const { data: sessionData, isLoading } = useSession();
  const logoutMutation = useLogout();
  const storedUser = useUserStore((state) => state.user);

  const user = sessionData?.user || (storedUser?.email ? storedUser : null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <UserHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center items-center relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24 text-slate-400">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Checking authentication...</p>
          </div>
        ) : user ? (
          /* LOGGED IN VIEW */
          <div className="w-full max-w-3xl space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Active Session</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{user.name || 'Creator'}</span>!
              </h1>
              <p className="text-base text-slate-400 max-w-xl mx-auto">
                Ready to generate your next AI-powered educational presentation deck?
              </p>
            </div>

            {/* User Profile Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl text-left grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{user.name || 'User Account'}</h3>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Authenticated Account</span>
                </div>
              </div>

              {/* Credit Status Box */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Available Credits</span>
                  <Coins className="h-4 w-4 text-amber-400" />
                </div>

                <div>
                  <p className="text-3xl font-extrabold text-white">
                    {(sessionData?.user?.freeCredits || 0) + (sessionData?.user?.purchasedCredits || 0)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {sessionData?.user?.freeCredits || 0} Free Trial + {sessionData?.user?.purchasedCredits || 0} Lifetime
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:brightness-110 active:scale-[0.98] transition cursor-not-allowed opacity-90"
              >
                <Presentation className="h-4 w-4" />
                <span>Create New Presentation (Coming Soon)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-300 hover:text-red-400 font-semibold text-sm transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* GUEST / LANDING HERO VIEW */
          <div className="w-full max-w-4xl space-y-8 text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Next-Gen AI Slide Deck Engine</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                Create structured, presentation-native decks in{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  seconds.
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Writara uses cutting-edge AI models (DeepSeek V4 Flash & Nemotron) to craft complete educational presentation decks with slide layouts, speaker notes, and learning takeaways.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:brightness-110 active:scale-[0.98] transition"
              >
                <span>Get Started Free (+3 Credits)</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition"
              >
                <span>Sign In to Your Account</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Writara AI. Built with Next.js App Router, Tailwind CSS v4 & Better Auth.</p>
      </footer>
    </div>
  );
}
