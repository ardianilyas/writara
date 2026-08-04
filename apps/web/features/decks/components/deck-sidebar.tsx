'use client';

import { Plus, History, Presentation, Trash2, LogOut } from 'lucide-react';
import { useSession, useLogout } from '@/features/auth';
import { useGetDecksSidebar, SidebarDeckItem } from '../api/use-decks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
  const { data: session } = useSession();
  const logoutMutation = useLogout();
  const { data: sidebarData } = useGetDecksSidebar();
  const user = session?.user;

  const deckItems = sidebarData?.items || [];
  const count = sidebarData?.count ?? deckItems.length;

  return (
    <aside className="w-64 shrink-0 bg-muted/40 border-r border-border flex flex-col justify-between p-3 min-h-[calc(100vh-3.5rem)] select-none">
      <div className="space-y-4">
        {/* + New Deck Primary Shadcn Button */}
        <Button onClick={onNewDeck} className="w-full gap-2 font-bold shadow-xs">
          <Plus className="h-4 w-4" />
          <span>New Presentation</span>
        </Button>

        {/* Deck History Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" />
              <span>History</span>
            </div>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {count}
            </Badge>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
            {deckItems.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                No presentation decks created yet.
              </div>
            ) : (
              deckItems.map((deck) => {
                const isActive = activeDeckId === deck.id;
                return (
                  <div
                    key={deck.id}
                    onClick={() => onSelectDeckId?.(deck.id)}
                    className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                        : 'hover:bg-accent hover:text-accent-foreground text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Presentation className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                      <span className="truncate">{deck.title}</span>
                    </div>
                    {onDeleteDeck && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDeck(deck.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                        title="Delete deck"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User Footer Card with Avatar, perfect alignment & AlertDialog sign out */}
      {user && (
        <Card className="p-2.5 flex items-center justify-between gap-3 border-border shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs block truncate text-foreground leading-tight">
                {user.name || 'User'}
              </span>
              <span className="text-[10px] text-muted-foreground block truncate leading-tight">
                {user.email}
              </span>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  disabled={logoutMutation.isPending}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of Writara?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be signed out of your current session on Writara AI. You can sign back in at any time.
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
        </Card>
      )}
    </aside>
  );
}
