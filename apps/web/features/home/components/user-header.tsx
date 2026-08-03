'use client';

import Link from 'next/link';
import { Sparkles, LogOut, User as UserIcon, Coins, Loader2 } from 'lucide-react';
import { useSession, useLogout, useUserStore } from '@/features/auth';

export function UserHeader() {
  const { data: sessionData, isLoading } = useSession();
  const logoutMutation = useLogout();
  const storedUser = useUserStore((state) => state.user);

  const user = sessionData?.user || (storedUser?.email ? storedUser : null);

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Writara <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">AI</span>
          </span>
        </Link>

        {/* User / Auth Navigation */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              Loading...
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white leading-none">{user.name || 'User'}</p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>

              {/* Credits indicator if available */}
              {(sessionData?.user?.freeCredits !== undefined || sessionData?.user?.purchasedCredits !== undefined) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <Coins className="h-3.5 w-3.5" />
                  <span>{(sessionData.user.freeCredits || 0) + (sessionData.user.purchasedCredits || 0)} Credits</span>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-xs font-medium text-slate-300 hover:text-red-400 transition disabled:opacity-50"
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
