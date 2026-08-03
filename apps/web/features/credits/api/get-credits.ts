import { apiClient } from '@/lib/api-client';
import type { UserCredits, GetCreditsResponse } from '../types/credits.type';

export async function getCredits(): Promise<UserCredits> {
  const response = await apiClient.get<GetCreditsResponse>('/api/credits');
  return response.data.data;
}
