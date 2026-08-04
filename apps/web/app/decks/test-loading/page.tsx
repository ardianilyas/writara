'use client';

import { useRouter } from 'next/navigation';
import { DeckHeader, DeckLoadingState } from '@/features/decks';

export default function TestLoadingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Bar */}
      <DeckHeader activeTab="ai-chat" />

      {/* Main App Layout */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <DeckLoadingState
          topic="Laravel Basics: Modern Web Development"
          onBack={() => router.push('/decks')}
        />
      </main>
    </div>
  );
}
