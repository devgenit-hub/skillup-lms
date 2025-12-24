'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiClient } from '@/lib/api-client';
import {
  PlusCircle,
  Mail,
  BookOpen,
  Trash2,
  Users,
  Loader2,
  RefreshCw,
  Edit,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/providers/locale-provider';
import { toast } from 'sonner';
import { PaginationControls } from '@/components/utils';
import { useCourseStore } from '@/lib/zustand/course-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Teacher {
  id: string;
  supabaseId: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  qualification: string | null;
  experience: number | null;
  specialization: string | null;
  bio: string | null;
  profileImage: string | null;
  joiningDate: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  _count: { courses: number };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ManageTeachersPage() {
  const { t } = useLocale();
  const pageText = t('superuser');
  const tableText = t('table');

  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const { courses } = useCourseStore();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [stats, setStats] = useState({ activeTeachers: 0, totalAssignments: 0 });
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchTeachers = useCallback(async () => {
    try {
      setSearching(true);
      setError(null);

      const response = await apiClient.getTeachers({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        courseId: selectedCourseId && selectedCourseId !== 'all' ? selectedCourseId : undefined,
      });

      const teachers = response.data as Teacher[];
      setTeacherList(Array.isArray(teachers) ? teachers : []);

      // Update pagination if backend returns it
      const responseData = response as unknown as {
        pagination?: typeof pagination;
        stats?: typeof stats;
      };
      if (responseData.pagination) {
        setPagination(responseData.pagination);
      }

      // Use stats from backend response
      if (responseData.stats) {
        setStats(responseData.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, selectedCourseId]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Debounce search query and reset pagination
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Reset to page 1 when course filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [selectedCourseId]);

  async function handleDelete(id: string) {
    const t = teacherList.find((x) => x.id === id);
    if (!t) return;
    const ok = confirm(`${pageText['delete_confirm']} "${t.name}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await apiClient.deleteTeacher(id);
      setTeacherList((prev) => prev.filter((x) => x.id !== id));
      toast.success(`Teacher "${t.name}" deleted successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete teacher';
      toast.error(errorMessage);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-vibrant-blue mx-auto mb-2" />
          <p className="text-slate-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTeachers}
            className="bg-vibrant-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={pageText['teacher_management_title']}
        description={pageText['teacher_management_subtitle']}
        actionButton={
          <Link href="/superuser/teachers/create">
            <button className="bg-dark-blue hover:bg-vibrant-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <PlusCircle size={18} /> {pageText['create_new_teacher']}
            </button>
          </Link>
        }
      />

      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{pageText['total_teachers']}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{pagination.total}</p>
            </div>
            <div className="bg-vibrant-blue/10 p-3 rounded-lg">
              <Users size={24} className="text-vibrant-blue" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{pageText['active_teachers']}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeTeachers}</p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg">
              <BookOpen size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{pageText['total_assignments']}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalAssignments}</p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-lg">
              <BookOpen size={24} className="text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
            placeholder={pageText['search_teachers']}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent transition-all"
          />
        </div>
        <div className="w-full sm:w-96">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger fullWidth>
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['teacher_name']}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {tableText['email']}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['assigned_courses']}
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['actions']}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {teacherList.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-vibrant-blue rounded-full flex items-center justify-center text-white font-semibold">
                      {teacher.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{teacher.name}</div>
                      <div className="text-sm text-slate-500">ID: {teacher.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail size={16} className="mr-2 text-slate-400" />
                    {teacher.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-2 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      {teacher._count.courses}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">
                      {teacher._count.courses === 1 ? 'course' : 'courses'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/superuser/teachers/edit/${teacher.id}`}>
                      <button className="text-vibrant-blue bg-blue-100 hover:bg-blue-200 transition-colors flex items-center gap-1 rounded-full px-2.5 py-0.5">
                        <Edit size={16} />
                        <span className="font-medium capitalize">Manage</span>
                      </button>
                    </Link>
                    <button
                      className="text-red-500 bg-red-100 hover:text-red-700 transition-colors flex items-center gap-1 rounded-full px-2.5 py-0.5"
                      onClick={() => handleDelete(teacher.id)}
                    >
                      <Trash2 size={16} />
                      <span className="font-medium capitalize">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {teacherList.length === 0 &&
              !loading &&
              (debouncedSearch || (selectedCourseId && selectedCourseId !== 'all')) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    {selectedCourseId && selectedCourseId !== 'all'
                      ? `No teachers found for the selected course${debouncedSearch ? ` matching "${searchQuery}"` : ''}`
                      : `No teachers found matching "${searchQuery}"`}
                  </td>
                </tr>
              )}
          </tbody>
        </table>

        {teacherList.length === 0 &&
          !loading &&
          !debouncedSearch &&
          (!selectedCourseId || selectedCourseId === 'all') && (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 mb-4">No teachers found</p>
              <Link
                href="/superuser/teachers/create"
                className="inline-flex items-center gap-2 px-6 py-2 bg-vibrant-blue text-white rounded-lg hover:bg-dark-blue transition-colors font-medium"
              >
                <PlusCircle size={18} />
                Create Your First Teacher
              </Link>
            </div>
          )}

        {pagination.totalPages > 1 && (
          <div className="border-t p-4">
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
