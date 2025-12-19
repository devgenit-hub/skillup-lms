import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { setAuthCookies, clearAuthCookies } from '@/app/(auth)/actions';
import { apiClient } from '@/lib/api-client';
import { UserRole } from '@repo/shared';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  phone?: string | null;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  emailVerified: boolean;
  provider: 'EMAIL' | 'GOOGLE';
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  isVerified: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isVerified: false,
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

        const backendData = await apiClient.getMe();
        const userData = backendData.data as AuthUser;

        if (userData.role === UserRole.STUDENT) {
          set({ user: userData, isVerified: true });
        } else {
          await supabase.auth.signOut();
          await clearAuthCookies();
          set({ user: null, isVerified: true });
        }
      } else {
        set({ user: null, isVerified: true });
        await clearAuthCookies();
      }
    } catch {
      set({ user: null, isVerified: true });
    }
  },
  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await clearAuthCookies();
    set({ user: null, isVerified: true });
  },
}));
