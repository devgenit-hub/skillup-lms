'use client';
import React, { useEffect, useRef, useState } from 'react';
import CourseCard from '../course/CourseCard/CourseCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { useAppStore } from '@/lib/zustand/app-store';
import Link from 'next/link';

export default function OurCourses() {
  const { t } = useLocale();
  const pageText = t('landing');
  const studentText = t('student');
  // const courseText = t('course');
  const { courses, categories, coursesLoading } = useAppStore();
  const [selected, setSelected] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (categories.length > 0) {
      setSelected(pageText.courses_category_all || 'সব');
    }
  }, [categories, pageText]);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [categories]);

  const allCategories = [
    pageText.courses_category_all || 'সব',
    ...categories.map((cat) => cat.title),
  ];

  const filteredCourses =
    selected === (pageText.courses_category_all || 'সব')
      ? courses
      : courses.filter((course) => course.category?.title === selected);
  return (
    <div className="container px-4 w-full max-w-7xl mx-auto my-20">
      <h3 className="text-center font-bold text-2xl sm:text-3xl md:text-4xl text-[#2300ff] dark:text-transparent dark:bg-clip-text dark:bg-linear-to-b dark:from-[#C3C0D8] dark:via-10% dark:via-[#9B90DF] dark:to-[#7361E5] my-8 py-8">
        {pageText.courses_heading}
      </h3>

      {/* Categories Section with Enhanced UI */}
      <div className="mb-12 sm:mb-16">
        {/* Background Glow Effect */}

        <div className="relative flex items-center gap-3 p-4 sm:p-6 bg-white dark:bg-dark-blue/10 border border-dark-blue/30 rounded-2xl shadow-lg">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? 'bg-gray-300 hover:scale-110 hover:border hover:border-black hover:bg-white  cursor-pointer'
                : 'bg-gray-500/50 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-black" fill="#232322" />
          </button>

          {/* Scrollable Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex-1 flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allCategories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => setSelected(category)}
                className={`group relative overflow-hidden rounded-xl py-2.5 sm:py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 transform shrink-0 ${
                  selected === category
                    ? 'text-white shadow-lg shadow-purple-500/30'
                    : 'dark:text-gray-300 hover:text-white'
                }`}
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    selected === category
                      ? 'bg-black dark:bg-linear-to-br from-purple-600 via-blue-600 to-cyan-600 opacity-100'
                      : 'bg-black dark:bg-linear-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100'
                  }`}
                ></div>

                {/* Border Effect */}
                <div
                  className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    selected === category
                      ? 'ring-2 ring-purple-400/50 ring-offset-2 ring-offset-[#0A0A0F]'
                      : 'ring-1 ring-gray-700/50 group-hover:ring-purple-500/30'
                  }`}
                ></div>

                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Text */}
                <span className="relative z-10 whitespace-nowrap">{category}</span>
              </button>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? 'bg-gray-300 hover:scale-110 hover:border hover:border-black hover:bg-white  cursor-pointer'
                : 'bg-gray-500/50 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight className="w-5 h-5 text-black" fill="#232322" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
        {coursesLoading ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            {studentText.loading || 'Loading courses...'}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            {'No courses available'}
          </div>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              courseId={course.id}
              imageUrl={course.image || '/Card/cover.png'}
              batchNo={course.batchNo || 'Batch 1'}
              category={course.category?.title || ''}
              title={course.title}
              studentsEnrolled={course._count.enrollments.toString()}
              totalSessions={course._count.curriculumModules.toString()}
              route="/course/"
              feeType={course.feeType as 'FREE' | 'PAID'}
              price={course.price}
              maxDiscount={course.maxDiscount}
              courseType={course.courseType}
            />
          ))
        )}
      </div>
      <div className="flex justify-center items-center">
        <Link
          href="/allcourse"
          className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-white/5 text-sm flex items-center gap-2 mt-20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
        >
          {pageText.courses_viewAll} <ArrowRight size={25} />
        </Link>
      </div>
    </div>
  );
}
