'use client';

import { useState } from 'react';
import {
  Plus,
  MessageSquare,
  FolderKanban,
  History,
  Library,
  Settings,
  Globe,
  LogOut,
  ChevronRight,
  Presentation,
  Trash2,
} from 'lucide-react';
import { useSession, useLogout } from '@/features/auth';
import { GenerationRecord } from '../api/use-decks';

interface DeckSidebarProps {
  decks?: GenerationRecord[];
  activeDeckId?: string | null;
  onSelectDeck?: (deck: GenerationRecord) => void;
  onNewDeck?: () => void;
  onDeleteDeck?: (id: string) => void;
}

export function DeckSidebar({
  decks = [],
  activeDeckId,
  onSelectDeck,
  onNewDeck,
  onDeleteDeck,
}: DeckSidebarProps) {
  const { data: session } = useSession();
  const logoutMutation = useLogout();
  const [showHistory, setShowHistory] = useState(true);

  const user = session?.user;

  return (
    <aside className="w-64 shrink-0 bg-slate-50/80 border-r border-slate-200/80 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] relative overflow-hidden select-none">
      {/* Soft Ambient Glow in Sidebar Bottom Corner (Matching Reference Image) */}
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-lime-300/40 via-sky-300/30 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-6 relative z-10">
        {/* + New Chat / New Deck Top Button */}
        <button
          onClick={onNewDeck}
          className="w-full bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl py-3 px-4 flex items-center gap-3 text-slate-800 text-sm font-bold shadow-xs hover:shadow-sm transition-all"
        >
          <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Plus className="h-4 w-4" />
          </div>
          <span>New Deck</span>
        </button>

        {/* Features Menu Section */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 px-3 block mb-2 uppercase tracking-wider">
            Features
          </span>

          {/* Active Chat Item */}
          <button
            onClick={onNewDeck}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-white border border-slate-200/80 shadow-2xs"
          >
            <MessageSquare className="h-4 w-4 text-sky-500" />
            <span>AI Chat</span>
          </button>

          {/* Project Item */}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors">
            <FolderKanban className="h-4 w-4 text-slate-400" />
            <span>Project</span>
          </button>

          {/* History Item & Expandable Decks List */}
          <div className="space-y-1">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <History className="h-4 w-4 text-slate-400" />
                <span>History ({decks.length})</span>
              </div>
              <ChevronRight
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                  showHistory ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Deck History Sub-Items */}
            {showHistory && decks.length > 0 && (
              <div className="pl-6 space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {decks.map((deck) => {
                  const isActive = activeDeckId === deck.id;
                  return (
                    <div
                      key={deck.id}
                      className={`group/item flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-100'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      onClick={() => onSelectDeck?.(deck)}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Presentation className="h-3 w-3 text-sky-500 shrink-0" />
                        <span className="truncate">{deck.topic}</span>
                      </div>
                      {onDeleteDeck && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDeck(deck.id);
                          }}
                          className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                          title="Delete deck"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Library Item */}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors">
            <Library className="h-4 w-4 text-slate-400" />
            <span>Library</span>
          </button>

          {/* Admin Templates Item with PRO Badge */}
          <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-4 w-4 text-slate-400" />
              <span>All Templates</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-300 text-slate-900 border border-lime-400/50">
              PRO
            </span>
          </div>
        </div>

        {/* Settings & Help Section */}
        <div className="space-y-1 pt-2">
          <span className="text-xs font-semibold text-slate-400 px-3 block mb-2 uppercase tracking-wider">
            Settings & Help
          </span>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors">
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-colors">
            <Globe className="h-4 w-4 text-slate-400" />
            <span>Integrations</span>
          </button>
        </div>
      </div>

      {/* User Profile Footer Card (Matching Reference Image) */}
      <div className="pt-4 border-t border-slate-200/80 relative z-10">
        <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 relative">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 block truncate leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {user?.email || 'user@writara.ai'}
              </span>
            </div>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
