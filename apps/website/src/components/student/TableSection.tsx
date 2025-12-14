import React from 'react';
import { CourseTable } from './CourseTable';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TableSection() {
  const router = useRouter();
  return (
    <div className="mt-5 bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border max-h-screen flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="px-5 lg:px-6 py-4 lg:py-5 border-b border-border bg-gradient-to-r from-card to-muted/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-vibrant-blue to-indigo-600 shadow-lg">
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm lg:text-base text-foreground">My Courses</h3>
              <p className="text-xs text-muted-foreground">Track your learning progress</p>
            </div>
          </div>
          <button
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-muted to-muted/80 hover:from-vibrant-blue hover:to-indigo-600 text-foreground hover:text-white transition-all duration-300 hover:shadow-lg text-xs lg:text-sm font-medium cursor-pointer"
            onClick={() => {
              router.push('/student/mycourse');
            }}
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Content area: take remaining space but not exceed viewport; enable scrolling when content overflows */}
      <div className="px-5 lg:px-6 py-4 flex-1 min-h-0 overflow-auto scrollbar-thin">
        <div className="h-full min-h-0">
          <CourseTable />
        </div>
      </div>
    </div>
  );
}
