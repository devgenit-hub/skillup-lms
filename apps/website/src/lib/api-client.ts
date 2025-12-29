import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Use local proxy in production to handle auth headers server-side
// This is the BFF (Backend-for-Frontend) pattern
const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api/proxy' // Browser: use local proxy route
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api'; // Server: direct call

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

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
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
      // Remove /api prefix since it's already in the base URL
      const cleanEndpoint = endpoint.replace(/^\/api/, '');
      const response = await this.client.request<ApiResponse<T>>({
        url: cleanEndpoint,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || error.response?.data?.error || error.message
        );
      }
      throw error;
    }
  }

  async getMe() {
    return this.request('/auth/me', { method: 'GET' });
  }

  async updateProfile(data: { name?: string; avatarUrl?: string; phone?: string }) {
    return this.request<unknown>('/auth/profile', {
      method: 'PATCH',
      data,
    });
  }

  async logout() {
    return this.request('/auth/logout', {
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
    courseType?: string;
    feeType?: string;
    published?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.level) query.append('level', params.level);
    if (params?.courseType) query.append('courseType', params.courseType);
    if (params?.feeType) query.append('feeType', params.feeType);
    if (params?.published !== undefined) query.append('published', params.published.toString());

    return this.request(`/courses/public?${query.toString()}`, { method: 'GET' });
  }

  async getPublicCourse(id: string) {
    return this.request(`/courses/public/${id}`, { method: 'GET' });
  }

  async getInitialData() {
    return this.request('/public/initial', { method: 'GET' });
  }

  // Public Webinar endpoints (no auth required)
  async getPublicWebinars(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    feeType?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.feeType) query.append('feeType', params.feeType);

    return this.request(`/webinars/public?${query.toString()}`, { method: 'GET' });
  }

  async getPublicWebinar(id: string) {
    return this.request(`/webinars/public/${id}`, { method: 'GET' });
  }

  // Course endpoints
  async getCourses(params?: { category?: string; search?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/courses${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`, { method: 'GET' });
  }

  async createCourse(data: Record<string, unknown>) {
    return this.request('/courses', {
      method: 'POST',
      data,
    });
  }

  async updateCourse(id: string, data: Record<string, unknown>) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Enrollment endpoints
  async getEnrollments() {
    return this.request('/enrollments', { method: 'GET' });
  }

  async enrollInCourse(courseId: string) {
    return this.request('/enrollments', {
      method: 'POST',
      data: { courseId },
    });
  }

  async unenrollFromCourse(courseId: string) {
    return this.request(`/enrollments/${courseId}`, {
      method: 'DELETE',
    });
  }

  async updateProgress(courseId: string, progress: number) {
    return this.request(`/enrollments/${courseId}/progress`, {
      method: 'PUT',
      data: { progress },
    });
  }

  // User endpoints (admin only)
  async getUsers(params?: { role?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/users${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`, { method: 'GET' });
  }

  async updateUser(id: string, data: Record<string, unknown>) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async initPayment(data: {
    amount: number;
    itemType: 'course' | 'webinar';
    itemId: string;
    couponCode?: string | null;
  }): Promise<{ success: boolean; paymentId: string; paymentUrl: string }> {
    // Payment API returns { success, paymentId, paymentUrl } directly, not wrapped in data
    const cleanEndpoint = '/payment/init';
    const response = await this.client.request<{
      success: boolean;
      paymentId: string;
      paymentUrl: string;
    }>({
      url: cleanEndpoint,
      method: 'POST',
      data,
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Export individual methods for convenience
export const updateProfile = (data: { name?: string; avatarUrl?: string; phone?: string }) =>
  apiClient.updateProfile(data);
