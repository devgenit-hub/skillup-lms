'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import bg from '../../../../public/UI/Course details/Image.png';
import { HeroProps } from '../types/HeroProps';
import { FaRegCircleUser, FaRegClock } from 'react-icons/fa6';
import { MdDateRange, MdAccessTime } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import Count from '@/components/Count';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore, AuthUser } from '@/lib/zustand/auth-store';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

export default function Hero({
  title,
  subtitle,
  sessionDate,
  sessionTime,
  duration,
  totalRegistered = 0,
  isLive = false,
  isFree = false,
  price,
  deletedPrice,
  videoThumbnail,
  bgImage = bg,
  platform = 'Zoom',
  coupons = [],
  introVideoLink,
}: HeroProps) {
  const { webinar_id } = useParams();
  const router = useRouter();
  const user = useAuthStore((state: { user: AuthUser | null }) => state.user);
  const isEnrolled = useAuthStore(
    (state: { isEnrolled: (itemId: string, itemType: 'course' | 'webinar') => boolean }) =>
      state.isEnrolled
  );
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [registering, setRegistering] = useState(false);

  const webinarId = webinar_id as string;
  const userIsRegistered = isEnrolled(webinarId, 'webinar');

  const handleRegisterClick = async () => {
    const webinarId = webinar_id as string;

    if (!user) {
      const redirectPath = isFree
        ? `/enroll/free?type=webinar&id=${webinarId}`
        : `/payment?webinarId=${webinarId}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    // If already registered, redirect to student webinar page
    if (userIsRegistered) {
      router.push(`/student/webinar/${webinarId}`);
      return;
    }

    if (isFree) {
      setRegistering(true);
      try {
        const result = await apiClient.enrollFree({ itemType: 'webinar', itemId: webinarId });
        if (result.success) {
          router.push(
            `/payment/success?itemType=webinar&itemId=${webinarId}&message=Registered successfully`
          );
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      } finally {
        setRegistering(false);
      }
    } else {
      router.push(`/payment?webinarId=${webinarId}`);
    }
  };

  return (
    <div className="py-4">
      <div className="relative w-full min-h-125 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 w-full">
          <Image
            src={bgImage}
            alt="Webinar background"
            fill
            className="object-cover"
            style={{
              filter: 'hue-rotate(25deg) saturate(1.2) brightness(0.7) blur(8px)',
            }}
            priority
          />
        </div>

        <div className="relative z-10 min-h-125 p-6 px-4 w-full max-w-7xl mx-auto flex items-center justify-center">
          <div className="container mx-auto flex flex-col gap-10 md:flex-row items-center justify-between w-full bg-linear-to-r py-6 md:py-8 rounded-2xl">
            <div className="text-white space-y-4 w-full md:w-2/3">
              <div>
                {isLive && (
                  <span className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-2 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    লাইভ চলছে
                  </span>
                )}
                <h1 className="text-4xl md:text-3xl font-bold leading-snug">{title}</h1>
                <p className="text-lg text-white/60">{subtitle}</p>
              </div>

              <div className="flex items-center gap-6 mt-2 flex-wrap text-base">
                <span className="flex items-center gap-2">
                  <MdDateRange className="text-xl" />
                  <span>{sessionDate}</span>
                </span>
                <span className="flex items-center gap-2">
                  <MdAccessTime className="text-xl" />
                  <span>{sessionTime}</span>
                </span>
                <span className="flex items-center gap-2">
                  <FaRegClock />
                  <span>{duration}</span>
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <FaRegCircleUser />
                  <span>
                    <Count num={totalRegistered.toString()} /> জন নিবন্ধিত
                  </span>
                </span>

                <span className="bg-vibrant-blue/80 px-4 py-2 rounded-full font-semibold">
                  প্ল্যাটফর্ম: {platform}
                </span>
              </div>
            </div>

            <div className="grid relative border-2 border-white/10 rounded-3xl">
              {coupons && coupons.length > 0 && coupons[0]?.discount && (
                <div className="absolute -top-2 -left-2 z-20">
                  <div className="bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-1 animate-pulse">
                    <span className="text-sm">🔥</span>
                    <span>{coupons[0]?.discount} ছাড়</span>
                  </div>
                </div>
              )}
              <div className="relative z-10 p-2 rounded-2xl shadow-2xl w-full max-w-xs">
                <div className="absolute inset-0">
                  <Image
                    src="/Card/card-bg.jpg"
                    alt="Blurred Background"
                    fill
                    className="object-cover opacity-5 blur-xl rounded-t-3xl w-full"
                  />
                </div>

                <div className="relative z-10">
                  <div className="relative w-full h-auto rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={videoThumbnail}
                      alt="Webinar preview"
                      width={180}
                      height={180}
                      className="object-cover rounded-xl w-full h-auto aspect-video"
                    />
                    {introVideoLink && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <a
                          href={introVideoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 aspect-square bg-white/40 backdrop-blur-lg text-white rounded-full flex items-center justify-center text-2xl font-bold hover:bg-white/60 transition"
                        >
                          ▶
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-6">
                    <div className="pb-10 flex justify-between items-center">
                      {isFree ? (
                        <p className="text-green-400 text-xl font-bold">ফ্রি</p>
                      ) : (
                        <p className="text-white text-xl font-bold">
                          {price}
                          {deletedPrice && (
                            <span className="line-through text-sm text-white/60 ml-2">
                              {deletedPrice}
                            </span>
                          )}
                        </p>
                      )}
                      {!isFree && coupons.length > 0 && (
                        <button
                          onClick={() => setShowCouponPopup(true)}
                          className="border border-white font-bold rounded-full px-6 py-1 hover:bg-white/5 text-sm text-white"
                        >
                          কুপন
                        </button>
                      )}
                    </div>

                    <button
                      className="mt-4 w-11/12 mx-auto bg-vibrant-blue hover:bg-dark-blue cursor-pointer text-white py-3 rounded-full text-lg font-semibold shadow-lg transition absolute -bottom-8 left-0 right-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      onClick={handleRegisterClick}
                      disabled={registering}
                    >
                      {registering ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : userIsRegistered ? (
                        'Go to Webinar'
                      ) : isFree ? (
                        'ফ্রি রেজিস্টার করুন'
                      ) : isLive ? (
                        'এখনই যোগ দিন'
                      ) : (
                        'রেজিস্টার করুন'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
