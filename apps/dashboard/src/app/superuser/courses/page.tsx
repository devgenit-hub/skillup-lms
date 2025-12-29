'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiClient } from '@/lib/api-client';
import { useCourseStore } from '@/lib/zustand/course-store';
import { PlusCircle, Search, Loader2, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import CourseDetailsModal from '@/components/ui/CourseDetailsModal';
import { useLocale } from '@/providers/locale-provider';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { CourseProps } from '@/components/props/CourseProps';
import type { TeacherProps } from '@/components/props/TeacherProps';
import type { CourseInstructor } from '@/components/props/CourseProps';

interface Course {
  id: string;
  title: string;
  description: string | null;
  published: boolean;
  feeType: 'FREE' | 'PAID';
  price: number | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  courseTeachers: {
    teacher: {
      id: string;
      name: string;
      email: string;
      profileImage: string | null;
    };
  }[];
  curriculumModules?: {
    id: string;
    title: string;
    details: string | null;
    order: number;
    classes: { id: string; title: string; videoUrl: string | null; order: number }[];
    materials: { id: string; title: string; fileUrl: string | null; order: number }[];
  }[];
  _count: {
    enrollments: number;
    lessons: number;
  };
}

interface PaginatedApiResponse<T> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ManageCoursesPage() {
  const { t } = useLocale();
  const pageText = t('superuser');

  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<TeacherProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchCourses = useCallback(async () => {
    try {
      setSearching(true);

      const response = await apiClient.getCourses({
        page: 1,
        limit: 100, // Get all courses for now
      });

      if (response.data) {
        // Handle paginated response structure
        const paginatedData = response.data as PaginatedApiResponse<Course[]>;
        if (paginatedData.data && Array.isArray(paginatedData.data)) {
          console.log('Courses data:', paginatedData.data[0]); // Debug log
          setCourses(paginatedData.data);
        } else if (Array.isArray(response.data)) {
          // Fallback for non-paginated response
          console.log('Courses data (fallback):', response.data[0]); // Debug log
          setCourses(response.data as Course[]);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await apiClient.getTeachers();
      if (response.data) {
        setTeachers(Array.isArray(response.data) ? response.data : []);
      }
    } catch {
      // Teachers loading failed silently
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, [fetchCourses, fetchTeachers]);

  const handleCourseClick = (course: Course) => {
    // Convert Course to CourseProps format for CourseDetailsModal
    const metadata = course.metadata as {
      batchNo?: string;
      heroImage?: string;
      courseType?: 'live' | 'record';
      level?: 'beginner' | 'intermediate' | 'advanced';
      category?: 'webdev' | 'frontend' | 'backend' | 'mobiledev' | 'devOps' | 'ui-ux' | 'others';
      numClasses?: number;
      courseInstructors?: CourseInstructor[];
      aboutCourse?: { about?: string; details?: string };
      classRoutinePdf?: string;
      facebookGroupLink?: string;
    } | null;

    const courseForModal: CourseProps = {
      id: course.id,
      title: course.title,
      description: course.description || '',
      batchNo: metadata?.batchNo || '',
      heroImage: metadata?.heroImage || '',
      courseType: metadata?.courseType || 'live',
      level: metadata?.level || 'beginner',
      feeType: course.feeType === 'PAID' ? 'paid' : 'free',
      price: course.price || undefined,
      type: 'Course',
      teachers: course.courseTeachers.map((ct) => ct.teacher),
      assignedTeachers: course.courseTeachers.map((ct) => ct.teacher.id),
      category: course.category || null,
      numClasses: metadata?.numClasses || 0,
      courseInstructors: (metadata?.courseInstructors as CourseInstructor[]) || [],
      status: course.published ? 'Active' : 'Deactive',
      aboutCourse: {
        about: metadata?.aboutCourse?.about || '',
        details: metadata?.aboutCourse?.details || '',
      },
      curriculum:
        course.curriculumModules?.map((mod) => ({
          id: mod.id,
          title: mod.title,
          details: mod.details || '',
          classes:
            mod.classes?.map((cls) => ({
              id: cls.id,
              title: cls.title,
              videoUrl: cls.videoUrl || '',
            })) || [],
          materials:
            mod.materials?.map((mat) => ({
              id: mat.id,
              title: mat.title,
              fileUrl: mat.fileUrl || '',
            })) || [],
        })) || [],
      classRoutinePdf: metadata?.classRoutinePdf || '',
      facebookGroupLink: metadata?.facebookGroupLink || '',
      introVideoLink: course.introVideoLink || '',
      numOfStudents: course._count.enrollments,
    };

    setSelectedCourse(courseForModal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    // Refetch courses to update the list with any changes
    fetchCourses();
  };

  const handleTogglePublish = async (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setActionLoading(course.id);
      const newPublishedState = !course.published;
      await apiClient.updateCourse(course.id, {
        published: newPublishedState,
      });

      const { removeCourse, addCourse } = useCourseStore.getState();

      if (newPublishedState) {
        addCourse({
          id: course.id,
          title: course.title,
          published: true,
        });
      } else {
        removeCourse(course.id);
      }

      toast.success(`Course ${newPublishedState ? 'published' : 'unpublished'} successfully`);
      fetchCourses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();

    const enteredName = prompt(
      `⚠️ WARNING: This action cannot be undone!\n\nTo confirm deletion, please type the course name exactly:\n"${course.title}"`
    );

    // Check if user cancelled or entered wrong name
    if (enteredName === null) return; // User clicked cancel

    if (enteredName !== course.title) {
      toast.error('Course name does not match. Deletion cancelled.');
      return;
    }

    try {
      setActionLoading(course.id);
      await apiClient.deleteCourse(course.id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const searchLower = debouncedSearch.toLowerCase();
    const titleMatch = course.title.toLowerCase().includes(searchLower);
    const teacherMatch = course.courseTeachers.some(
      (ct) =>
        ct.teacher.name.toLowerCase().includes(searchLower) ||
        ct.teacher.email.toLowerCase().includes(searchLower)
    );
    return titleMatch || teacherMatch;
  });

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-vibrant-blue mx-auto mb-2" />
          <p className="text-slate-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={pageText['course_management']}
        description={pageText['course_management_desc']}
        actionButton={
          <Link href="/superuser/courses/create">
            <button className="bg-dark-blue hover:bg-vibrant-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer">
              <PlusCircle size={18} /> {pageText['create_new_course']}
            </button>
          </Link>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          {searching ? (
            <Loader2
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin"
              size={20}
            />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          )}
          <input
            type="text"
            placeholder={pageText['search_courses']}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['course_title']}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Teachers
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Enrollments
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pricing
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['course_status']}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredCourses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 cursor-pointer" onClick={() => handleCourseClick(course)}>
                  <div className="text-sm font-medium text-slate-900 hover:text-dark-blue transition-colors">
                    {course.title}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{course.category?.title || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {course.courseTeachers.length > 0 ? (
                      <span className="text-sm text-slate-600">
                        {course.courseTeachers.length}{' '}
                        {course.courseTeachers.length === 1 ? 'teacher' : 'teachers'}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">No teachers assigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/superuser/courses/${course.id}/enrollments`}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 transition-colors">
                      {course._count.enrollments} students
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {course.feeType === 'PAID' ? (
                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      💰 ৳{course.price || '0'}
                    </span>
                  ) : (
                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      🆓 Free
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${
                      course.published ? 'text-emerald-600' : 'text-orange-600'
                    }`}
                  >
                    {course.published ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => handleTogglePublish(course, e)}
                      disabled={actionLoading === course.id}
                      className={`cursor-pointer transition-all ${
                        actionLoading === course.id
                          ? 'bg-gray-400 cursor-not-allowed opacity-70'
                          : course.published
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                      title={
                        actionLoading === course.id
                          ? 'Updating...'
                          : course.published
                            ? 'Unpublish'
                            : 'Publish'
                      }
                    >
                      {actionLoading === course.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : course.published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                      className="cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => handleDelete(course, e)}
                      disabled={actionLoading === course.id}
                      className="cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  {searchQuery ? `No courses found matching "${searchQuery}"` : 'No courses found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          teachers={teachers}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
