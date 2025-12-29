'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import bg from '../../../../public/UI/Course details/Image.png';
import { HeroProps } from '../types/HeroProps';
import { FaRegCircleUser } from 'react-icons/fa6';
import { FiBook } from 'react-icons/fi';
import Rating from '@mui/material/Rating';
import BatchBadge from '@/components/shared/BatchBadge';
import Count from '@/components/Count';
import { useRouter, useParams } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import { useAuthStore } from '@/lib/zustand/auth-store';

export default function Hero({
  title,
  subtitle,
  totalStudents,
  totalModules,
  batch,
  rating,
  totalReviews,
  price,
  deletedPrice,
  videoThumbnail,
  bgImage = bg,
  coupons = [],
  couponCount: _couponCount = 0,
  introVideoLink,
}: HeroProps) {
  const { course_id } = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showCouponPopup, setShowCouponPopup] = useState(false);

  const handleEnrollClick = () => {
    if (!user) {
      // Store the payment page URL to redirect after login
      const paymentPath = `/payment?courseId=${course_id}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(paymentPath)}`);
      return;
    }
    router.push(`/payment?courseId=${course_id}`);
  };

  return (
    <div className="py-4">
      <div className="relative w-full min-h-125 overflow-hidden rounded-2xl">
        {/* Background with Blur */}
        <div className="absolute inset-0 w-full">
          <Image
            src={bgImage}
            alt="Course background"
            fill
            className="object-cover blur-md"
            priority
          />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 min-h-125 p-6 px-5 w-full max-w-7xl mx-auto flex items-center justify-center">
          <div className="container mx-auto flex flex-col gap-10 md:flex-row items-center justify-between w-full bg-linear-to-r py-6 md:py-8 rounded-2xl">
            {/* Left side - course info */}
            <div className="text-white space-y-4 w-full md:w-2/3">
              <div>
                <h1 className="text-4xl md:text-3xl font-bold leading-snug">{title}</h1>
                <p className="text-lg text-white/60">{subtitle}</p>
              </div>

              <div className="flex items-center gap-4 mt-2 flex-wrap text-lg">
                <span className="flex items-center gap-2">
                  <FaRegCircleUser />
                  <span>
                    <Count num={totalStudents.toString()} /> জন ভর্তি
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <FiBook />
                  <span>
                    <Count num={totalModules.toString()} /> টি মডিউল
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="shrink-0 max-w-37.5">
                  <BatchBadge className="w-22" batch={batch} />
                </div>

                <div className="flex items-center">
                  <Rating
                    name="half-rating-read"
                    defaultValue={rating}
                    precision={0.5}
                    readOnly
                    sx={{
                      '& .MuiRating-iconEmpty': {
                        color: 'lightgray',
                      },
                    }}
                  />{' '}
                  <span className="ml-1">
                    <span className="font-bold">
                      <Count num={rating.toString()} />
                    </span>{' '}
                    (<Count num={totalReviews.toString()} />)
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - course video card */}
            <div className="grid relative border-2 border-white/10 rounded-3xl">
              {/* Discount Badge */}
              {coupons && coupons.length > 0 && coupons[0]?.discount && (
                <div className="absolute -top-2 -left-2 z-20">
                  <div className="bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-1 animate-pulse">
                    <span className="text-sm">🔥</span>
                    <span>{coupons[0]?.discount} ছাড়</span>
                  </div>
                </div>
              )}
              <div className="relative z-10 p-2 rounded-2xl shadow-2xl w-full min-w-xs">
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                  <Image
                    src="/Card/card-bg.jpg"
                    alt="Blurred Background"
                    fill
                    className="object-cover opacity-5 blur-xl rounded-t-3xl w-full"
                  />
                </div>

                {/* Foreground Content */}
                <div className="relative z-10">
                  {/* Video Thumbnail */}
                  <div className="relative w-full max-w-80 mx-auto h-auto rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={videoThumbnail}
                      alt="Course video"
                      width={340}
                      height={360}
                      className="object-cover rounded-xl w-full h-auto aspect-video"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      {introVideoLink ? (
                        <a
                          href={introVideoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 aspect-square bg-white/40 backdrop-blur-lg text-white rounded-full flex items-center justify-center text-2xl font-bold hover:bg-white/60 transition"
                        >
                          ▶
                        </a>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  {/* Price and Enroll Section */}
                  <div className="text-center mt-6">
                    <div className="pb-10 flex justify-between items-center">
                      <p className="text-white text-xl font-bold">
                        {price}
                        {deletedPrice && (
                          <span className="line-through text-sm text-white/60 ml-2">
                            {deletedPrice}
                          </span>
                        )}
                      </p>
                      {coupons.length > 0 && (
                        <button
                          onClick={() => setShowCouponPopup(true)}
                          className="border border-white font-bold rounded-full px-6 py-1 hover:bg-white/5 text-sm text-white"
                        >
                          কুপন
                        </button>
                      )}
                    </div>

                    <button
                      className="mt-4 w-11/12 mx-auto bg-vibrant-blue hover:bg-dark-blue cursor-pointer text-white py-3 rounded-full text-lg font-semibold shadow-lg transition absolute -bottom-8 left-0 right-0"
                      onClick={handleEnrollClick}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Popup */}
      {showCouponPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowCouponPopup(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">উপলব্ধ কুপন</h3>
              <button
                onClick={() => setShowCouponPopup(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>
            <div className="space-y-3">
              {coupons.map((coupon, index) => (
                <div
                  key={index}
                  className="border border-vibrant-blue/30 dark:border-chart-1/30 rounded-lg p-4 bg-vibrant-blue/5 dark:bg-chart-1/5"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mono font-bold text-lg text-vibrant-blue dark:text-chart-1">
                        {coupon.code}
                      </p>
                      {coupon.title && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 font-medium">
                          {coupon.title}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {coupon.discount} ছাড়
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        alert('কুপন কোড কপি হয়েছে!');
                      }}
                      className="bg-vibrant-blue hover:bg-dark-blue text-white px-4 py-2 rounded-full text-sm font-bold transition"
                    >
                      কপি করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
