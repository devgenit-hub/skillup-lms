'use client';
import Hero from '@/components/webinar-details/sections/Hero';
import MainContent from '@/components/webinar-details/sections/MainContent';
import SideBar from '@/components/webinar-details/sections/SideBar';
import { AboutWebinar } from '@/components/webinar-details/types/AboutCourse';
import { HeroProps } from '@/components/webinar-details/types/HeroProps';
import { useParams } from 'next/navigation';
import React from 'react';

const aboutWebinarData: AboutWebinar = {
  about: `# UX ডিজাইন মাস্টারক্লাস: ব্যবহারকারী-কেন্দ্রিক ডিজাইন শিখুন

এই ওয়েবিনারে আপনি শিখবেন কীভাবে ব্যবহারকারীদের চাহিদা বুঝে কার্যকর ডিজাইন সলিউশন তৈরি করতে হয়। UI/UX ডিজাইনের মূল নীতি থেকে শুরু করে বাস্তব প্রয়োগ পর্যন্ত সম্পূর্ণ গাইডলাইন।

## এই ওয়েবিনারে কী কী থাকছে:

- ইউজার রিসার্চ ও পার্সোনা তৈরির কৌশল
- ওয়্যারফ্রেম এবং প্রোটোটাইপিং এর বেসিক থেকে অ্যাডভান্স
- ইন্টারেকশন ডিজাইনের মূল নীতি ও বেস্ট প্র্যাকটিস
- রিয়েল-ওয়ার্ল্ড কেস স্টাডি ও প্রজেক্ট রিভিউ

## বিশেষজ্ঞদের কাছ থেকে শিখুন:

ইন্ডাস্ট্রি এক্সপার্টদের সাথে লাইভ ইন্টারেকশনের সুযোগ। আপনার প্রশ্নের সরাসরি উত্তর পান এবং ক্যারিয়ার গাইডেন্স নিন।

**নোট:** এই ওয়েবিনার সম্পূর্ণ বাংলায় হবে এবং সকলের জন্য উন্মুক্ত।`,
  highlights: `- UX ডিজাইন ফান্ডামেন্টালস
- ইউজার রিসার্চ মেথডলজি
- ওয়্যারফ্রেমিং ও প্রোটোটাইপিং
- ডিজাইন সিস্টেম ও কম্পোনেন্ট লাইব্রেরি
- ইন্টারেক্টিভ Q&A সেশন
- ফ্রি সার্টিফিকেট অফ অ্যাটেনডেন্স
- ডিজাইন রিসোর্স প্যাক`,
};

const webinarData: HeroProps = {
  title: 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস',
  subtitle: 'UI/UX ডিজাইন মাস্টারক্লাস',
  sessionDate: '১৫ ডিসেম্বর, ২০২৫',
  sessionTime: 'রাত ৮:০০ PM',
  duration: '২ ঘণ্টা',
  totalRegistered: 254,
  isLive: false,
  isFree: true,
  price: '৳ ৪৯৯',
  deletedPrice: '৳ ৯৯৯',
  videoThumbnail: '/Card/cover.png',
  platform: 'Zoom',
};

export default function CoursePage() {
  const { webinar_id: _webinar_id } = useParams();

  return (
    <>
      <Hero {...webinarData} />
      <div
        id="details"
        className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 relative max-w-7xl"
      >
        <MainContent AboutWebinar={aboutWebinarData} />
        <SideBar AboutWebinar={aboutWebinarData} />
      </div>
    </>
  );
}
