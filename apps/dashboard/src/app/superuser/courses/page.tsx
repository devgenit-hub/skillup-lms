'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { courses, teachers } from '@/lib/dummy-data';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import CourseDetailsModal from '@/components/ui/CourseDetailsModal';
import { CourseProps } from '@/components/props/CourseProps';
import { useLocale } from '@/providers/locale-provider';

export default function ManageCoursesPage() {
  const { t } = useLocale();
  const pageText = t('superuser');

  const [selectedCourse, setSelectedCourse] = useState<CourseProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCourseClick = (course: CourseProps) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title={pageText['course_management']}
        description={pageText['course_management_desc']}
        actionButton={
          <Link href="/superuser/courses/create">
            <button className="bg-dark-blue hover:bg-vibrant-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <PlusCircle size={18} /> {pageText['create_new_course']}
            </button>
          </Link>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={pageText['search_courses']}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-blue focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['course_title']}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['type']}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['fee_type']}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {pageText['course_status']}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredCourses.map((course) => (
              <tr
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="hover:bg-slate-50 transition-colors cursor-pointer group relative"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{course.title}</div>

                  {/* Tooltip on hover */}
                  <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute left-8 bottom-full mt-1 z-10 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg max-w-xs">
                    <div className="font-semibold mb-1">{pageText['click_to_view']}</div>
                    <div className="text-slate-300">{course.title}</div>
                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 transform rotate-45"></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                    {course.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      course.feeType === 'free'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {course.feeType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-medium ${
                      course.status === 'Active' ? 'text-emerald-600' : 'text-orange-600'
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No courses found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
