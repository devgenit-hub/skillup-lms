'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  // Use 'none' for cross-origin requests in production (API on different domain)
  // 'none' requires 'secure: true' (HTTPS)
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
      data,
      {
        headers: {
          Cookie: `access_token=${accessToken}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (err: unknown) {
    const error = err as {
      response?: { data?: { code?: string; error?: string; message?: string } };
      message?: string;
    };
    // If token is invalid, ask user to refresh the page
    if (
      error.response?.data?.code === 'TOKEN_EXPIRED' ||
      error.response?.data?.error === 'Invalid token'
    ) {
      throw new Error('Session expired. Please refresh the page and try again.');
    }
    throw new Error(error.response?.data?.message || error.message || 'Failed to update profile');
  }
}

export async function syncUserWithBackend(supabaseUser: {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  email_confirmed_at?: string;
  app_metadata?: {
    provider?: string;
  };
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      supabaseId: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.full_name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      emailVerified: !!supabaseUser.email_confirmed_at,
      provider: supabaseUser.app_metadata?.provider?.toUpperCase() || 'EMAIL',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync user with backend');
  }

  const data = await response.json();
  return data;
}
