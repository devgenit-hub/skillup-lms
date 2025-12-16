'use client';
import Image from 'next/image';
import React from 'react';
import { Play } from 'lucide-react';
import { Avatar, AvatarImage } from '../ui/avatar';
import Rating from '@mui/material/Rating';
import { useTheme } from 'next-themes';

const customersImgUrl = [
  '/test_images/avatar1.png',
  '/test_images/avatar2.png',
  '/test_images/avatar3.png',
];

const testimonial = {
  name: 'ইশরাত জাহান',
  position: 'ফ্রন্ট-এন্ড ওয়েব ডেভেলপমেন্ট',
  imgUrl: '/UI/LandingPage/services.png',
  comment:
    'এই কোর্সটি আমার জন্য এক অসাধারণ অভিজ্ঞতা হয়ে দাঁড়িয়েছে। শিক্ষকগণ অত্যন্ত সাহায্যপ্রবণ, ধৈর্যশীল এবং প্রতিটি বিষয় খুব সুন্দরভাবে বোঝান। কোর্সের প্রতিটি মডিউল বাস্তব জীবনের চাহিদার সঙ্গে পুরোপুরি মিল রয়েছে। আমি নিজের দক্ষতা এবং জ্ঞানে ব্যাপক উন্নতি লক্ষ্য করেছি। এই কোর্সটি আমাকে আত্মবিশ্বাসী হতে এবং নতুন সুযোগ গ্রহণে অনুপ্রাণিত করেছে।',
  rating: 4,
};

export default function Testimonial() {
  const { theme } = useTheme();

  return (
    <div className="container px-4 w-full max-w-7xl mx-auto my-20 py-8">
      {/* <div className="flex justify-center items-center">
        <h2 className="border border-vibrant-blue font-bold rounded-full px-6 py-2 bg-vibrant-blue/80 text-white text-xs gap-2 mt-10">
          আমাদের প্রশংসাপত্র
        </h2>
      </div> */}
      <h3 className="font-bold text-2xl text-center my-8 pb-8">
        আমাদের সেবা সম্পর্কে শিক্ষার্থীদের কথা
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="relative aspect-square">
          {/* Background decorative circle */}
          <div className="h-16 aspect-square rounded-full absolute -left-8 -top-8 z-0 bg-red-500/10"></div>

          {/* Image container */}
          <div className="relative w-full h-full">
            <Image
              src={testimonial.imgUrl}
              alt="Our services"
              fill
              className="object-cover rounded-3xl"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#337DFF4D] z-10 rounded-3xl"></div>

            {/* Play button */}
            <button
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-full bg-orange-800 flex items-center justify-center shadow-lg shadow-black"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </button>

            {/* Bottom badge with avatars */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white rounded-full px-6 py-3 shadow-lg">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <div className="text-sm font-bold text-black">বিশ্বস্ত গ্রাহকরা</div>
                <div className="flex -space-x-1.5">
                  {customersImgUrl.map((url, idx) => (
                    <Avatar key={idx} className="w-8 h-8 rounded-full">
                      <AvatarImage src={url} className="rounded-full" />
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-vibrant-blue/10 border border-vibrant-blue/20 w-full rounded-3xl flex justify-center items-center p-10">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <svg
                width="54"
                height="35"
                viewBox="0 0 54 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.2755 34.4368C6.79722 34.4368 6.30351 34.4369 5.73265 34.3597C5.04286 34.3042 4.38377 34.0507 3.8345 33.6297C3.28523 33.2088 2.86914 32.6382 2.63618 31.9866C2.40323 31.335 2.3633 30.6299 2.52121 29.9562C2.67911 29.2824 3.02813 28.6685 3.52636 28.1883C4.42497 27.3878 5.1316 26.3951 5.5937 25.2839C6.05581 24.1727 6.2615 22.9716 6.1955 21.77C3.76363 20.4991 1.86414 18.4034 0.837767 15.8586C-0.188606 13.3139 -0.274698 10.4867 0.594934 7.88428C1.14869 6.25207 2.08506 4.7761 3.32579 3.57971C4.8611 1.98147 6.82099 0.855035 8.97482 0.332976C11.1287 -0.189082 13.3868 -0.0850433 15.4835 0.63285C17.7549 1.39712 19.7711 2.77411 21.3093 4.61186C22.8476 6.4496 23.8482 8.67663 24.2006 11.0471C24.9601 15.3082 24.2931 19.7008 22.3029 23.5443V23.6677C17.5509 31.1351 13.0149 34.4368 7.2755 34.4368ZM6.70465 30.5643C10.1144 30.734 13.9561 29.5768 18.9241 21.6774C20.4837 18.6365 21.0246 15.1749 20.4669 11.8031C20.2363 10.1016 19.537 8.49768 18.4471 7.17078C17.3573 5.84387 15.9198 4.84624 14.2955 4.28942C12.8826 3.79234 11.3556 3.71731 9.90083 4.07347C8.44603 4.42964 7.12638 5.2016 6.10293 6.29514C5.29682 7.08616 4.69347 8.06 4.34408 9.13399C3.72914 10.9889 3.84106 13.008 4.65724 14.7835C5.47341 16.5591 6.93301 17.9587 8.74122 18.6997C9.03761 18.8184 9.2999 19.0088 9.50455 19.2538C9.70921 19.4989 9.84983 19.7909 9.91379 20.1037C10.2819 21.9767 10.1816 23.9117 9.62175 25.7367C9.06189 27.5616 8.05983 29.2199 6.70465 30.5643ZM36.1115 34.4368C35.6178 34.4368 35.1395 34.4369 34.5686 34.3597C33.8789 34.3042 33.2198 34.0507 32.6705 33.6297C32.1212 33.2088 31.7051 32.6382 31.4722 31.9866C31.2392 31.335 31.1993 30.6299 31.3572 29.9562C31.5151 29.2824 31.8641 28.6685 32.3624 28.1883C33.261 27.3878 33.9676 26.3951 34.4297 25.2839C34.8918 24.1727 35.0975 22.9716 35.0315 21.77C32.6018 20.4968 30.7043 18.4008 29.6782 15.8568C28.6522 13.3129 28.5645 10.4869 29.4309 7.88428C29.9761 6.25888 30.8957 4.78437 32.1155 3.57971C33.6546 1.97724 35.6198 0.848355 37.7794 0.326219C39.939 -0.195917 42.2029 -0.0895233 44.3041 0.63285C46.5773 1.39404 48.5953 2.77012 50.134 4.60843C51.6727 6.44674 52.6721 8.67539 53.0212 11.0471C53.7807 15.3082 53.1137 19.7008 51.1235 23.5443C51.1263 23.5854 51.1263 23.6266 51.1235 23.6677C46.3869 31.1351 41.8355 34.4368 36.1115 34.4368ZM35.5252 30.5643C38.9504 30.734 42.7766 29.5768 47.7601 21.6774C49.3325 18.6407 49.8741 15.1748 49.3029 11.8031C49.3101 11.752 49.3101 11.7 49.3029 11.6488C49.0626 9.9688 48.3573 8.3894 47.2668 7.08896C46.1763 5.78853 44.744 4.81886 43.1315 4.28942C41.7186 3.79234 40.1916 3.71731 38.7368 4.07347C37.282 4.42964 35.9624 5.2016 34.9389 6.29514C34.1432 7.08613 33.555 8.06123 33.2264 9.13399C32.6114 10.9889 32.7233 13.008 33.5395 14.7835C34.3557 16.5591 35.8153 17.9587 37.6235 18.6997C37.9163 18.8216 38.1748 19.0133 38.3765 19.258C38.5782 19.5027 38.7169 19.7931 38.7806 20.1037C39.1458 21.9805 39.0395 23.9186 38.4713 25.7443C37.9032 27.5699 36.8909 29.2261 35.5252 30.5643Z"
                  fill={theme == 'dark' ? 'white' : 'black'}
                />
              </svg>
              <Rating
                name="half-rating-read"
                defaultValue={testimonial.rating}
                precision={0.5}
                readOnly
                sx={{
                  '& .MuiRating-iconEmpty': {
                    color: 'gold',
                  },
                }}
              />
            </div>
            <p className="text-justify">{testimonial.comment}</p>
            <div className="flex gap-4">
              <div>
                <Image
                  src={testimonial.imgUrl}
                  alt={`User ${testimonial.name}`}
                  height={50}
                  width={50}
                  className="rounded-full aspect-square object-cover"
                />
              </div>
              <div>
                <h3 className="dark:text-white font-bold">{testimonial.name}</h3>
                <p className="dark:text-white/50">{testimonial.position}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
