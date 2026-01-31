import { proxy } from '@/proxy';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: [
    '/student/:path*',
    '/auth/login',
    '/auth/register',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
