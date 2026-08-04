'use client';

import { useState } from 'react';
import {
  DeckHeader,
  DeckSidebar,
  DeckChatInterface,
  DeckSlideViewer,
  useGetDecks,
  useGetDeckById,
  useCreateDeck,
  useDeleteDeck,
} from '@/features/decks';

export default function DecksPage() {
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: decks = [] } = useGetDecks();
  const { data: currentDeck } = useGetDeckById(activeDeckId);
  const createDeckMutation = useCreateDeck();
  const deleteDeckMutation = useDeleteDeck();

  const handleCreateDeck = (topic: string, modelId: string) => {
    createDeckMutation.mutate(
      { topic, modelId },
      {
        onSuccess: (newDeck) => {
          setActiveDeckId(newDeck.id);
        },
      }
    );
  };

  const handleDeleteDeck = (id: string) => {
    deleteDeckMutation.mutate(id, {
      onSuccess: () => {
        if (activeDeckId === id) {
          setActiveDeckId(null);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Bar */}
      <DeckHeader
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab="ai-chat"
      />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto p-3 sm:p-4 gap-4 h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        {isSidebarOpen && (
          <DeckSidebar
            decks={decks}
            activeDeckId={activeDeckId}
            onSelectDeck={(deck) => setActiveDeckId(deck.id)}
            onNewDeck={() => setActiveDeckId(null)}
            onDeleteDeck={handleDeleteDeck}
          />
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 h-full min-w-0">
          {currentDeck ? (
            <DeckSlideViewer
              deck={currentDeck}
              onBackToChat={() => setActiveDeckId(null)}
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
