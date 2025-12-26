'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import { useCourseStore, Course } from '@/lib/zustand/course-store';
import { useCategoryStore, Category } from '@/lib/zustand/category-store';

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

interface CategoryApiResponse {
  id: string;
  title: string;
  slug: string;
  courseCount: number;
  webinarCount: number;
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setCourses } = useCourseStore();
  const { setCategories } = useCategoryStore();

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
      console.error('Failed to fetch courses:', error);
    }
  }, [setCourses]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.getCategories();
      const categoriesData = response.data as CategoryApiResponse[];
      const categories: Category[] = Array.isArray(categoriesData)
        ? categoriesData.map((c) => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            courseCount: c.courseCount,
            webinarCount: c.webinarCount,
          }))
        : [];

      setCategories(categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [setCategories]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchCourses(), fetchCategories()]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCourses, fetchCategories]);

  useEffect(() => {
    Promise.all([fetchCourses(), fetchCategories()]);
  }, [fetchCourses, fetchCategories]);

  const value = {
    isLoading,
    setIsLoading,
    refreshAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
