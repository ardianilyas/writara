'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DeckHeader,
  DeckSidebar,
  DeckChatInterface,
  useCreateDeck,
  useDeleteDeck,
} from '@/features/decks';

export default function DecksNewPage() {
  const router = useRouter();
  const createDeckMutation = useCreateDeck();
  const deleteDeckMutation = useDeleteDeck();

  const handleCreateDeck = (topic: string, modelId: string, slideCount?: number) => {
    createDeckMutation.mutate(
      { topic, modelId, slideCount },
      {
        onSuccess: (newDeck) => {
          router.push(`/decks/${newDeck.id}`);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err?.message || 'Failed to start presentation generation.';
          toast.error(msg);
        },
      }
    );
  };

  const handleDeleteDeck = (id: string) => {
    deleteDeckMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Bar */}
      <DeckHeader activeTab="ai-chat" />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto p-3 sm:p-4 gap-4 h-[calc(100vh-3.5rem)]">
        {/* Left Sidebar */}
        <DeckSidebar
          onSelectDeckId={(selectedId) => router.push(`/decks/${selectedId}`)}
          onNewDeck={() => router.push('/decks')}
          onDeleteDeck={handleDeleteDeck}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 h-full min-w-0">
          <DeckChatInterface
            onSubmitTopic={handleCreateDeck}
            isGenerating={createDeckMutation.isPending}
          />
        </main>
      </div>
    </div>
  );
}
