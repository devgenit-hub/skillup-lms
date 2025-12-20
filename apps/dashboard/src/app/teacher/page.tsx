'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { courses, currentTeacherId } from '@/lib/dummy-data';
import Link from 'next/link';
import { FileVideo, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { apiClient } from '@/lib/api-client';
import { useState, useEffect } from 'react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  specialization: string | null;
}

export default function TeacherDashboard() {
  const { t } = useLocale();
  const pageText = t('teacher');
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await apiClient.getCurrentTeacher();
        setTeacher(response.data as Teacher);
      } catch (error) {
        console.error('Failed to fetch teacher:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  const myCourses = courses.filter((course) =>
    course.assignedTeachers?.includes(currentTeacherId || '')
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`${pageText['welcome']} ${teacher?.name || 'John Smith'}`}
        description={pageText['dashboard_subtitle']}
      />

      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {pageText['my_courses']} ({myCourses.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <span className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
              {course.status}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
            <p className="text-sm text-slate-500 mb-6">
              {course.type} {pageText['course']}
            </p>

            <div className="flex space-x-4 text-sm text-slate-600 mb-6">
              <div className="flex items-center">
                <FileVideo size={16} className="mr-2" /> 12 {pageText['videos']}
              </div>
              <div className="flex items-center">
                <FileText size={16} className="mr-2" /> 4 {pageText['pdfs']}
              </div>
            </div>

            <Link href={`/teacher/course/${course.id}`}>
              <button className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex justify-center items-center">
                {pageText['manage_materials']} <ArrowRight size={18} className="ml-2" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
