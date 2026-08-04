'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, LayoutDashboard, MessageSquare, LogOut, ChevronDown, Coins } from 'lucide-react';
import { useSession, useLogout } from '@/features/auth';
import { useCredits } from '@/features/credits/hooks/use-credits';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeckHeaderProps {
  activeTab?: string;
  onToggleSidebar?: () => void;
}

export function DeckHeader({ activeTab = 'ai-chat' }: DeckHeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: creditData } = useCredits();
  const logoutMutation = useLogout();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const user = session?.user;
  const creditsBalance = creditData?.totalCredits ?? 3;

  const handleConfirmSignOut = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <>
      <header className="w-full h-14 bg-background border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-base text-foreground tracking-tight">
              Writara<span className="text-sky-500">.ai</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links using Shadcn Button */}
        <nav className="flex items-center gap-1">
          <Button variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} size="sm" asChild>
            <Link href="/" className="gap-1.5 text-xs font-semibold">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button variant={activeTab === 'ai-chat' ? 'secondary' : 'ghost'} size="sm" asChild>
            <Link href="/decks" className="gap-1.5 text-xs font-semibold">
              <MessageSquare className="h-3.5 w-3.5 text-sky-500" />
              <span>AI Chat</span>
            </Link>
          </Button>
        </nav>

        {/* Right Controls: Credits & User Profile Dropdown */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 font-semibold text-xs border-sky-200 bg-sky-50 text-sky-700">
            <Coins className="h-3.5 w-3.5 text-sky-500" />
            <span>{creditsBalance} Credits</span>
          </Badge>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="gap-2 px-2 py-1 hover:bg-slate-100/80 rounded-full border border-slate-200/80">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-bold text-xs max-w-[120px] truncate text-slate-800 hidden sm:inline-block">
                      {user.name || 'Account'}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-60 p-2 space-y-1.5 shadow-xl rounded-xl border-slate-200">
                {/* User Profile Info Header */}
                <DropdownMenuLabel className="font-normal p-2.5 bg-slate-50 rounded-lg space-y-0.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{user.name}</span>
                    <span className="text-[9px] font-extrabold uppercase bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded-xs">
                      MEMBER
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Credits Info Option */}
                <DropdownMenuItem className="text-xs cursor-pointer justify-between py-2 text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Coins className="h-3.5 w-3.5 text-sky-500" />
                    <span>Credit Balance</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold bg-sky-50 text-sky-700">
                    {creditsBalance} Available
                  </Badge>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign Out Option with Confirmation Modal Trigger */}
                <DropdownMenuItem
                  onClick={() => setShowSignOutDialog(true)}
                  className="text-destructive focus:text-destructive cursor-pointer text-xs font-semibold rounded-md py-2"
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Sign Out Confirmation Modal */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of Writara?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will be redirected to the homepage and will need to sign back in to create new topic guides.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmSignOut}
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
