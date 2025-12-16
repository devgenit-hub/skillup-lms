import CourseCard from '@/components/course/CourseCard/CourseCard';
import { CourseCardProps } from '@/components/course/types/CourseCardProps/CourseCardProps';
import { BookOpen, Filter, LayoutGrid, List } from 'lucide-react';
import React from 'react';

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
    batchNo: 'ব্যাচ ২',
    rating: 4.5,
    category: 'গ্রাফিক ডিজাইন',
    title: 'গ্রাফিক ডিজাইন প্রফেশনাল কোর্স',
    studentsEnrolled: '৬০০',
    totalSessions: '২০',
  },
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
    batchNo: 'ব্যাচ ২',
    rating: 4.5,
    category: 'গ্রাফিক ডিজাইন',
    title: 'গ্রাফিক ডিজাইন প্রফেশনাল কোর্স',
    studentsEnrolled: '৬০০',
    totalSessions: '২০',
  },
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
    batchNo: 'ব্যাচ ২',
    rating: 4.5,
    category: 'গ্রাফিক ডিজাইন',
    title: 'গ্রাফিক ডিজাইন প্রফেশনাল কোর্স',
    studentsEnrolled: '৬০০',
    totalSessions: '২০',
  },
];

function Page() {
  return (
    <div className="h-full pb-4">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-3 lg:p-5 mb-3 lg:mb-4 transition-all duration-300">
        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-2.5 rounded-xl bg-gradient-to-br from-vibrant-blue to-indigo-600 shadow-lg">
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm lg:text-lg text-gray-800">My Courses</h1>
              <p className="text-xs text-gray-500 mt-0.5">{courseData.length} enrolled courses</p>
            </div>
          </div>

          {/* Filter and View Options */}
          <div className="flex items-center gap-2 justify-between lg:justify-end w-full lg:w-auto">
            <button className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-slate-100 hover:from-vibrant-blue hover:to-indigo-600 text-gray-700 hover:text-white transition-all duration-300 text-xs lg:text-sm font-medium group flex-1 lg:flex-none justify-center">
              <Filter className="w-3 h-3 lg:w-4 lg:h-4 group-hover:rotate-180 transition-transform duration-300" />
              <span>Filter</span>
            </button>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              <button className="p-1.5 lg:p-2 rounded-lg bg-white shadow-sm text-vibrant-blue">
                <LayoutGrid className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
              <button className="p-1.5 lg:p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <List className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3 lg:my-4"></div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-5">
        {courseData.map((course, idx) => (
          <div key={idx} className="animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
            <CourseCard {...course} courseId={idx} route="/student/class/" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
