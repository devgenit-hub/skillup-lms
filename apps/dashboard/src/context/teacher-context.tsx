'use client';

import { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useTeacherStore, TeacherProfile, TeacherCourse } from '@/lib/zustand/teacher-store';
import { apiClient } from '@/lib/api-client';

interface TeacherContextValue {
  profile: TeacherProfile | null;
  courses: TeacherCourse[];
  loading: boolean;
  refreshAll: () => Promise<void>;
}

const TeacherContext = createContext<TeacherContextValue | null>(null);

export function useTeacher() {
  const ctx = useContext(TeacherContext);
  if (!ctx) {
    throw new Error('useTeacher must be used within TeacherProvider');
  }
  return ctx;
}

export function TeacherProvider({ children }: { children: ReactNode }) {
  const { profile, courses, loading, setProfile, setCourses, setLoading } = useTeacherStore();

  const fetchTeacherData = useCallback(async () => {
    try {
      setLoading(true);

      // First fetch profile to get teacher ID
      const profileRes = await apiClient.getCurrentTeacher();
      const teacherProfile = profileRes.data as TeacherProfile;
      setProfile(teacherProfile);

      // Then fetch courses using the teacher's ID
      const coursesRes = await apiClient.getCourses({ teacherId: teacherProfile.id });

      const courses = Array.isArray(coursesRes.data) ? (coursesRes.data as TeacherCourse[]) : [];

      setCourses(courses);
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    } finally {
      setLoading(false);
    }
  }, [setProfile, setCourses, setLoading]);

  const refreshAll = useCallback(async () => {
    await fetchTeacherData();
  }, [fetchTeacherData]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const value = {
    profile,
    courses,
    loading,
    refreshAll,
  };

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>;
}
