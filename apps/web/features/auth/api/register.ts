import { signUp } from '@/lib/auth-client';
import type { RegisterDto } from '../types/auth.type';

export async function register(dto: RegisterDto) {
  const result = await signUp.email({
    name: dto.name,
    email: dto.email,
    password: dto.password,
  });

  if (result.error) {
    throw new Error(result.error.message || 'Registration failed');
  }

  return result.data;
}
