'use client';
import React from 'react';
import Image from 'next/image';
import InfoCard from '../InfoCard/InfoCard';
import { InfoCardProps } from '@/components/webinar/types/InfoCardProps/InfoCardProps';

const bg = '/UI/All Course/Image.png';
const infoCardData: InfoCardProps[] = [
  {
    chipText: 'অনলাইন ওয়েবিনার',
    chipColor: '#0047b3',
    title: 'Easy tech-talk',
    description:
      'Featuring a host, attendees, shared content, live engagement, and on-demand access.',
    bgColor: '#5604F41A',
    borderColor: '#FFFFFF1A',
  },
  {
    chipText: 'অফলাইন সেমিনার',
    chipColor: '#539622',
    title: 'In-Person Seminar',
    description:
      'Experience face-to-face learning with expert-led sessions, interactive workshops, and networking opportunities.',
    bgColor: '#5396221A',
    borderColor: '#FFFFFF1A',
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
            <h1 className="font-bold text-4xl mb-5 text-white">সকল ওয়েবিনার</h1>
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
