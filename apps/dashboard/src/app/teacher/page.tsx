'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import Link from 'next/link';
import { FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { useTeacher } from '@/context/teacher-context';

export default function TeacherDashboard() {
  const { t } = useLocale();
  const pageText = t('teacher');
  const { profile, courses, loading } = useTeacher();

  return (
    <div>
      <PageHeader
        title={`${pageText['welcome']} ${profile?.name || ''}`}
        description={pageText['dashboard_subtitle']}
      />

      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {pageText['my_courses']} ({loading ? '...' : courses.length})
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
            <p className="text-slate-600">Loading courses...</p>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-600 mb-2">No courses assigned yet</p>
          <p className="text-sm text-slate-500">
            Contact your administrator to get course assignments
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const moduleCount = course._count.curriculumModules;
            const isUnpublished = !course.published;

            return (
              <div
                key={course.id}
                className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative ${
                  isUnpublished ? 'opacity-75' : ''
                }`}
              >
                <span
                  className={`absolute top-6 right-6 px-3 py-1 text-xs font-semibold rounded-full ${
                    course.published
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {course.published ? 'Published' : 'Unpublished'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 pr-20">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-6">
                  {course.feeType === 'FREE' ? 'Free' : `Paid - ${course.price} BDT`}{' '}
                  {pageText['course']}
                </p>

                <div className="flex items-center text-sm text-slate-600 mb-6">
                  <FileText size={16} className="mr-2" /> {moduleCount}{' '}
                  {moduleCount === 1 ? 'Module' : 'Modules'}
                </div>

                <Link href={`/teacher/course/${course.id}`}>
                  <button className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex justify-center items-center cursor-pointer">
                    {pageText['manage_materials']} <ArrowRight size={18} className="ml-2" />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
