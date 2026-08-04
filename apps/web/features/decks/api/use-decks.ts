import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useSession } from '@/features/auth';

export interface Slide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  layout: 'TITLE' | 'BULLET_POINTS' | 'TWO_COLUMN' | 'KEY_METRIC' | 'SUMMARY';
  bulletPoints?: string[];
  leftColumnContent?: string[];
  rightColumnContent?: string[];
  keyMetric?: { value: string; label: string };
  speakerNotes: string;
  visualSuggestion?: string;
}

export interface Chapter {
  chapterNumber: number;
  title: string;
  summary: string;
  learningObjectives: string[];
  slides: Slide[];
  keyTakeaways: string[];
}

export interface GeneratedContentPayload {
  topic: string;
  template: string;
  totalChapters: number;
  estimatedDurationMinutes: number;
  targetAudience: string;
  chapters: Chapter[];
}

export interface GenerationRecord {
  id: string;
  userId: string;
  topic: string;
  template: string;
  modelId: string;
  modelTier: 'FREE' | 'PAID';
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  content?: GeneratedContentPayload | null;
  generatedContent?: GeneratedContentPayload | null;
  errorMessage?: string | null;
  creditsUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface SidebarDeckItem {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

export interface SidebarDecksResponse {
  count: number;
  items: SidebarDeckItem[];
}

export function useGetDecksSidebar() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return useQuery({
    queryKey: ['generations-sidebar'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: SidebarDecksResponse }>('/api/generations/sidebar');
      return response.data.data;
    },
    enabled: isAuthenticated,
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPending = data?.items?.some(
        (d) => d.status === 'PENDING' || d.status === 'GENERATING' || d.status === 'IN_PROGRESS'
      );
      return hasPending ? 2000 : false;
    },
    staleTime: 1000 * 5,
  });
}

export function useGetDecks() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return useQuery({
    queryKey: ['generations'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: GenerationRecord[] }>('/api/generations');
      return response.data.data;
    },
    enabled: isAuthenticated,
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPending = data?.some(
        (d) => d.status === 'PENDING' || d.status === 'GENERATING' || (d.status as string) === 'IN_PROGRESS'
      );
      return hasPending ? 2000 : false;
    },
    staleTime: 1000 * 5,
  });
}

export function useGetDeckById(id: string | null) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return useQuery({
    queryKey: ['generations', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<{ success: boolean; data: GenerationRecord }>(`/api/generations/${id}`);
      return response.data.data;
    },
    enabled: isAuthenticated && !!id,
    retry: false,
    refetchInterval: (query) => {
      const deck = query.state.data;
      if (
        deck &&
        (deck.status === 'PENDING' || deck.status === 'GENERATING' || (deck.status as string) === 'IN_PROGRESS')
      ) {
        return 2000;
      }
      return false;
    },
  });
}

export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { topic: string; modelId?: string; template?: string }) => {
      const response = await apiClient.post<{ success: boolean; data: GenerationRecord }>('/api/generations', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generations'] });
      queryClient.invalidateQueries({ queryKey: ['generations-sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });
}

export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/generations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generations'] });
      queryClient.invalidateQueries({ queryKey: ['generations-sidebar'] });
    },
  });
}
