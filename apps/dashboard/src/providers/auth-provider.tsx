'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/zustand/auth-store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshUser, setLoading } = useAuthStore();

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser, setLoading]);

  return <>{children}</>;
}
