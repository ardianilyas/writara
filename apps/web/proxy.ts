import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Better Auth session token cookie
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedPage = pathname.startsWith('/decks');

  // If user is authenticated and trying to access /login or /register -> redirect to /
  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is NOT authenticated and trying to access /decks -> redirect to /login
  if (!sessionToken && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/decks', '/decks/:path*'],
};
