'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiClient } from '@/lib/api-client';
import { PlusCircle, Mail, BookOpen, Trash2, Users, Loader2, RefreshCw, Edit } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/providers/locale-provider';
import { toast } from 'sonner';

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

export default function ManageTeachersPage() {
  const { t } = useLocale();
  const pageText = t('superuser');
  const tableText = t('table');

  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getTeachers();
      setTeacherList(response.data as Teacher[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-vibrant-blue mx-auto mb-2" />
          <p className="text-slate-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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

  const activeTeachers = teacherList.filter((t) => t._count.courses > 0).length;
  const totalAssignments = teacherList.reduce((acc, t) => acc + t._count.courses, 0);

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
              <p className="text-3xl font-bold text-slate-900 mt-2">{teacherList.length}</p>
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
              <p className="text-3xl font-bold text-slate-900 mt-2">{activeTeachers}</p>
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
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalAssignments}</p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-lg">
              <BookOpen size={24} className="text-amber-600" />
            </div>
          </div>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
