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

  async getCurrentTeacher() {
    return this.request('/api/teachers/me', { method: 'GET' });
  }

  async updateCurrentTeacher(data: {
    name?: string;
    phone?: string;
    address?: string;
    qualification?: string;
    experience?: string;
    specialization?: string;
    bio?: string;
    profileImage?: string;
    joiningDate?: string;
  }) {
    return this.request('/api/teachers/me', {
      method: 'PATCH',
      data,
    });
  }

  async updateTeacher(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      address?: string;
      qualification?: string;
      experience?: string;
      specialization?: string;
      bio?: string;
      profileImage?: string;
      joiningDate?: string;
    }
  ) {
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

  async createTeacher(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    qualification?: string;
    experience?: string;
    specialization?: string;
    bio?: string;
    profileImage?: string;
    joiningDate?: string;
  }) {
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

  // Superuser Student Management
  async getSuperuserStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'active' | 'suspended';
    courseId?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.courseId) query.append('courseId', params.courseId);

    return this.request(`/api/students?${query.toString()}`, { method: 'GET' });
  }

  async getStudentById(id: string) {
    return this.request(`/api/students/${id}`, { method: 'GET' });
  }

  async createStudent(data: { name: string; email: string; password: string; phone?: string }) {
    return this.request('/api/students', {
      method: 'POST',
      data,
    });
  }

  async updateStudent(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ) {
    return this.request(`/api/students/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async suspendStudentAdmin(id: string, reason: string) {
    return this.request(`/api/students/${id}/suspend`, {
      method: 'PATCH',
      data: { reason },
    });
  }

  async unsuspendStudentAdmin(id: string) {
    return this.request(`/api/students/${id}/unsuspend`, {
      method: 'PATCH',
    });
  }

  async deleteStudent(id: string, confirmId: string) {
    return this.request(`/api/students/${id}`, {
      method: 'DELETE',
      data: { confirmId },
    });
  }

  // Webinar Management
  async getWebinars(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'draft' | 'upcoming' | 'live' | 'completed';
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);

    return this.request(`/api/webinars?${query.toString()}`, { method: 'GET' });
  }

  async getWebinarById(id: string) {
    return this.request(`/api/webinars/${id}`, { method: 'GET' });
  }

  async createWebinar(data: {
    title: string;
    category: string;
    scheduleDateTime: string;
    duration: number;
    feeType: 'free' | 'paid';
    price?: number;
    platform: string;
    status: 'draft' | 'upcoming' | 'live' | 'completed';
    sessionHighlights: string;
    aboutWebinar: string;
    image?: string;
    speakers?: unknown;
    sessionAgenda?: unknown;
    resources?: unknown;
    liveLink?: string;
  }) {
    return this.request('/api/webinars', {
      method: 'POST',
      data,
    });
  }

  async updateWebinar(
    id: string,
    data: {
      title?: string;
      category?: string;
      scheduleDateTime?: string;
      duration?: number;
      feeType?: 'free' | 'paid';
      price?: number;
      platform?: string;
      status?: 'draft' | 'upcoming' | 'live' | 'completed';
      sessionHighlights?: string;
      aboutWebinar?: string;
      image?: string;
      speakers?: unknown;
      sessionAgenda?: unknown;
      resources?: unknown;
      liveLink?: string;
    }
  ) {
    return this.request(`/api/webinars/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async deleteWebinar(id: string) {
    return this.request(`/api/webinars/${id}`, {
      method: 'DELETE',
    });
  }

  async registerWebinar(id: string) {
    return this.request(`/api/webinars/${id}/register`, {
      method: 'POST',
    });
  }

  async unregisterWebinar(id: string) {
    return this.request(`/api/webinars/${id}/register`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getDashboardStats() {
    return this.request('/api/analytics/dashboard', { method: 'GET' });
  }

  async getRevenueAnalytics(params?: { period?: 'monthly' | 'yearly'; year?: number }) {
    const query = new URLSearchParams();
    if (params?.period) query.append('period', params.period);
    if (params?.year) query.append('year', params.year.toString());

    return this.request(`/api/analytics/revenue?${query.toString()}`, { method: 'GET' });
  }

  async getStudentAnalytics(params?: { period?: 'monthly' | 'yearly'; year?: number }) {
    const query = new URLSearchParams();
    if (params?.period) query.append('period', params.period);
    if (params?.year) query.append('year', params.year.toString());

    return this.request(`/api/analytics/students?${query.toString()}`, { method: 'GET' });
  }

  async getCourseAnalytics(params?: { limit?: number }) {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());

    return this.request(`/api/analytics/courses?${query.toString()}`, { method: 'GET' });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
