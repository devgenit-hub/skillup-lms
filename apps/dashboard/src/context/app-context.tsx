'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AppContextValue {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isReady: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const value = {
    isLoading,
    setIsLoading,
    isReady,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
