'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';
import { Loader2, Users, UserCheck, UserX, Search } from 'lucide-react';

import { toast } from 'sonner';
import { PaginationControls, StatusBadge, SuspendModal } from '@/components/utils';
import { Button } from '@/components/ui/button';
import { useTeacherStore } from '@/lib/zustand/teacher-store';
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

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { courses } = useTeacherStore();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setSearching(true);

      const response = await apiClient.getStudents({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        status:
          selectedCourseId === 'suspended'
            ? 'suspended'
            : selectedCourseId === 'active'
              ? 'active'
              : 'all',
        courseId:
          selectedCourseId !== 'all' &&
          selectedCourseId !== 'active' &&
          selectedCourseId !== 'suspended'
            ? selectedCourseId
            : undefined,
      });

      if (response.success) {
        const data = response.data as { students: Student[]; total: number; totalPages: number };
        setStudents(data.students || []);
        setPagination((prev) => ({
          ...prev,
          total: data.total || 0,
          totalPages: data.totalPages || 1,
        }));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [selectedCourseId, debouncedSearch, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, pagination.page, pagination.limit]);

  useEffect(() => {
    // Calculate stats from pagination data or current students
    const totalStudents = pagination.total;
    const activeStudents = students.filter((s) => !s.suspended).length;
    const suspendedStudents = students.filter((s) => s.suspended).length;

    setStats({
      total: totalStudents,
      active: activeStudents,
      suspended: suspendedStudents,
    });
  }, [students, pagination.total]);

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
      await apiClient.suspendStudent(selectedStudent.id, reason);
      toast.success(`${selectedStudent.name || selectedStudent.email} suspended successfully`);
      fetchStudents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to suspend student');
      throw err;
    }
  };

  const handleUnsuspend = async (student: Student) => {
    try {
      setActionLoading(student.id);
      await apiClient.unsuspendStudent(student.id);
      toast.success(`${student.name || student.email} unsuspended successfully`);
      fetchStudents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to unsuspend student');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter students based on search query (client-side for teacher)
  const filteredStudents = students.filter((student) => {
    if (!debouncedSearch) return true;

    const searchLower = debouncedSearch.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.phone?.toLowerCase().includes(searchLower)
    );
  });

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

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50 text-slate-400" />
          <p className="text-slate-600 mb-2">No courses assigned</p>
          <p className="text-slate-500 text-sm">
            You need to be assigned to courses to view students
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Students" description="Manage students enrolled in your courses" />

      {/* Stats Cards */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Students</p>
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
              <p className="text-sm text-slate-500 font-medium">Active Students</p>
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
              <p className="text-sm text-slate-500 font-medium">Suspended Students</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.suspended}</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg">
              <UserX size={24} className="text-red-600" />
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
            placeholder="Search students by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent transition-all"
          />
        </div>
        <div className="w-full sm:w-96">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger fullWidth>
              <SelectValue placeholder="Filter Students" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="active">Active Students</SelectItem>
              <SelectItem value="suspended">Suspended Students</SelectItem>
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
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  Enrolled Courses
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
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
                            'Unsuspend'
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspend(student)}
                          className="cursor-pointer"
                        >
                          Suspend
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 &&
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

          {filteredStudents.length === 0 &&
            !loading &&
            !debouncedSearch &&
            (!selectedCourseId || selectedCourseId === 'all') && (
              <div className="py-12 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No students found in your courses</p>
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
          title="Suspend Student"
          description="Please provide a reason for suspending this student. They will not be able to access course content until unsuspended."
        />
      )}
    </div>
  );
}
