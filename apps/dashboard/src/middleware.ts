import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { UserRole } from '@repo/shared';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = request.cookies.get('access_token')?.value;

  if ((!session || !accessToken) && pathname !== '/login' && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && pathname === '/login' && accessToken) {
    const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
    });

    if (meResponse.ok) {
      const { data } = await meResponse.json();
      const requestedRole = request.nextUrl.searchParams.get('id');

      if (
        (data.role === UserRole.ADMIN && requestedRole === 'superuser') ||
        (data.role === UserRole.INSTRUCTOR && requestedRole === 'teacher')
      ) {
        const redirectUrl = data.role === UserRole.ADMIN ? '/superuser' : '/teacher';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  if (session && (pathname.startsWith('/superuser') || pathname.startsWith('/teacher'))) {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
    });

    if (!meResponse.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data } = await meResponse.json();

    if (pathname.startsWith('/superuser') && data.role !== UserRole.ADMIN) {
      if (data.role === UserRole.INSTRUCTOR) {
        return NextResponse.redirect(new URL('/teacher', request.url));
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/teacher') && data.role !== UserRole.INSTRUCTOR) {
      if (data.role === UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/superuser', request.url));
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
