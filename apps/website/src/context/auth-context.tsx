'use client';

import { useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setAuthCookies, clearAuthCookies, syncUserWithBackend } from '@/app/(auth)/actions';
import { useAuthStore } from '@/lib/zustand/auth-store';
import { apiClient } from '@/lib/api-client';
import type { AuthUser } from '@/lib/zustand/auth-store';

export { useAuthStore as useAuth } from '@/lib/zustand/auth-store';

export function AuthProvider({ children }: { children: ReactNode }) {
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const supabase = createClient();

    refreshUser().finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (session?.user && session.user.email) {
          await setAuthCookies(session.access_token, session.refresh_token!);

          if (event !== 'TOKEN_REFRESHED') {
            try {
              await syncUserWithBackend({
                id: session.user.id,
                email: session.user.email,
                user_metadata: session.user.user_metadata,
                email_confirmed_at: session.user.email_confirmed_at,
                app_metadata: session.user.app_metadata,
              });

              const userData = await apiClient.getMe();
              setUser(userData.data as AuthUser);
            } catch {
              setUser(null);
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        await clearAuthCookies();
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshUser, setLoading, setUser]);

  return <>{children}</>;
}
