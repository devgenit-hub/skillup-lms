'use client';

import { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { useAppStore } from '@/lib/zustand/app-store';
import { apiClient } from '@/lib/api-client';
import type { CourseCard, WebinarCard, Category } from '@/lib/zustand/app-store';

export interface AppContextValue {
  isLoading: boolean;
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
  const {
    setCourses,
    setWebinars,
    setCategories,
    setCoursesLoading,
    setWebinarsLoading,
    setCategoriesLoading,
    initialDataFetched,
    setInitialDataFetched,
  } = useAppStore();

  // Use ref to track if fetch is in progress
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (initialDataFetched || fetchingRef.current) {
      return;
    }

    const fetchInitialData = async () => {
      fetchingRef.current = true;
      try {
        const response = await apiClient.getInitialData();

        if (response.status === 'success' && response.data) {
          const data = response.data as {
            courses: CourseCard[];
            webinars: WebinarCard[];
            categories: Category[];
          };

          const filteredCategories = (data.categories || []).filter(
            (category) => (category.courseCount ?? 0) > 0 || (category.webinarCount ?? 0) > 0
          );

          setCourses(data.courses || []);
          setWebinars(data.webinars || []);
          setCategories(filteredCategories);
          setInitialDataFetched(true);
        } else {
          setCoursesLoading(false);
          setWebinarsLoading(false);
          setCategoriesLoading(false);
        }
      } catch {
        setCoursesLoading(false);
        setWebinarsLoading(false);
        setCategoriesLoading(false);
      } finally {
        fetchingRef.current = false;
      }
    };

    fetchInitialData();
  }, [
    setCourses,
    setWebinars,
    setCategories,
    setCoursesLoading,
    setWebinarsLoading,
    setCategoriesLoading,
    initialDataFetched,
    setInitialDataFetched,
  ]);

  const value = {
    isLoading: !initialDataFetched,
    isReady: initialDataFetched,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
