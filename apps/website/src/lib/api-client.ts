import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T = unknown> {
  status: 'success';
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<ApiResponse<T>>({
        url: endpoint,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  async getMe() {
    return this.request('/api/auth/me', { method: 'GET' });
  }

  async updateProfile(data: { name?: string; avatarUrl?: string; phone?: string }) {
    return this.request<unknown>('/api/auth/profile', {
      method: 'PATCH',
      data,
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Public Course endpoints (no auth required)
  async getPublicCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    level?: string;
    language?: string;
    feeType?: 'free' | 'paid';
    published?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.level) query.append('level', params.level);
    if (params?.language) query.append('language', params.language);
    if (params?.feeType) query.append('feeType', params.feeType);
    if (params?.published !== undefined) query.append('published', params.published.toString());

    return this.request(`/api/courses/public?${query.toString()}`, { method: 'GET' });
  }

  async getPublicCourse(id: string) {
    return this.request(`/api/courses/public/${id}`, { method: 'GET' });
  }

  async getInitialData() {
    return this.request('/api/public/initial', { method: 'GET' });
  }

  // Public Webinar endpoints (no auth required)
  async getPublicWebinars(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: 'draft' | 'upcoming' | 'live' | 'completed' | 'all';
    feeType?: 'free' | 'paid';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.feeType) query.append('feeType', params.feeType);

    return this.request(`/api/webinars/public?${query.toString()}`, { method: 'GET' });
  }

  async getPublicWebinar(id: string) {
    return this.request(`/api/webinars/public/${id}`, { method: 'GET' });
  }

  // Course endpoints
  async getCourses(params?: { category?: string; search?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/api/courses${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getCourse(id: string) {
    return this.request(`/api/courses/${id}`, { method: 'GET' });
  }

  async createCourse(data: Record<string, unknown>) {
    return this.request('/api/courses', {
      method: 'POST',
      data,
    });
  }

  async updateCourse(id: string, data: Record<string, unknown>) {
    return this.request(`/api/courses/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/api/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Enrollment endpoints
  async getEnrollments() {
    return this.request('/api/enrollments', { method: 'GET' });
  }

  async enrollInCourse(courseId: string) {
    return this.request('/api/enrollments', {
      method: 'POST',
      data: { courseId },
    });
  }

  async unenrollFromCourse(courseId: string) {
    return this.request(`/api/enrollments/${courseId}`, {
      method: 'DELETE',
    });
  }

  async updateProgress(courseId: string, progress: number) {
    return this.request(`/api/enrollments/${courseId}/progress`, {
      method: 'PUT',
      data: { progress },
    });
  }

  // User endpoints (admin only)
  async getUsers(params?: { role?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/api/users${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getUser(id: string) {
    return this.request(`/api/users/${id}`, { method: 'GET' });
  }

  async updateUser(id: string, data: Record<string, unknown>) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async deleteUser(id: string) {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

// Export individual methods for convenience
export const updateProfile = (data: { name?: string; avatarUrl?: string; phone?: string }) =>
  apiClient.updateProfile(data);
