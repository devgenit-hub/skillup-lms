'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Loader2, Users, UserCheck, UserX, UserPlus, Search } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { toast } from 'sonner';
import {
  PaginationControls,
  StatusBadge,
  SuspendModal,
  DeleteConfirmModal,
} from '@/components/utils';
import { Button } from '@/components/ui/button';
import { useCourseStore } from '@/lib/zustand/course-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Student {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  suspended: boolean;
  suspendedAt: string | null;
  suspensionReason: string | null;
  createdAt: string;
  _count: {
    enrollments: number;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedApiResponse<T> {
  data: T;
  pagination: PaginationData;
}

export default function StudentsPage() {
  const { t } = useLocale();
  const pageText = t('student_management');

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { courses } = useCourseStore();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    newThisMonth: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setSearching(true);

      const response = await apiClient.getSuperuserStudents({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        courseId: selectedCourseId && selectedCourseId !== 'all' ? selectedCourseId : undefined,
      });

      if (response.data && Array.isArray(response.data)) {
        setStudents(response.data as Student[]);
        const paginatedResponse = response as unknown as PaginatedApiResponse<Student[]>;
        if (paginatedResponse.pagination) {
          setPagination(paginatedResponse.pagination);
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, selectedCourseId]);

  const fetchStats = async () => {
    try {
      const response = await apiClient.getDashboardStats();
      if (response.data) {
        const data = response.data as {
          students: {
            total: number;
            active: number;
            suspended: number;
            monthlyNew: number;
          };
        };
        setStats({
          total: data.students.total,
          active: data.students.active,
          suspended: data.students.suspended,
          newThisMonth: data.students.monthlyNew,
        });
      }
    } catch {
      // Stats loading failed silently
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchStats();
  }, []);

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

  const handleSuspend = async (student: Student) => {
    setSelectedStudent(student);
    setSuspendModalOpen(true);
  };

  const handleConfirmSuspend = async (reason: string) => {
    if (!selectedStudent) return;

    try {
      await apiClient.suspendStudentAdmin(selectedStudent.id, reason);
      toast.success(`${selectedStudent.name || selectedStudent.email} suspended successfully`);
      fetchStudents();
      fetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to suspend student');
      throw err;
    }
  };

  const handleUnsuspend = async (student: Student) => {
    try {
      setActionLoading(student.id);
      await apiClient.unsuspendStudentAdmin(student.id);
      toast.success(`${student.name || student.email} unsuspended successfully`);
      fetchStudents();
      fetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to unsuspend student');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (student: Student) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;

    try {
      setActionLoading(selectedStudent.id);
      await apiClient.deleteStudent(selectedStudent.id, selectedStudent.id);
      toast.success(`${selectedStudent.name || selectedStudent.email} deleted successfully`);
      fetchStudents();
      fetchStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete student');
      throw err;
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-vibrant-blue mx-auto mb-2" />
          <p className="text-slate-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={pageText.title}
        description={pageText.subtitle}
        actionButton={
          <Link href="/superuser/students/create">
            <button className="bg-dark-blue hover:bg-vibrant-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer">
              <PlusCircle size={18} />
              {pageText.create_student}
            </button>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{pageText.total_students}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-vibrant-blue/10 p-3 rounded-lg">
              <Users size={24} className="text-vibrant-blue" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{pageText.active_students}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.active}</p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg">
              <UserCheck size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{pageText.suspended_students}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.suspended}</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg">
              <UserX size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{pageText.new_this_month}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.newThisMonth}</p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-lg">
              <UserPlus size={24} className="text-purple-600" />
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
            placeholder={pageText.search_placeholder}
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

      {/* Students Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText.student_name}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText.student_email}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText.enrolled_courses}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText.status}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {pageText.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {student.avatarUrl ? (
                        <Image
                          src={student.avatarUrl}
                          alt={student.name || 'Student'}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          unoptimized
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-10 h-10 bg-vibrant-blue rounded-full flex items-center justify-center text-white font-semibold ${student.avatarUrl ? 'hidden' : ''}`}
                      >
                        {(student.name || student.email)
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{student.name || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{student.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{student.phone || '----'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {student._count.enrollments} courses
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={student.suspended ? 'suspended' : 'active'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {student.suspended ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnsuspend(student)}
                          disabled={actionLoading === student.id}
                          className="cursor-pointer"
                        >
                          {actionLoading === student.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            pageText.unsuspend
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspend(student)}
                          className="cursor-pointer"
                        >
                          {pageText.suspend}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(student)}
                        disabled={actionLoading === student.id}
                        className="cursor-pointer"
                      >
                        {pageText.delete}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 &&
                !loading &&
                (debouncedSearch || (selectedCourseId && selectedCourseId !== 'all')) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      {selectedCourseId && selectedCourseId !== 'all'
                        ? `No students found for the selected course${debouncedSearch ? ` matching "${searchQuery}"` : ''}`
                        : `No students found matching "${searchQuery}"`}
                    </td>
                  </tr>
                )}
            </tbody>
          </table>

          {students.length === 0 &&
            !loading &&
            !debouncedSearch &&
            (!selectedCourseId || selectedCourseId === 'all') && (
              <div className="py-12 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No students found</p>
              </div>
            )}
        </div>

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

      {/* Suspend Modal */}
      {selectedStudent && (
        <SuspendModal
          open={suspendModalOpen}
          onClose={() => {
            setSuspendModalOpen(false);
            setSelectedStudent(null);
          }}
          onConfirm={handleConfirmSuspend}
          studentName={selectedStudent.name || selectedStudent.email}
          title={pageText.suspend_modal_title}
          description={pageText.suspend_modal_desc}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedStudent && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedStudent(null);
          }}
          onConfirm={handleConfirmDelete}
          itemId={selectedStudent.id}
          itemName={selectedStudent.name || selectedStudent.email}
          itemType="Student"
          warningText={pageText.delete_warning}
          confirmLabel={pageText.delete_confirm_label}
        />
      )}
    </div>
  );
}
