'use client';

import Link from 'next/link';
import { Sparkles, LayoutDashboard, MessageSquare, LogOut, User as UserIcon } from 'lucide-react';
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

interface DeckHeaderProps {
  activeTab?: string;
  onToggleSidebar?: () => void;
}

export function DeckHeader({ activeTab = 'ai-chat' }: DeckHeaderProps) {
  const { data: session } = useSession();
  const { data: creditData } = useCredits();
  const logoutMutation = useLogout();

  const user = session?.user;
  const creditsBalance = creditData?.totalCredits ?? 3;

  return (
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

      {/* Right Controls: Credits & User Dropdown */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1.5 px-3 py-1 font-semibold text-xs border-sky-200 bg-sky-50 text-sky-700">
          <Sparkles className="h-3 w-3 text-sky-500" />
          <span>{creditsBalance} Credits</span>
        </Badge>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
                <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="max-w-[100px] truncate">{user.name || 'Account'}</span>
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal text-xs">
                <div className="font-semibold text-foreground truncate">{user.name}</div>
                <div className="text-muted-foreground truncate">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logoutMutation.mutate()}
                className="text-destructive focus:text-destructive cursor-pointer text-xs"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
