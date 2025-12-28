'use client';
import React, { useState } from 'react';
import CourseCard from '@/components/course/CourseCard/CourseCard';
import { CourseCardProps } from '@/components/course/types/CourseCardProps/CourseCardProps';
import { BookOpen, CircleUser, Filter, LayoutGrid, List } from 'lucide-react';
import Image from 'next/image';
const starFill = '/CourseDetails/starfill.svg';
const starEmpty = '/CourseDetails/starnofill.svg';

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
  const [isGrid, setIsGrid] = useState<boolean>(true);

  return (
    <div className="h-full pb-4">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-3 lg:p-5 mb-3 lg:mb-4 transition-all duration-300">
        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 lg:p-2.5 rounded-xl bg-linear-to-br from-vibrant-blue to-indigo-600 shadow-lg">
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm lg:text-lg text-gray-800">My Courses</h1>
              <p className="text-xs text-gray-500 mt-0.5">{courseData.length} enrolled courses</p>
            </div>
          </div>

          {/* Filter and View Options */}
          <div className="flex items-center gap-2 justify-between lg:justify-end w-full lg:w-auto">
            <button className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-linear-to-r from-gray-100 to-slate-100 hover:from-vibrant-blue hover:to-indigo-600 text-gray-700 hover:text-white transition-all duration-300 text-xs lg:text-sm font-medium group flex-1 lg:flex-none justify-center">
              <Filter className="w-3 h-3 lg:w-4 lg:h-4 group-hover:rotate-180 transition-transform duration-300" />
              <span>Filter</span>
            </button>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setIsGrid(true)}
                className={`p-1.5 lg:p-2 rounded-lg transition-colors ${
                  isGrid
                    ? 'bg-white shadow-sm text-vibrant-blue'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <LayoutGrid className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
              <button
                onClick={() => setIsGrid(false)}
                className={`p-1.5 lg:p-2 rounded-lg transition-colors ${
                  !isGrid
                    ? 'bg-white shadow-sm text-vibrant-blue'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-3 lg:my-4"></div>

      {/* Course Grid */}
      {isGrid ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 gap-y-6 pb-10">
          {courseData.map((course, idx) => (
            <div
              key={idx}
              className="animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <CourseCard {...course} courseId={idx} route="/student/class/" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4">
          {courseData.map((course, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-3 lg:p-4 hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => (window.location.href = `/student/class/${idx}`)}
            >
              <div className="flex gap-3 lg:gap-4">
                {/* Course Image */}
                <div className="shrink-0">
                  <Image
                    src={course.imageUrl}
                    width={192}
                    height={192}
                    alt={course.title + ' image'}
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover"
                  />
                </div>

                {/* Course Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs lg:text-sm font-medium text-vibrant-blue bg-blue-50 px-2 py-0.5 rounded-md">
                          {course.batchNo}
                        </span>
                        <span className="text-xs lg:text-sm text-gray-500">{course.category}</span>
                      </div>
                      <h3 className="font-bold text-sm lg:text-base text-gray-800 line-clamp-2">
                        {course.title}
                      </h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                      <span className="flex gap-px">
                        {Array.from({ length: 5 }, (_, index) => {
                          if (index < (course.rating ?? 0)) {
                            return (
                              <Image
                                key={index}
                                src={starFill}
                                width={20}
                                height={20}
                                alt="course-batch-icon"
                              />
                            );
                          } else {
                            return (
                              <Image
                                key={index}
                                src={starEmpty}
                                width={20}
                                height={20}
                                alt="course-batch-icon"
                              />
                            );
                          }
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-600 mt-auto">
                    <div className="flex items-center gap-1">
                      <span className="flex items-center gap-1">
                        <CircleUser className="size-4" />
                        <span className="font-bold">{course.studentsEnrolled}</span> জন ভর্তি
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center">
                        <BookOpen className="size-4" />
                        <span className="font-bold">{course.totalSessions}</span>টি সেশন
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;
