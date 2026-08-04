'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  DeckHeader,
  DeckSidebar,
  DeckDocumentViewer,
  DeckDetailSkeleton,
  useGetDeckById,
  useDeleteDeck,
} from '@/features/decks';

export default function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentDeck, isLoading: isDeckLoading, isError: isDeckError } = useGetDeckById(id);
  const deleteDeckMutation = useDeleteDeck();

  useEffect(() => {
    if (isDeckError || currentDeck?.status === 'FAILED') {
      toast.error('Generation failed or deck not found. Your credits have been automatically refunded.');
      queryClient.invalidateQueries({ queryKey: ['generations'] });
      queryClient.invalidateQueries({ queryKey: ['generations-sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      router.push('/decks');
    }
  }, [id, isDeckError, currentDeck?.status, queryClient, router]);

  const handleDeleteDeck = (deckId: string) => {
    deleteDeckMutation.mutate(deckId, {
      onSuccess: () => {
        if (deckId === id) {
          router.push('/decks');
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Bar */}
      <DeckHeader activeTab="ai-chat" />

      {/* Main App Layout */}
      <div className="flex-1 flex w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Left Sidebar */}
        <DeckSidebar
          activeDeckId={id}
          onSelectDeckId={(selectedId) => router.push(`/decks/${selectedId}`)}
          onNewDeck={() => router.push('/decks')}
          onDeleteDeck={handleDeleteDeck}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 h-full min-w-0 p-3 sm:p-4 overflow-y-auto">
          {currentDeck ? (
            <DeckDocumentViewer
              deck={currentDeck}
              onBackToChat={() => router.push('/decks')}
            />
          ) : (
            <DeckDetailSkeleton />
          )}
        </main>
      </div>
    </div>
  );
}
