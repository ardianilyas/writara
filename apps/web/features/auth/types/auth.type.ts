export type UserRole = 'STUDENT' | 'TEACHER' | 'LECTURER';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: UserRole;
  freeCredits?: number;
  purchasedCredits?: number;
  createdAt: string;
  updatedAt: string;
};

export type AuthSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
};

export type SessionResponse = {
  user: AuthUser;
  session: AuthSession;
} | null;

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
};
