import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T = unknown> {
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

  async updateTeacher(id: string, data: { name?: string; email?: string }) {
    return this.request(`/api/teachers/${id}`, {
      method: 'PATCH',
      data,
    });
  }

  async resetTeacherPassword(id: string) {
    return this.request(`/api/teachers/${id}/reset-password`, {
      method: 'POST',
    });
  }

  async getTeachers() {
    return this.request('/api/teachers', { method: 'GET' });
  }

  async createTeacher(data: { name: string; email: string }) {
    return this.request('/api/teachers', {
      method: 'POST',
      data,
    });
  }

  async deleteTeacher(id: string) {
    return this.request(`/api/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  async getStudents(courseId?: string) {
    const query = courseId ? `?courseId=${courseId}` : '';
    return this.request(`/api/instructor/students${query}`, { method: 'GET' });
  }

  async suspendStudent(userId: string, reason: string) {
    return this.request(`/api/instructor/students/${userId}/suspend`, {
      method: 'POST',
      data: { reason },
    });
  }

  async unsuspendStudent(userId: string) {
    return this.request(`/api/instructor/students/${userId}/unsuspend`, {
      method: 'POST',
    });
  }

  async getStudentPayments(userId: string) {
    return this.request(`/api/instructor/students/${userId}/payments`, {
      method: 'GET',
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
