'use client';

import Link from 'next/link';
import { Sparkles, LogOut, User as UserIcon, Coins, Loader2 } from 'lucide-react';
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

export function UserHeader() {
  const { data: sessionData, isLoading: isSessionLoading } = useSession();
  const { data: creditsData, isLoading: isCreditsLoading } = useCredits();
  const logoutMutation = useLogout();
  const storedUser = useUserStore((state) => state.user);

  const user = sessionData?.user || (storedUser?.email ? storedUser : null);
  const totalCredits = creditsData?.totalCredits ?? (sessionData?.user?.freeCredits || 0);

  return (
    <header className="w-full sticky top-4 z-50 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-full px-6 h-14 flex items-center justify-between shadow-lg shadow-slate-900/5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            Writara
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <Link href="#models" className="hover:text-slate-900 transition">
            AI Models
          </Link>
          <Link href="#features" className="hover:text-slate-900 transition">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-slate-900 transition">
            How it works
          </Link>
        </nav>

        {/* User / Auth Action Controls */}
        <div className="flex items-center gap-3">
          {isSessionLoading ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-500" />
              Loading...
            </div>
          ) : user ? (
            <div className="flex items-center gap-2.5">
              {/* Credits indicator pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-xs font-semibold">
                <Coins className="h-3.5 w-3.5 text-sky-500" />
                {isCreditsLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-sky-500" />
                ) : (
                  <span>{totalCredits} Credits</span>
                )}
              </div>

              {/* User badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
                <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                <span className="truncate max-w-[100px]">{user.name || 'User'}</span>
              </div>

              {/* Destructive Logout Button */}
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={logoutMutation.isPending}
                      className="rounded-full h-8 px-3 text-xs gap-1"
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <LogOut className="h-3 w-3" />
                      )}
                      <span>Logout</span>
                    </Button>
                  }
                />
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out of your session on Writara AI. You can sign back in at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => logoutMutation.mutate()} className="rounded-xl">
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-full text-xs text-slate-700">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild className="rounded-full text-xs bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 px-4">
                <Link href="/register">Sign up for free</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
