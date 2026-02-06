'use client';
import React, { useState, useEffect } from 'react';
import CourseCard from '@/components/course/CourseCard/CourseCard';
import { BookOpen, BookText, CircleUser, LayoutGrid, List, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

interface EnrolledCourse {
  id: string;
  courseId: string;
  status: string;
  progress: number;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    introVideoLink: string | null;
    category: { id: string; title: string } | null;
    feeType: string;
    price: number | null;
    _count: { lessons: number; enrollments: number; curriculumModules: number };
    curriculumModules: Array<{
      _count: { classes: number };
    }>;
  };
}

function Page() {
  const [isGrid, setIsGrid] = useState<boolean>(false);
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await apiClient.getMyEnrollments();
        if (response.data?.enrollments) {
          setEnrollments(response.data.enrollments);
        }
      } catch (error) {
        console.error('Failed to fetch enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="h-full pb-4 flex items-center justify-center min-h-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-vibrant-blue mx-auto mb-2" />
          <p className="text-slate-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-xs text-gray-500 mt-0.5">{enrollments.length} enrolled courses</p>
            </div>
          </div>

          {/* Filter and View Options */}
          <div className="flex items-center gap-2 justify-between lg:justify-end w-full lg:w-auto">
            <Link
              href="/allcourse"
              className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-linear-to-r from-gray-100 to-slate-100 hover:from-vibrant-blue hover:to-indigo-600 text-gray-700 hover:text-white transition-all duration-300 text-xs lg:text-sm font-medium flex-1 lg:flex-none justify-center cursor-pointer"
            >
              <BookText className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>All Course</span>
            </Link>

            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl" hidden>
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

      {/* No Courses Message */}
      {enrollments.length === 0 ? (
        <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">No Courses Yet</h3>
          <p className="text-gray-500 mb-4">You haven&apos;t enrolled in any courses yet.</p>
          <a
            href="/allcourse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-vibrant-blue text-white rounded-xl hover:bg-dark-blue transition-colors"
          >
            Browse Courses
          </a>
        </div>
      ) : (
        <>
          {/* Course Grid */}
          {isGrid ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 gap-y-6 pb-10">
              {enrollments.map((enrollment, idx) => {
                const totalLessons =
                  enrollment.course.curriculumModules?.reduce(
                    (sum, module) => sum + (module._count?.classes || 0),
                    0
                  ) || 0;

                return (
                  <div
                    key={enrollment.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <CourseCard
                      imageUrl={'/Card/cover.png'}
                      category={enrollment.course.category?.title || 'General'}
                      title={enrollment.course.title}
                      studentsEnrolled={String(enrollment.course._count?.enrollments || 0)}
                      totalSessions={String(totalLessons)}
                      courseId={enrollment.courseId}
                      route="/student/class/"
                      price={enrollment.course.price}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 lg:space-y-4">
              {enrollments.map((enrollment, idx) => {
                const totalLessons =
                  enrollment.course.curriculumModules?.reduce(
                    (sum, module) => sum + (module._count?.classes || 0),
                    0
                  ) || 0;

                return (
                  <div
                    key={enrollment.id}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-3 lg:p-4 hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => (window.location.href = `/student/class/${enrollment.courseId}`)}
                  >
                    <div className="flex gap-3 lg:gap-4">
                      {/* Course Image */}
                      <div className="shrink-0">
                        <Image
                          src={'/Card/cover.png'}
                          width={192}
                          height={192}
                          alt={enrollment.course.title + ' image'}
                          className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs lg:text-sm font-medium text-vibrant-blue bg-blue-50 px-2 py-0.5 rounded-md">
                                {enrollment.course.category?.title || 'General'}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-md ${
                                  enrollment.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {enrollment.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm lg:text-base text-gray-800 line-clamp-2">
                              {enrollment.course.title}
                            </h3>
                          </div>

                          {/* Progress */}
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg shrink-0">
                            <span className="text-sm font-semibold text-vibrant-blue">
                              {enrollment.progress}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-vibrant-blue rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-600 mt-auto">
                          <div className="flex items-center gap-1">
                            <span className="flex items-center gap-1">
                              <CircleUser className="size-4" />
                              <span className="font-bold">
                                {enrollment.course._count?.enrollments || 0}
                              </span>{' '}
                              Students
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center">
                              <BookOpen className="size-4" />
                              <span className="font-bold ml-1">{totalLessons}</span> Lessons
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
