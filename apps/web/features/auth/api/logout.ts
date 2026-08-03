import { signOut } from '@/lib/auth-client';

export async function logout() {
  const result = await signOut();

  if (result.error) {
    throw new Error(result.error.message || 'Logout failed');
  }

  return result.data;
}
