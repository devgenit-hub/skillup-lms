import { apiClient, ApiResponse } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, type AuthUser } from '@/lib/zustand/auth-store';

export function useApi<T>(apiCall: () => Promise<ApiResponse<T>>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    apiCall()
      .then((response) => {
        if (!cancelled) {
          setData(response.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, isLoading, error };
}

export function useCourses(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async () => {
      const response = await apiClient.getCourses(params);
      return response.data;
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: async () => {
      const response = await apiClient.getCourse(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useEnrollments() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const response = await apiClient.getEnrollments();
      return response.data;
    },
    enabled: !!user,
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiClient.enrollInCourse(courseId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { name?: string; avatarUrl?: string }) => {
      const response = await apiClient.updateProfile(data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data as AuthUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
