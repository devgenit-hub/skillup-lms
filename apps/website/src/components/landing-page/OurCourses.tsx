'use client';
import React, { useEffect, useRef, useState } from 'react';
import CourseCard from '../course/CourseCard/CourseCard';
import { CourseCardProps } from '../course/types/CourseCardProps/CourseCardProps';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OurCourses() {
  const [selected, setSelected] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    setSelected('সব');
  }, []);

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
  }, []);
  return (
    <div className="container px-4 w-full max-w-7xl mx-auto my-20">
      <h3 className="text-center font-bold text-2xl sm:text-3xl md:text-4xl bg-linear-to-b from-[#C3C0D8] via-10% via-[#9B90DF] to-[#7361E5] text-transparent bg-clip-text my-8 py-8">
        আমাদের সেরা কোর্স
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
                ? 'bg-black hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer'
                : 'bg-gray-800/50 cursor-not-allowed opacity-30'
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Scrollable Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex-1 flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, idx) => (
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
                ? 'bg-linear-to-br from-purple-600 via-blue-600 to-cyan-600 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer'
                : 'bg-gray-800/50 cursor-not-allowed opacity-30'
            }`}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
        {courseData.map((course, idx) => (
          <CourseCard key={idx} {...course} courseId={idx + 1} route="/course/" />
        ))}
      </div>
      <div className="flex justify-center items-center">
        <a
          href="/allcourse"
          className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-white/5 text-sm flex items-center gap-2 mt-20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
        >
          সবগুলো কোর্স দেখুন <ArrowRight size={25} />
        </a>
      </div>
    </div>
  );
}

const categories = [
  'সব',
  'ফুল স্ট্যাক ওয়েব ডেভেলপমেন্ট',
  'গ্রাফিক্স ডিজাইন',
  'জাভাস্ক্রিপ্ট & রিয়েক্ট ডেভেলপমেন্ট',
  'ক্লাউড কম্পিউটিং',
  'অ্যাপ ডেভেলপমেন্ট (অ্যান্ড্রয়েড/আইওএস)',
];

const courseData: CourseCardProps[] = [
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ১',
    rating: 4,
    category: 'UI/UX ডিজাইন',
    title: 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস',
    studentsEnrolled: '৫২৪',
    totalSessions: '১৬',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ২',
    rating: 4.5,
    category: 'গ্রাফিক ডিজাইন',
    title: 'গ্রাফিক ডিজাইন প্রফেশনাল কোর্স',
    studentsEnrolled: '৬০০',
    totalSessions: '২০',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৩',
    rating: 3.8,
    category: 'ফ্রন্টএন্ড ডেভেলপমেন্ট',
    title: 'ওয়েব ডেভেলপমেন্ট ফান্ডামেন্টালস',
    studentsEnrolled: '৩৫০',
    totalSessions: '১৮',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৪',
    rating: 4.2,
    category: 'ব্যাকএন্ড ডেভেলপমেন্ট',
    title: 'ডাটাবেজ এবং সার্ভার সাইড টেকনোলজিজ',
    studentsEnrolled: '৪২০',
    totalSessions: '২২',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৫',
    rating: 5,
    category: 'পাইথন প্রোগ্রামিং',
    title: 'পাইথন প্রোগ্রামিং ফান্ডামেন্টালস',
    studentsEnrolled: '৭৫০',
    totalSessions: '২৫',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৬',
    rating: 4.6,
    category: 'মোবাইল অ্যাপ ডেভেলপমেন্ট',
    title: 'অ্যান্ড্রয়েড অ্যাপ ডেভেলপমেন্ট',
    studentsEnrolled: '৫৮০',
    totalSessions: '১৮',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৭',
    rating: 3.9,
    category: 'ডিজিটাল মার্কেটিং',
    title: 'ডিজিটাল মার্কেটিং মাস্টারক্লাস',
    studentsEnrolled: '৬৫০',
    totalSessions: '২২',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৮',
    rating: 4.7,
    category: 'ডাটা সায়েন্স',
    title: 'ডাটা সায়েন্স এবং মেশিন লার্নিং',
    studentsEnrolled: '৮৫০',
    totalSessions: '৩০',
  },
  {
    imageUrl: '/Card/cover.png',
    batchNo: 'ব্যাচ ৯',
    rating: 4.1,
    category: 'ক্লাউড কম্পিউটিং',
    title: 'এমাজন ওয়েব সার্ভিসেস (AWS) এর সাথে পরিচিতি',
    studentsEnrolled: '৪০০',
    totalSessions: '২৪',
  },
];
