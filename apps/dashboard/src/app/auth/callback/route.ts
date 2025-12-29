import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore cookie errors during auth callback
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Store tokens in our custom httpOnly cookies for BFF proxy
      const isProduction = process.env.NODE_ENV === 'production';

      cookieStore.set('access_token', data.session.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      cookieStore.set('refresh_token', data.session.refresh_token!, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      // Sync user with backend
      try {
        const syncResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supabaseId: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.full_name,
            avatarUrl: data.session.user.user_metadata?.avatar_url,
          }),
        });

        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          const userRole = syncData.data?.role;

          // Redirect based on role
          if (userRole === 'ADMIN') {
            return NextResponse.redirect(`${origin}/superuser`);
          } else if (userRole === 'INSTRUCTOR') {
            return NextResponse.redirect(`${origin}/teacher`);
          }
        }
      } catch (syncError) {
        console.error('User sync error:', syncError);
      }

      // Default redirect to login if role not authorized
      return NextResponse.redirect(`${origin}/login?error=unauthorized`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=callback_failed`);
}
