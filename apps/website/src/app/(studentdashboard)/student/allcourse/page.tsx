'use client';

import CourseSection from '@/components/course/FilteredCourse/CourseSection';
import FilterSection from '@/components/course/FilteredCourse/FilterSection';
import { Funnel } from 'lucide-react';
import React, { useState } from 'react';

export default function Page() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    category?: string;
    level?: string;
    feeType?: string;
    courseType?: string;
  }>({});

  return (
    <div className="flex flex-col md:flex-row gap-10 px-4 mx-auto">
      <div className="hidden md:block">
        <FilterSection onFilterChange={setFilters} currentFilters={filters} />
      </div>

      <div className="md:hidden">
        <FilterSection
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onFilterChange={setFilters}
          currentFilters={filters}
        />
      </div>

      <div className="flex-1 w-full">
        <button
          onClick={() => setIsFilterOpen((p) => !p)}
          className="md:hidden sticky top-20 mb-4 flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity z-30 shadow-lg"
        >
          <Funnel size={16} />
          ফিল্টার
        </button>
        <CourseSection filters={filters} />
      </div>
    </div>
  );
}
