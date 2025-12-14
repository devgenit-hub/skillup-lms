'use client';
import React from 'react';
import Image from 'next/image';
import bg from '../../../../public/UI/Course details/Image.png';
import { HeroProps } from '../types/HeroProps';
import { FaRegCircleUser, FaRegClock } from 'react-icons/fa6';
import { MdDateRange, MdAccessTime } from 'react-icons/md';
import Count from '@/components/Count';
import { useRouter, useParams } from 'next/navigation';

export default function Hero({
  title,
  subtitle,
  sessionDate,
  sessionTime,
  duration,
  totalRegistered = 0,
  isLive = false,
  isFree,
  price,
  deletedPrice,
  videoThumbnail,
  bgImage = bg,
  platform = 'Zoom',
}: HeroProps) {
  const { webinar_id } = useParams();
  const router = useRouter();

  return (
    <div className="py-4">
      <div className="relative w-full min-h-[500px] overflow-hidden rounded-2xl">
        {/* Background with Blur */}
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

        {/* Foreground content */}
        <div className="relative z-10 min-h-[500px] p-6 w-full max-w-7xl mx-auto flex items-center justify-center">
          <div className="container mx-auto flex flex-col gap-10 md:flex-row items-center justify-between w-full bg-gradient-to-r py-6 md:py-8 rounded-2xl">
            {/* Left side - webinar info */}
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

            {/* Right side - webinar registration card */}
            <div className="grid relative border-2 border-white/10 rounded-3xl">
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
                  <div className="relative w-full h-auto rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={videoThumbnail}
                      alt="Webinar preview"
                      width={180}
                      height={180}
                      className="object-cover rounded-xl w-full h-auto aspect-video"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <button className="w-14 h-14 aspect-square bg-white/40 backdrop-blur-lg text-white rounded-full flex items-center justify-center text-2xl font-bold">
                        ▶
                      </button>
                    </div>
                  </div>

                  {/* Price and Register Section */}
                  <div className="text-center mt-6">
                    <div className="pb-10 flex justify-between items-center">
                      {isFree ? (
                        <p className="text-white text-2xl font-bold">ফ্রি</p>
                      ) : (
                        <p className="text-white text-xl font-bold">
                          {price}{' '}
                          {deletedPrice && (
                            <span className="line-through text-sm text-white/60">
                              {deletedPrice}
                            </span>
                          )}
                        </p>
                      )}
                      {!isFree && (
                        <button className="border border-white font-bold rounded-full px-6 py-1 hover:bg-white/5 text-sm text-white">
                          কুপন
                        </button>
                      )}
                    </div>

                    <button
                      className="mt-4 w-11/12 mx-auto bg-vibrant-blue hover:bg-dark-blue cursor-pointer text-white py-3 rounded-full text-lg font-semibold shadow-lg transition absolute -bottom-8 left-0 right-0"
                      onClick={() => {
                        router.push(
                          `/webinar/${webinar_id}/register${!isFree ? `?price=${price}` : ''}`
                        );
                      }}
                    >
                      {isLive ? 'এখনই যোগ দিন' : 'রেজিস্টার করুন'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
