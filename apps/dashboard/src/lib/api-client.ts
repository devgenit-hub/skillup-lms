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

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message || 'An error occurred';
          return Promise.reject(new Error(message));
        }
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const response = await this.client.request<ApiResponse<T>>({
      url: endpoint,
      ...config,
    });
    return response.data;
  }

  async getMe() {
    return this.request('/api/auth/me', { method: 'GET' });
  }

  async getCurrentTeacher() {
    return this.request('/api/teachers/me', { method: 'GET' });
  }

  async getTeacherCourses() {
    return this.request('/api/courses?teacherId=me', { method: 'GET' });
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

  async getTeachers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    courseId?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.courseId) query.append('courseId', params.courseId);

    return this.request(`/api/teachers?${query.toString()}`, { method: 'GET' });
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

  async getStudents(params?: {
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

    return this.request(`/api/students/teacher?${query.toString()}`, { method: 'GET' });
  }

  async suspendStudent(userId: string, reason: string) {
    return this.request(`/api/students/teacher/${userId}/suspend`, {
      method: 'PATCH',
      data: { reason },
    });
  }

  async unsuspendStudent(userId: string) {
    return this.request(`/api/students/teacher/${userId}/unsuspend`, {
      method: 'PATCH',
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

  async createStudent(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    avatarUrl?: string;
  }) {
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

  // Course Management
  async getCourses(params?: {
    page?: number;
    limit?: number;
    published?: boolean;
    teacherId?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.published !== undefined) query.append('published', params.published.toString());
    if (params?.teacherId) query.append('teacherId', params.teacherId);

    return this.request(`/api/courses?${query.toString()}`, { method: 'GET' });
  }

  async getCourseById(id: string) {
    return this.request(`/api/courses/${id}`, { method: 'GET' });
  }

  async getTeacherCourseById(id: string) {
    return this.request(`/api/courses/teacher/${id}`, { method: 'GET' });
  }

  async createCourse(data: {
    title: string;
    description?: string;
    published?: boolean;
    introVideoLink?: string;
    feeType?: 'FREE' | 'PAID';
    price?: number | null;
    metadata?: Record<string, unknown>;
  }) {
    return this.request('/api/courses', {
      method: 'POST',
      data,
    });
  }

  async updateCourse(
    id: string,
    data: {
      title?: string;
      description?: string;
      published?: boolean;
      introVideoLink?: string;
      feeType?: 'FREE' | 'PAID';
      price?: number | null;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.request(`/api/courses/${id}`, {
      method: 'PUT',
      data,
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/api/courses/${id}`, { method: 'DELETE' });
  }

  async getCourseStudents(id: string, params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    return this.request(`/api/courses/${id}/students?${query.toString()}`, { method: 'GET' });
  }

  async assignCourseTeachers(id: string, teacherIds: string[]) {
    return this.request(`/api/courses/${id}/assign-teachers`, {
      method: 'POST',
      data: { teacherIds },
    });
  }

  async createCourseCoupon(
    id: string,
    couponData: {
      code: string;
      title?: string;
      discount: number;
      expiresAt: string;
      maxUsage?: number;
    }
  ) {
    return this.request(`/api/courses/${id}/coupons`, {
      method: 'POST',
      data: couponData,
    });
  }

  async getCourseCoupons(id: string) {
    return this.request(`/api/courses/${id}/coupons`, {
      method: 'GET',
    });
  }

  async toggleCourseCoupon(courseId: string, couponId: string) {
    return this.request(`/api/courses/${courseId}/coupons/${couponId}`, {
      method: 'PATCH',
    });
  }

  async updateCourseCoupon(
    courseId: string,
    couponId: string,
    couponData: { code: string; title?: string; discount: number; expiresAt: string }
  ) {
    return this.request(`/api/courses/${courseId}/coupons/${couponId}`, {
      method: 'PUT',
      data: couponData,
    });
  }

  async deleteCourseCoupon(courseId: string, couponId: string) {
    return this.request(`/api/courses/${courseId}/coupons/${couponId}`, {
      method: 'DELETE',
    });
  }

  async getCourseCurriculum(id: string): Promise<
    ApiResponse<{
      modules: {
        id: string;
        title: string;
        details?: string | null;
        order: number;
        classes: { id: string; title: string; videoUrl?: string | null; order: number }[];
        materials: { id: string; title: string; fileUrl?: string | null; order: number }[];
      }[];
    }>
  > {
    return this.request(`/api/courses/${id}/curriculum`, {
      method: 'GET',
    });
  }

  async updateCourseCurriculum(
    id: string,
    modules: {
      id?: string;
      title: string;
      details?: string | null;
      order?: number;
      classes?: {
        id?: string;
        title: string;
        videoUrl?: string;
        duration?: number | null;
        order?: number;
      }[];
      materials?: {
        id?: string;
        title: string;
        fileUrl?: string;
        fileType?: string | null;
        fileSize?: number | null;
        order?: number;
      }[];
    }[]
  ) {
    return this.request(`/api/courses/${id}/curriculum`, {
      method: 'PUT',
      data: { modules },
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/api/users/change-password', {
      method: 'POST',
      data: { currentPassword, newPassword },
    });
  }

  // Webinar Coupon methods
  async createWebinarCoupon(
    id: string,
    couponData: {
      code: string;
      title?: string;
      discount: number;
      expiresAt: string;
      maxUsage?: number;
    }
  ) {
    return this.request(`/api/webinars/${id}/coupons`, {
      method: 'POST',
      data: couponData,
    });
  }

  async getWebinarCoupons(id: string) {
    return this.request(`/api/webinars/${id}/coupons`, {
      method: 'GET',
    });
  }

  async toggleWebinarCoupon(webinarId: string, couponId: string) {
    return this.request(`/api/webinars/${webinarId}/coupons/${couponId}`, {
      method: 'PATCH',
    });
  }

  async updateWebinarCoupon(
    webinarId: string,
    couponId: string,
    couponData: { code: string; title?: string; discount: number; expiresAt: string }
  ) {
    return this.request(`/api/webinars/${webinarId}/coupons/${couponId}`, {
      method: 'PUT',
      data: couponData,
    });
  }

  async deleteWebinarCoupon(webinarId: string, couponId: string) {
    return this.request(`/api/webinars/${webinarId}/coupons/${couponId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
