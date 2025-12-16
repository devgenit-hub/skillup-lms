import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { setAuthCookies, clearAuthCookies } from '@/app/(auth)/actions';
import { apiClient } from '@/lib/api-client';
import { UserRole } from '@repo/shared';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: typeof UserRole.INSTRUCTOR | typeof UserRole.ADMIN;
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

        const backendData = await apiClient.getMe();
        const user = backendData.data as AuthUser;

        if (user.role === UserRole.INSTRUCTOR || user.role === UserRole.ADMIN) {
          set({ user });
        } else {
          set({ user: null });
        }
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    }
  },
  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await clearAuthCookies();
    set({ user: null });
  },
}));
