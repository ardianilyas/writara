import { authClient } from '@/lib/auth-client';
import type { SessionResponse } from '../types/auth.type';

export async function getSession(): Promise<SessionResponse> {
  const result = await authClient.getSession();
  if (result.error || !result.data) {
    return null;
  }
  return result.data as unknown as SessionResponse;
}
