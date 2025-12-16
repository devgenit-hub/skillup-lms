import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
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
    return this.request<any>('/api/auth/profile', {
      method: 'PATCH',
      data,
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Course endpoints
  async getCourses(params?: { category?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/api/courses${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getCourse(id: string) {
    return this.request(`/api/courses/${id}`, { method: 'GET' });
  }

  async createCourse(data: any) {
    return this.request('/api/courses', {
      method: 'POST',
      data,
    });
  }

  async updateCourse(id: string, data: any) {
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
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/api/users${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getUser(id: string) {
    return this.request(`/api/users/${id}`, { method: 'GET' });
  }

  async updateUser(id: string, data: any) {
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
