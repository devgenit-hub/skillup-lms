'use client';

import { usePathname } from 'next/navigation';
import CourseCard from '../CourseCard/CourseCard';
import PaginationSection from './PaginationSection';
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { CourseCard as CourseCardType } from '@/lib/zustand/app-store';

interface CourseSectionProps {
  filters?: {
    category?: string;
    level?: string;
    feeType?: string;
    courseType?: string;
    search?: string;
  };
}

export default function CourseSection({ filters }: CourseSectionProps) {
  const pn = usePathname();
  // const { courses: initialCourses, coursesLoading: initialLoading } = useAppStore();
  const [displayCourses, setDisplayCourses] = useState<CourseCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasFilters, setHasFilters] = useState(false);
  const pageSize = 9;

  // Check if filters are applied
  useEffect(() => {
    const filtersApplied =
      Boolean(filters?.category) ||
      Boolean(filters?.level) ||
      Boolean(filters?.feeType) ||
      Boolean(filters?.courseType) ||
      Boolean(filters?.search);
    setHasFilters(filtersApplied);
  }, [filters]);

  // Fetch courses when filters or page changes
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.getPublicCourses({
        page: currentPage,
        limit: pageSize,
        search: filters?.search,
        category: filters?.category,
        level: filters?.level,
        courseType: filters?.courseType,
        feeType: filters?.feeType,
        published: true,
      });

      if (response.status === 'success' && response.data) {
        const items = response.data as CourseCardType[];
        const pagination = response.pagination;
        setDisplayCourses(items);
        setTotalPages(pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setDisplayCourses([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, pageSize]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (hasFilters) {
      setCurrentPage(1);
    }
  }, [
    filters?.category,
    filters?.level,
    filters?.courseType,
    filters?.feeType,
    filters?.search,
    hasFilters,
  ]);

  const isLoading = loading;

  return (
    <section className="w-full flex flex-col items-center gap-12">
      {/* Course Grid */}
      <div
        className={`${
          pn !== '/student/allcourse' ? 'lg:grid-cols-3' : ''
        } grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10`}
      >
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-400">Loading courses...</div>
        ) : displayCourses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">No courses found</div>
        ) : (
          displayCourses.map((course) => (
            <CourseCard
              key={course.id}
              imageUrl={course.image || '/Card/cover.png'}
              batchNo={course.batchNo || 'Batch 1'}
              feeType={course.feeType as 'FREE' | 'PAID'}
              price={course.price}
              category={course.category?.title || ''}
              title={course.title}
              studentsEnrolled={course._count.enrollments.toString()}
              totalSessions={course._count.curriculumModules.toString()}
              courseId={course.id}
              route="/course/"
              maxDiscount={course.maxDiscount}
              courseType={course.courseType}
            />
          ))
        )}
      </div>

      {/* Pagination :  */}
      {!isLoading && displayCourses.length > 0 && totalPages > 1 && (
        <div className="mt-8">
          <PaginationSection
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </section>
  );
}
