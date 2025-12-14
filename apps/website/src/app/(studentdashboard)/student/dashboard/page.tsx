'use client';
import React from 'react';
import NameCard from '@/components/student/NameCard';
import TableSection from '@/components/student/TableSection';

function Page() {
  return (
    <div className="space-y-3 lg:space-y-4 pb-4">
      <div className="animate-slide-up">
        <NameCard />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <TableSection />
      </div>
    </div>
  );
}

export default Page;
