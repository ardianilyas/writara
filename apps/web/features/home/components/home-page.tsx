'use client';

import Link from 'next/link';
import { UserHeader } from './user-header';
import { useSession, useLogout, useUserStore } from '@/features/auth';
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
import { Sparkles, Coins, Presentation, LogOut, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const { data: sessionData, isLoading } = useSession();
  const logoutMutation = useLogout();
  const storedUser = useUserStore((state) => state.user);

  const user = sessionData?.user || (storedUser?.email ? storedUser : null);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      <UserHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center items-center relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24 text-muted-foreground">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Checking authentication...</p>
          </div>
        ) : user ? (
          /* LOGGED IN VIEW */
          <div className="w-full max-w-3xl space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border text-secondary-foreground text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Active Session</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                Welcome back, <span>{user.name || 'Creator'}</span>!
              </h1>
              <p className="text-base text-muted-foreground max-w-xl mx-auto">
                Ready to generate your next AI-powered educational presentation deck?
              </p>
            </div>

            {/* User Profile Card */}
            <div className="bg-card border rounded-2xl p-6 shadow-xs text-left grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">{user.name || 'User Account'}</h3>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Authenticated Account</span>
                </div>
              </div>

              {/* Credit Status Box */}
              <div className="bg-muted/50 border rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Available Credits</span>
                  <Coins className="h-4 w-4 text-amber-500" />
                </div>

                <div>
                  <p className="text-3xl font-extrabold text-foreground">
                    {(sessionData?.user?.freeCredits || 0) + (sessionData?.user?.purchasedCredits || 0)}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {sessionData?.user?.freeCredits || 0} Free Trial + {sessionData?.user?.purchasedCredits || 0} Lifetime
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTAs using default shadcn button variants */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="default"
                size="lg"
                disabled
                className="w-full sm:w-auto gap-2"
              >
                <Presentation className="h-4 w-4" />
                <span>Create New Presentation (Coming Soon)</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Destructive Logout Button with AlertDialog Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      size="lg"
                      disabled={logoutMutation.isPending}
                      className="w-full sm:w-auto gap-2"
                    >
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
        ) : (
          /* GUEST / LANDING HERO LIGHT MODE VIEW */
          <div className="w-full max-w-4xl space-y-8 text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border text-muted-foreground text-xs font-semibold">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Next-Gen AI Slide Deck Engine</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground leading-tight">
                Create structured, presentation-native decks in seconds.
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Writara uses cutting-edge AI models (DeepSeek V4 Flash & Nemotron) to craft complete educational presentation decks with slide layouts, speaker notes, and learning takeaways.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="default" size="lg" asChild className="w-full sm:w-auto gap-2">
                <Link href="/register">
                  <span>Get Started Free (+3 Credits)</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/login">
                  <span>Sign In to Your Account</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground bg-background">
        <p>© {new Date().getFullYear()} Writara AI. Built with Next.js App Router, Tailwind CSS v4 & Better Auth.</p>
      </footer>
    </div>
  );
}
