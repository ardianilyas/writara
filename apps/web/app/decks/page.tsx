'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DeckHeader,
  DeckSidebar,
  DeckChatInterface,
  DeckSlideViewer,
  useGetDecks,
  useGetDeckById,
  useCreateDeck,
  useDeleteDeck,
  GenerationRecord,
} from '@/features/decks';
import { Loader2 } from 'lucide-react';

function DecksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeDeckId = searchParams.get('id');

  const { data: decks = [] } = useGetDecks();
  const { data: currentDeck } = useGetDeckById(activeDeckId);
  const createDeckMutation = useCreateDeck();
  const deleteDeckMutation = useDeleteDeck();

  const handleSelectDeck = (deck: GenerationRecord) => {
    router.push(`/decks?id=${deck.id}`);
  };

  const handleNewDeck = () => {
    router.push('/decks');
  };

  const handleCreateDeck = (topic: string, modelId: string) => {
    createDeckMutation.mutate(
      { topic, modelId },
      {
        onSuccess: (newDeck) => {
          router.push(`/decks?id=${newDeck.id}`);
        },
      }
    );
  };

  const handleDeleteDeck = (id: string) => {
    deleteDeckMutation.mutate(id, {
      onSuccess: () => {
        if (activeDeckId === id) {
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
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto p-3 sm:p-4 gap-4 h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar */}
        <DeckSidebar
          decks={decks}
          activeDeckId={activeDeckId}
          onSelectDeck={handleSelectDeck}
          onNewDeck={handleNewDeck}
          onDeleteDeck={handleDeleteDeck}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 h-full min-w-0">
          {activeDeckId && currentDeck ? (
            <DeckSlideViewer
              deck={currentDeck}
              onBackToChat={handleNewDeck}
            />
          ) : (
            <DeckChatInterface
              onSubmitTopic={handleCreateDeck}
              isGenerating={createDeckMutation.isPending}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function DecksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center space-y-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
          <p className="text-xs font-semibold">Loading Writara Decks...</p>
        </div>
      }
    >
      <DecksContent />
    </Suspense>
  );
}
