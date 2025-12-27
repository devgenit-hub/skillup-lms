'use client';

import CourseSection from '@/components/course/FilteredCourse/CourseSection';
import FilterSection from '@/components/course/FilteredCourse/FilterSection';
import Hero from '@/components/course/HeroSection/Hero';
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
    <div>
      <Hero />
      <div className="flex flex-col md:flex-row mt-16 mb-20 gap-10 px-4 max-w-7xl mx-auto">
        {/* Desktop: always visible, Mobile: controlled by state */}
        <div className="hidden md:block">
          <FilterSection onFilterChange={setFilters} currentFilters={filters} />
        </div>

        {/* Mobile filter popup */}
        <div className="md:hidden">
          <FilterSection
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFilterChange={setFilters}
            currentFilters={filters}
          />
        </div>

        {/* Course section with mobile filter button */}
        <div className="flex-1 w-full">
          {/* Mobile filter button - sticky at top */}
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
    </div>
  );
}
