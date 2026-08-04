'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Sun, Moon, Bell, PanelLeft, LayoutDashboard, MessageSquare, HelpCircle, FlaskConical } from 'lucide-react';
import { useSession } from '@/features/auth';

interface DeckHeaderProps {
  onToggleSidebar?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DeckHeader({ onToggleSidebar, activeTab = 'ai-chat', onTabChange }: DeckHeaderProps) {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'ai-chat', label: 'Ai Chat', icon: MessageSquare, href: '/decks' },
    { id: 'help', label: 'Help', icon: HelpCircle, href: '#help' },
    { id: 'labs', label: 'Labs', icon: FlaskConical, href: '#labs' },
  ];

  return (
    <header className="w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Brand Logo & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-black text-lg text-slate-900 tracking-tight">
            Writara<span className="text-sky-500">.ai</span>
          </span>
        </Link>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Toggle sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Center: Floating Pill Navigation Tabs (Matching Reference Image) */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 shadow-xs">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Theme Toggle, Notifications, User Avatar */}
      <div className="flex items-center gap-2">
        {/* Light / Dark Mode Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80">
          <button
            onClick={() => setTheme('light')}
            className={`p-1.5 rounded-full text-xs transition-colors ${
              theme === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Light mode"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1.5 rounded-full text-xs transition-colors ${
              theme === 'dark' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Dark mode"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Notifications Bell */}
        <button className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 border border-white" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-xs border border-white">
          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
}
