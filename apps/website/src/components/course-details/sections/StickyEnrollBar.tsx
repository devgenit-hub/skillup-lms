'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore, AuthUser } from '@/lib/zustand/auth-store';
import { apiClient } from '@/lib/api-client';
import { Loader2, Phone } from 'lucide-react';

interface StickyEnrollBarProps {
  price: string;
  deletedPrice?: string;
  contactNumber?: string;
  coupons?: Array<{ code: string; discount: string; title: string }>;
  isFree?: boolean;
}

export default function StickyEnrollBar({
  price,
  deletedPrice,
  contactNumber,
  coupons = [],
  isFree = false,
}: StickyEnrollBarProps) {
  const { course_id } = useParams();
  const router = useRouter();
  const user = useAuthStore((state: { user: AuthUser | null }) => state.user);
  const isEnrolled = useAuthStore(
    (state: { isEnrolled: (itemId: string, itemType: 'course' | 'webinar') => boolean }) =>
      state.isEnrolled
  );
  const [enrolling, setEnrolling] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const courseId = course_id as string;
  const userIsEnrolled = isEnrolled(courseId, 'course');

  const handleEnrollClick = async () => {
    if (!user) {
      const redirectPath = isFree
        ? `/enroll/free?type=course&id=${courseId}`
        : `/payment?courseId=${courseId}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    if (userIsEnrolled) {
      router.push(`/student/class/${courseId}`);
      return;
    }

    if (isFree) {
      setEnrolling(true);
      try {
        const result = await apiClient.enrollFree({ itemType: 'course', itemId: courseId });
        if (result.success) {
          router.push(
            `/payment/success?itemType=course&itemId=${courseId}&message=Enrolled successfully`
          );
        }
      } catch (error) {
        console.error('Enrollment error:', error);
        alert('এনরোলমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      } finally {
        setEnrolling(false);
      }
    } else {
      router.push(`/payment?courseId=${courseId}`);
    }
  };

  const hasCoupon = coupons.length > 0 && coupons[0]?.code;

  return (
    <div
      className={`sticky bottom-0 z-40 -mx-4 -mb-40 bg-gray-50 dark:bg-slate-900 border-t-2 border-gray-200 dark:border-slate-700 shadow-[0_-6px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_-6px_20px_rgba(0,0,0,0.5)] transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
    >
      <div className="container px-4 max-w-7xl mx-auto py-4">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-2.5 sm:hidden">
          {contactNumber && (
            <a
              href={`tel:${contactNumber}`}
              className="flex items-center gap-2 text-base text-gray-600 dark:text-gray-400"
            >
              <Phone size={18} className="text-vibrant-blue shrink-0" />
              <span className="font-semibold">কল করুন এই নাম্বারেঃ</span>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white">
                {contactNumber}
              </span>
            </a>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-wrap">
              {isFree ? (
                <span className="text-xl font-extrabold text-green-600 dark:text-green-400">
                  ফ্রি
                </span>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                    {price}
                  </span>
                  {deletedPrice && (
                    <span className="text-base line-through text-gray-400 dark:text-gray-500">
                      {deletedPrice}
                    </span>
                  )}
                </>
              )}
              {hasCoupon && (
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  প্রোমো আনলকড
                </span>
              )}
            </div>
            <button
              onClick={handleEnrollClick}
              disabled={enrolling}
              className="bg-purple-600 hover:bg-purple-700 hover:scale-105 hover:shadow-xl text-white px-6 py-2.5 rounded-full text-base font-bold shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {enrolling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : userIsEnrolled ? (
                'Go to Course'
              ) : isFree ? (
                'ফ্রি এনরোল'
              ) : (
                <>
                  Enroll Now
                  <span className="ml-0.5">&rsaquo;</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            {contactNumber && (
              <a
                href={`tel:${contactNumber}`}
                className="flex items-center gap-2.5 text-lg text-gray-600 dark:text-gray-400 hover:text-vibrant-blue dark:hover:text-blue-400 transition-colors"
              >
                <Phone size={22} className="text-vibrant-blue shrink-0" />
                <span className="font-semibold">কল করুন এই নাম্বারেঃ</span>
                <span className="font-extrabold text-xl text-gray-900 dark:text-white">
                  {contactNumber}
                </span>
              </a>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              {isFree ? (
                <span className="text-3xl font-extrabold text-green-600 dark:text-green-400">
                  ফ্রি
                </span>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {price}
                  </span>
                  {deletedPrice && (
                    <span className="text-lg line-through text-gray-400 dark:text-gray-500">
                      {deletedPrice}
                    </span>
                  )}
                </>
              )}
              {hasCoupon && (
                <>
                  <span className="text-base text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5">
                    <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    প্রোমো আনলকড
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold px-3 py-1 rounded flex items-center gap-1.5">
                    <span>&#10005;</span>
                    {coupons[0]?.code}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleEnrollClick}
            disabled={enrolling}
            className="bg-purple-600 hover:bg-purple-700 hover:scale-105 hover:shadow-xl text-white px-10 py-3.5 rounded-full text-xl font-bold shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          >
            {enrolling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : userIsEnrolled ? (
              'Go to Course'
            ) : isFree ? (
              'ফ্রি এনরোল করুন'
            ) : (
              <>
                Enroll Now
                <span className="text-2xl ml-1">&rsaquo;</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
