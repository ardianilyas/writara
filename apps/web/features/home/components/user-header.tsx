'use client';

import Link from 'next/link';
import { Sparkles, LogOut, User as UserIcon, Coins, Loader2 } from 'lucide-react';
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

export function UserHeader() {
  const { data: sessionData, isLoading } = useSession();
  const logoutMutation = useLogout();
  const storedUser = useUserStore((state) => state.user);

  const user = sessionData?.user || (storedUser?.email ? storedUser : null);

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Writara <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted border text-muted-foreground">AI</span>
          </span>
        </Link>

        {/* User / Auth Navigation */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Loading...
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border text-xs">
                <div className="w-6 h-6 rounded-full bg-background border flex items-center justify-center text-foreground font-semibold">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground leading-none">{user.name || 'User'}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>

              {/* Credits indicator */}
              {(sessionData?.user?.freeCredits !== undefined || sessionData?.user?.purchasedCredits !== undefined) && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold">
                  <Coins className="h-3.5 w-3.5 text-amber-500" />
                  <span>{(sessionData.user.freeCredits || 0) + (sessionData.user.purchasedCredits || 0)} Credits</span>
                </div>
              )}

              {/* Destructive Logout Button with AlertDialog Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={logoutMutation.isPending}
                      className="gap-1.5"
                    >
                      {logoutMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <LogOut className="h-3.5 w-3.5" />
                      )}
                      <span>Logout</span>
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
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
