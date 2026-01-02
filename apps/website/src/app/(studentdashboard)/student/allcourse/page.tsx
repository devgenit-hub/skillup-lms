'use client';

import CourseSection from '@/components/course/FilteredCourse/CourseSection';

export default function Page() {
  const filters: {
    category?: string;
    level?: string;
    feeType?: string;
    courseType?: string;
  } = {};

  return (
    <div className="flex flex-col md:flex-row gap-10 px-4 mx-auto">
      <div className="flex-1 w-full">
        <CourseSection filters={filters} />
      </div>
    </div>
  );
}
