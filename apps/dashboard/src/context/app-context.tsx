'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import { useCourseStore, Course } from '@/lib/zustand/course-store';

export interface AppContextValue {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}

interface CourseApiResponse {
  id: string;
  title: string;
  published: boolean;
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setCourses } = useCourseStore();

  const fetchCourses = useCallback(async () => {
    try {
      const response = await apiClient.getCourses({ limit: 1000, published: true });
      const coursesData = response.data as CourseApiResponse[];
      const courses: Course[] = Array.isArray(coursesData)
        ? coursesData.map((c) => ({
            id: c.id,
            title: c.title,
            published: c.published,
          }))
        : [];

      setCourses(courses);
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }, [setCourses]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchCourses();
    } finally {
      setIsLoading(false);
    }
  }, [fetchCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const value = {
    isLoading,
    setIsLoading,
    refreshAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
