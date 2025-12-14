'use client';
import WebinarSection from '@/components/webinar/FilteredCourse/WebinarSection';
import FilterSection from '@/components/webinar/FilteredCourse/FilterSection';
import Hero from '@/components/webinar/HeroSection/Hero';
import React, { useState } from 'react';
import { Funnel } from 'lucide-react';

export default function Page() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<string>('');
  return (
    <div>
      <Hero />
      <div className="flex flex-col md:flex-row mt-16 mb-20 gap-10 px-4 max-w-7xl mx-auto">
        {/* Desktop: always visible, Mobile: controlled by state */}
        <div className="hidden md:block">
          <FilterSection setFilter={setFilter} filter={filter} />
        </div>

        {/* Mobile filter popup */}
        <div className="md:hidden">
          <FilterSection
            setFilter={setFilter}
            filter={filter}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>

        {/* Course section with mobile filter button */}
        <div className="flex-1 w-full">
          {/* Mobile filter button - fixed at top */}
          <button
            onClick={() => setIsFilterOpen((p) => !p)}
            className="md:hidden sticky top-20 mb-4 flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity z-30 shadow-lg"
          >
            <Funnel size={16} />
            ফিল্টার
          </button>
          <WebinarSection />
        </div>
      </div>
    </div>
  );
}
