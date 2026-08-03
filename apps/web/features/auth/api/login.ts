import { signIn } from '@/lib/auth-client';
import type { LoginDto } from '../types/auth.type';

export async function login(dto: LoginDto) {
  const result = await signIn.email({
    email: dto.email,
    password: dto.password,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Login failed');
  }

  return result.data;
}
