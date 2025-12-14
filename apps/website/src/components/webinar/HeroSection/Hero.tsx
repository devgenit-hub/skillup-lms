'use client';
import React from 'react';
import Image from 'next/image';
import InfoCard from '../InfoCard/InfoCard';
import { InfoCardProps } from '@/components/webinar/types/InfoCardProps/InfoCardProps';

const bg = '/UI/All Course/Image.png';
const infoCardData: InfoCardProps[] = [
  {
    chipText: 'ওয়েবিনার',
    chipColor: '#0047b3',
    title: 'ডিজিটাল যুগে যোগাযোগের সহজ মাধ্যম',
    description:
      'উপস্থাপক, অংশগ্রহণকারী, বিষয়বস্তু (স্লাইড বা স্ক্রিন শেয়ার), আলাপচারিতার জন্য চ্যাট/প্রশ্নোত্তর এবং ভবিষ্যতের জন্য রেকর্ডিং।',
    bgColor: '#5604F41A',
    borderColor: '#FFFFFF1A',
    totalStudents: '৬,৫০০',
    topProfileImagesURLs: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&s',
      'https://media.licdn.com/dms/image/v2/C4D03AQEeEyYzNtDq7g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1524234561685?e=2147483647&v=beta&t=uHzeaBv3V2z6Tp6wvhzGABlTs9HR-SP-tEX1UbYNn4Q',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjDGMp734S91sDuUFqL51_xRTXS15iiRoHew&s',
    ],
  },
  {
    chipText: 'লাইভ',
    chipColor: '#539622',
    title: 'ডিজিটাল যুগে যোগাযোগের সহজ মাধ্যম',
    description:
      'উপস্থাপক, অংশগ্রহণকারী, বিষয়বস্তু (স্লাইড বা স্ক্রিন শেয়ার), আলাপচারিতার জন্য চ্যাট/প্রশ্নোত্তর এবং ভবিষ্যতের জন্য রেকর্ডিং।',
    bgColor: '#5396221A',
    borderColor: '#FFFFFF1A',
    totalStudents: '৬,৫০০',
    topProfileImagesURLs: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&s',
      'https://media.licdn.com/dms/image/v2/C4D03AQEeEyYzNtDq7g/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1524234561685?e=2147483647&v=beta&t=uHzeaBv3V2z6Tp6wvhzGABlTs9HR-SP-tEX1UbYNn4Q',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjDGMp734S91sDuUFqL51_xRTXS15iiRoHew&s',
    ],
  },
];

export default function Hero() {
  return (
    <div className="p-4">
      <div className="relative w-full min-h-[500px] overflow-hidden rounded-2xl">
        {/* Background with Blur */}
        <div className="absolute inset-0 w-full">
          <Image
            src={bg}
            alt="Course background"
            fill
            className="object-cover hue-rotate-75"
            priority
          />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 min-h-[500px] py-6 w-full backdrop-blur-2xl flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="font-bold text-4xl mb-5 text-white">সব ওয়েবিনার</h1>
            <div className="grid grid-cols-1 not-lg:mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-3 w-fit">
              {infoCardData.map((info, idx) => (
                <InfoCard key={idx} {...info} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
