'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, User } from 'lucide-react';

import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Student {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  phoneNumber: string | null;
}

interface Enrollment {
  id: string;
  enrollmentDate: string;
  progress: number;
  status: string;
  student: Student;
}

interface PaginatedApiResponse {
  data: Enrollment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Course {
  id: string;
  title: string;
}

export default function CourseEnrollmentsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchCourse = useCallback(async () => {
    try {
      const response = await apiClient.getCourseById(courseId);
      if (response.data) {
        const courseData = response.data as Course;
        setCourse({
          id: courseData.id,
          title: courseData.title,
        });
      }
    } catch {
      toast.error('Failed to load course details');
    }
  }, [courseId]);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCourseStudents(courseId, {
        page: pagination.page,
        limit: pagination.limit,
      });

      if (response.data) {
        const paginatedResponse = response.data as unknown as PaginatedApiResponse;
        setEnrollments(paginatedResponse.data);
        setPagination(paginatedResponse.pagination);
      }
    } catch {
      toast.error('Failed to load enrolled students');
    } finally {
      setLoading(false);
    }
  }, [courseId, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCourse();
    fetchEnrollments();
  }, [courseId, pagination.page, fetchCourse, fetchEnrollments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/superuser/courses')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          <PageHeader
            title={course ? `Enrolled Students - ${course.title}` : 'Enrolled Students'}
          />
          <p className="text-sm text-gray-600 mt-2">
            View and manage student enrollments for this course
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-dark-blue" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrollments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No students enrolled in this course yet
                        </td>
                      </tr>
                    ) : (
                      enrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="shrink-0 h-10 w-10 relative">
                                {enrollment.student.avatar ? (
                                  <Image
                                    src={enrollment.student.avatar}
                                    alt={enrollment.student.name || 'Student'}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {enrollment.student.name || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{enrollment.student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {enrollment.student.phoneNumber || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(enrollment.enrollmentDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-dark-blue h-2 rounded-full"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-900">{enrollment.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                enrollment.status
                              )}`}
                            >
                              {enrollment.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      variant="outline"
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {(pagination.page - 1) * pagination.limit + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        of <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <Button
                          variant="outline"
                          onClick={() =>
                            setPagination({ ...pagination, page: pagination.page - 1 })
                          }
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setPagination({ ...pagination, page: pagination.page + 1 })
                          }
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md"
                        >
                          Next
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Total Enrolled</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{pagination.total}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Active Students</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {enrollments.filter((e) => e.status.toLowerCase() === 'active').length}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">Avg. Progress</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    {enrollments.length > 0
                      ? Math.round(
                          enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
