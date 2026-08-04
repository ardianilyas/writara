'use client';

import { Plus, History, Presentation, Trash2 } from 'lucide-react';
import { useSession } from '@/features/auth';
import { useGetDecksSidebar } from '../api/use-decks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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

interface DeckSidebarProps {
  activeDeckId?: string | null;
  onSelectDeckId?: (id: string) => void;
  onNewDeck?: () => void;
  onDeleteDeck?: (id: string) => void;
}

export function DeckSidebar({
  activeDeckId,
  onSelectDeckId,
  onNewDeck,
  onDeleteDeck,
}: DeckSidebarProps) {
  const { isLoading: isSessionLoading } = useSession();
  const { data: sidebarData, isLoading: isSidebarLoading } = useGetDecksSidebar();

  const showSkeleton = !sidebarData || isSidebarLoading || isSessionLoading;
  const deckItems = sidebarData?.items || [];
  const count = sidebarData?.count ?? deckItems.length;

  return (
    <aside className="w-64 shrink-0 bg-slate-50/80 border-r border-slate-200/80 flex flex-col p-3.5 h-[calc(100vh-3.5rem)] select-none">
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* + New Presentation Primary High-Contrast Button */}
        <Button
          onClick={onNewDeck}
          className="w-full h-10 gap-2 font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all text-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Presentation</span>
        </Button>

        {/* Deck History Navigation Section */}
        <div className="space-y-2.5 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            <div className="flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-slate-400" />
              <span>History</span>
            </div>
            {showSkeleton ? (
              <Skeleton className="h-4 w-6 rounded-full" />
            ) : (
              <Badge variant="secondary" className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                {count}
              </Badge>
            )}
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {showSkeleton ? (
              <div className="space-y-2 p-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4 rounded-md shrink-0 bg-sky-200/40" />
                    <Skeleton className="h-3.5 w-full rounded-md" />
                  </div>
                ))}
              </div>
            ) : deckItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl space-y-1">
                <Presentation className="h-4 w-4 mx-auto text-slate-400 opacity-60" />
                <p className="font-medium">No topics generated yet.</p>
              </div>
            ) : (
              deckItems.map((deck) => {
                const isActive = activeDeckId === deck.id;
                return (
                  <div
                    key={deck.id}
                    onClick={() => onSelectDeckId?.(deck.id)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                      isActive
                        ? 'bg-sky-50/90 text-sky-950 font-bold border border-sky-200/90 shadow-2xs'
                        : 'hover:bg-slate-200/60 text-slate-700 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isActive ? 'bg-sky-500 animate-pulse' : 'bg-slate-300'
                        }`}
                      />
                      <span className="truncate leading-tight">{deck.title}</span>
                    </div>

                    {onDeleteDeck && (
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={(e) => e.stopPropagation()}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-destructive shrink-0 transition-opacity"
                              title="Delete presentation"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          }
                        />
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Presentation Topic?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <span className="font-bold text-foreground">"{deck.title}"</span>? This action cannot be undone and will permanently remove this topic guide.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => onDeleteDeck(deck.id)}
                            >
                              Delete Topic
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
