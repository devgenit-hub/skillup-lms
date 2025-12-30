import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { setAuthCookies, clearAuthCookies, syncUserWithBackend } from '@/app/(auth)/actions';
import { apiClient } from '@/lib/api-client';
import { UserRole } from '@repo/shared';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: typeof UserRole.INSTRUCTOR | typeof UserRole.ADMIN;
  enrolledCourseIds?: string[];
  enrolledWebinarIds?: string[];
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  refreshUser: async () => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && session.user.email) {
        await setAuthCookies(session.access_token, session.refresh_token!);

        try {
          await syncUserWithBackend({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
            email_confirmed_at: session.user.email_confirmed_at,
            app_metadata: session.user.app_metadata,
          });
        } catch {
          // Ignore sync errors
        }

        try {
          const backendData = await apiClient.getMe();
          const user = backendData.data as AuthUser;

          if (user.role === UserRole.INSTRUCTOR || user.role === UserRole.ADMIN) {
            set({ user });
          } else {
            await supabase.auth.signOut();
            await clearAuthCookies();
            set({ user: null });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '';

          if (errorMessage.includes('User not found') || errorMessage.includes('USER_NOT_SYNCED')) {
            await supabase.auth.signOut();
            await clearAuthCookies();
            set({ user: null });
          } else {
            set({ user: null });
          }
        }
      } else {
        set({ user: null });
        await clearAuthCookies();
      }
    } catch {
      set({ user: null });
    }
  },
  logout: async () => {
    try {
      await apiClient.logout().catch(() => {});
    } catch {
      // Ignore logout errors
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    await clearAuthCookies();
    set({ user: null });
  },
}));
