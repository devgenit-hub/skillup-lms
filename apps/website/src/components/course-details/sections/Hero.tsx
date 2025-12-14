'use client';
import React from 'react';
import Image from 'next/image';
import bg from '../../../../public/UI/Course details/Image.png';
import { HeroProps } from '../types/HeroProps';
import { FaRegCircleUser } from 'react-icons/fa6';
import { FiBook } from 'react-icons/fi';
import Rating from '@mui/material/Rating';
import BatchBadge from '@/components/shared/BatchBadge';
import Count from '@/components/Count';
import { useRouter, useParams } from 'next/navigation';

export default function Hero({
  title,
  subtitle,
  totalStudents,
  totalClasses,
  batch,
  rating,
  totalReviews,
  price,
  deletedPrice,
  videoThumbnail,
  bgImage = bg,
}: HeroProps) {
  const { course_id } = useParams();
  const router = useRouter();
  return (
    <div className="py-4">
      <div className="relative w-full min-h-[500px] overflow-hidden rounded-2xl">
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
        <div className="relative z-10 min-h-[500px] p-6 w-full max-w-7xl mx-auto flex items-center justify-center">
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
                    <Count num={totalClasses.toString()} /> টি ক্লাস
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <BatchBadge batch={batch} />

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
                      alt="Course video"
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

                  {/* Price and Enroll Section */}
                  <div className="text-center mt-6">
                    <div className="pb-10 flex justify-between items-center">
                      <p className="text-white text-xl font-bold">
                        {price}{' '}
                        <span className="line-through text-sm text-white/60">{deletedPrice}</span>
                      </p>
                      <button className="border border-white font-bold rounded-full px-6 py-1 hover:bg-white/5 text-sm text-white">
                        কুপন
                      </button>
                    </div>

                    <button
                      className="mt-4 w-11/12 mx-auto bg-vibrant-blue hover:bg-dark-blue cursor-pointer text-white py-3 rounded-full text-lg font-semibold shadow-lg transition absolute -bottom-8 left-0 right-0"
                      onClick={() => {
                        router.push(`/payment?courseId=${course_id}`);
                      }}
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
    </div>
  );
}
