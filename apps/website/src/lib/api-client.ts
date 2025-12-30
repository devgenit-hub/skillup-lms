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
      const cleanEndpoint = endpoint.replace(/^\/api/, '');
      const response = await this.client.request<ApiResponse<T>>({
        url: cleanEndpoint,
        ...config,
      });

      if (response.status === 204 || !response.data) {
        return { status: 'success', data: null as T };
      }

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

  // Student enrollment endpoints
  async getMyEnrollments() {
    return this.request<{
      enrollments: Array<{
        id: string;
        userId: string;
        courseId: string;
        status: string;
        progress: number;
        enrolledAt: string;
        completedAt: string | null;
        course: {
          id: string;
          title: string;
          description: string | null;
          introVideoLink: string | null;
          category: { id: string; title: string } | null;
          feeType: string;
          price: number | null;
          _count: { lessons: number; enrollments: number };
        };
      }>;
      stats: {
        total: number;
        completed: number;
        inProgress: number;
        remaining: number;
      };
    }>('/enrollments/my', { method: 'GET' });
  }

  async getMyCourseDetails(courseId: string) {
    return this.request<{
      id: string;
      userId: string;
      courseId: string;
      status: string;
      progress: number;
      enrolledAt: string;
      completedAt: string | null;
      course: {
        id: string;
        title: string;
        description: string | null;
        introVideoLink: string | null;
        category: { id: string; title: string } | null;
        lessons: Array<{
          id: string;
          title: string;
          content: string | null;
          order: number;
        }>;
        curriculumModules: Array<{
          id: string;
          title: string;
          details: string | null;
          order: number;
          classes: Array<{
            id: string;
            title: string;
            videoUrl: string | null;
            duration: number | null;
            order: number;
          }>;
          materials: Array<{
            id: string;
            title: string;
            fileUrl: string | null;
            fileType: string | null;
            fileSize: number | null;
            order: number;
          }>;
        }>;
        _count: { lessons: number; enrollments: number };
      };
    }>(`/enrollments/my/course/${courseId}`, { method: 'GET' });
  }

  async updateLessonProgress(courseId: string, lessonId: string, completed: boolean) {
    return this.request(`/enrollments/my/course/${courseId}/lesson/${lessonId}/progress`, {
      method: 'POST',
      data: { completed },
    });
  }

  // Webinar registration endpoints
  async getMyWebinarRegistrations() {
    return this.request<{
      registrations: Array<{
        id: string;
        webinarId: string;
        userId: string;
        registeredAt: string;
        webinar: {
          id: string;
          title: string;
          image: string | null;
          scheduleDateTime: string;
          duration: number;
          platform: string;
          status: string;
          feeType: string;
          price: number | null;
          liveLink: string | null;
          category: { id: string; title: string } | null;
          _count: { registrations: number };
        };
      }>;
      stats: {
        total: number;
        upcoming: number;
        completed: number;
      };
    }>('/enrollments/my/webinars', { method: 'GET' });
  }

  async getMyWebinarDetails(webinarId: string) {
    return this.request<{
      id: string;
      webinarId: string;
      userId: string;
      registeredAt: string;
      webinar: {
        id: string;
        title: string;
        image: string | null;
        scheduleDateTime: string;
        duration: number;
        platform: string;
        status: string;
        feeType: string;
        price: number | null;
        liveLink: string | null;
        sessionHighlights: string | null;
        aboutWebinar: string | null;
        speakers: unknown;
        sessionAgenda: unknown;
        resources: unknown;
        category: { id: string; title: string } | null;
        _count: { registrations: number };
      };
    }>(`/enrollments/my/webinar/${webinarId}`, { method: 'GET' });
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

  async enrollFree(data: {
    itemType: 'course' | 'webinar';
    itemId: string;
  }): Promise<{ success: boolean; message: string; enrollment?: unknown; registration?: unknown }> {
    const cleanEndpoint = '/payment/enroll-free';
    const response = await this.client.request<{
      success: boolean;
      message: string;
      enrollment?: unknown;
      registration?: unknown;
    }>({
      url: cleanEndpoint,
      method: 'POST',
      data,
    });
    return response.data;
  }

  async checkEnrollmentStatus(
    itemType: 'course' | 'webinar',
    itemId: string
  ): Promise<{ enrolled: boolean; enrollment?: unknown; registration?: unknown }> {
    const cleanEndpoint = `/payment/enrollment-status?itemType=${itemType}&itemId=${itemId}`;
    const response = await this.client.request<{
      enrolled: boolean;
      enrollment?: unknown;
      registration?: unknown;
    }>({
      url: cleanEndpoint,
      method: 'GET',
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

export const updateProfile = (data: { name?: string; avatarUrl?: string; phone?: string }) =>
  apiClient.updateProfile(data);
