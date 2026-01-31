'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { FeeType } from '@repo/shared';
import Hero from '@/components/course-details/sections/Hero';
import MainContent from '@/components/course-details/sections/MainContent';
import SideBar from '@/components/course-details/sections/SideBar';
import { AboutCourse } from '@/components/course-details/types/AboutCourse';
import { HeroProps } from '@/components/course-details/types/HeroProps';
import { Loader2 } from 'lucide-react';

interface CourseDetails {
  id: string;
  title: string;
  description: string | null;
  batchNo: string;
  heroImage: string;
  courseType: 'live' | 'record' | 'hybrid';
  level: 'beginner' | 'intermediate' | 'advanced';
  feeType: 'FREE' | 'PAID';
  price: number | null;
  category: { id: string; title: string; slug: string } | null;
  numClasses: number;
  totalStudents: number;
  totalModules: number;
  aboutCourse: {
    about: string;
    details: string;
  };
  teachers: Array<{
    id: string;
    name: string;
    profileImage: string | null;
    specialization: string | null;
  }>;
  curriculum: Array<{
    id: string;
    title: string;
    details: string | null;
    order: number;
    classesCount: number;
    materialsCount: number;
  }>;
  classRoutinePdf: string | null;
  coupons: Array<{ code: string; discount: string; title: string }>;
  facebookGroupLink: string | null;
  introVideoLink: string | null;
  contactNumbers: string[];
}

export default function Page() {
  const params = useParams();
  const courseId = params.course_id as string;
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/public/courses/${courseId}`
        );

        if (!response.ok) {
          throw new Error('Course not found');
        }

        const data = await response.json();
        if (isMounted) {
          setCourse(data.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load course');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (courseId) {
      fetchCourse();
    }

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  // Memoize course data before conditional returns (Rules of Hooks)
  const aboutCourseData: AboutCourse | null = useMemo(() => {
    if (!course) return null;
    return {
      about: course.aboutCourse.about,
      details: course.aboutCourse.details,
    };
  }, [course]);

  const courseData: HeroProps | null = useMemo(() => {
    if (!course) return null;

    // Calculate discounted price if coupons exist
    const discountStr = course.coupons?.[0]?.discount;
    // Parse discount - remove any non-numeric characters except decimal point
    const maxDiscountValue = discountStr
      ? parseFloat(String(discountStr).replace(/[^\d.]/g, '')) || 0
      : 0;
    const originalPrice = course.price || 0;
    const discountedPrice = originalPrice - (originalPrice * maxDiscountValue) / 100;
    const hasCoupon = course.coupons && course.coupons.length > 0 && maxDiscountValue > 0;

    return {
      title: course.title,
      subtitle: course.category?.title || 'Course',
      totalStudents: course.totalStudents,
      totalModules: course.totalModules,
      batch: course.batchNo,
      rating: 5.0,
      totalReviews: 0,
      price:
        course.feeType === FeeType.PAID && course.price
          ? `৳${Math.round(hasCoupon ? discountedPrice : originalPrice).toLocaleString()}`
          : 'Free',
      deletedPrice:
        course.feeType === FeeType.PAID && hasCoupon && originalPrice
          ? `৳${originalPrice.toLocaleString()}`
          : undefined,
      videoThumbnail: course.heroImage || '/Card/cover.png',
      coupons: course.coupons || [],
      couponCount: course.coupons?.length || 0,
      introVideoLink: course.introVideoLink,
      isFree: course.feeType === FeeType.FREE,
    };
  }, [course]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-vibrant-blue mx-auto mb-4" />
          <p className="text-slate-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course || !courseData || !aboutCourseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Course Not Found</h1>
          <p className="text-slate-600">
            {error || 'The course you are looking for does not exist.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero {...courseData} />
      <div className="container px-4 w-full max-w-7xl mx-auto my-8">
        <div className="rounded-xl grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          <MainContent
            AboutCourse={aboutCourseData}
            teachers={course.teachers}
            curriculum={course.curriculum}
            classRoutinePdf={course.classRoutinePdf}
            contactNumbers={course.contactNumbers}
            facebookGroupLink={course.facebookGroupLink}
            introVideoLink={course.introVideoLink}
          />
          <SideBar AboutCourse={aboutCourseData} />
        </div>
      </div>
    </>
  );
}
