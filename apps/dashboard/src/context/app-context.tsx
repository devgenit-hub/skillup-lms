'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import { useCourseStore, Course } from '@/lib/zustand/course-store';

export interface AppContextValue {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
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

  useEffect(() => {
    const fetchCourses = async () => {
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
    };

    fetchCourses();
  }, [setCourses]);

  const value = {
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
