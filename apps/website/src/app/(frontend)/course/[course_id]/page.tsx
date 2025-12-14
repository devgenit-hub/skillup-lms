'use client';
import Hero from '@/components/course-details/sections/Hero';
import MainContent from '@/components/course-details/sections/MainContent';
import SideBar from '@/components/course-details/sections/SideBar';
import { AboutCourse } from '@/components/course-details/types/AboutCourse';
import { HeroProps } from '@/components/course-details/types/HeroProps';
import { useParams } from 'next/navigation';
import React from 'react';

const aboutCourseData: AboutCourse = {
  about: `# ডেটা অ্যানালিটিক্স ও Power BI: ৬ মাসের কমপ্লিট ক্যারিয়ার পাথ

আপনার জীবনে, আপনার বিজনেসে, এমনকি আপনার স্মার্টওয়াচের হেলথ ট্র্যাকিংয়ে—সবখানে ডেটার ভূমিকা অপরিহার্য। ডেটার এই আকাশছোঁয়া চাহিদার কারণে ডেটা অ্যানালিস্টদের কদর বাড়ছে বিশ্বজুড়ে। এই বিশাল সুযোগকে কাজে লাগাতে ইন্টারেক্টিভ কেয়ারস নিয়ে এলো ৬ মাসের একটি বিশেষায়িত ডেটা অ্যানালিটিক্স ও Power BI ক্যারিয়ার পাথ।

## এই কোর্সের মূল আকর্ষণ:

- ইন্ডাস্ট্রি-বেইজড স্কিলসেট: Excel, Power BI, Google Sheets, Python, SQL, R এবং Database Fundamentals-এর মতো গুরুত্বপূর্ণ টুলস ও টেকনিকস শেখা।
- সার্টিফিকেশন গাইডলাইন: Microsoft Certified Power BI Data Analyst হওয়ার সম্পূর্ণ পথনির্দেশনা।
- বাস্তব কাজের অভিজ্ঞতা: প্রফেশনাল পোর্টফোলিও তৈরির জন্য ইন্ডাস্ট্রি স্ট্যান্ডার্ড প্রজেক্টে কাজ করা।

## আপনার জব প্রস্তুতি ও ফ্রিল্যান্সিং মডিউল:

কোর্সের শেষে থাকছে কম্পিটিটিভ মার্কেটে চাকরির জন্য প্রস্তুত করার বিশেষ মডিউল। রিমোটলি ডেটা অ্যানালিস্টের চাকরি পাওয়ার পুরো প্রক্রিয়া, পারসোনাল এক্সপেরিয়েন্স থেকে ধাপে ধাপে দেখানো হবে।

## ফ্রিল্যান্সিং স্পেশাল ক্লাস:

ProcoderBD**-এর ফাউন্ডার ও টপ-রেটেড ফ্রিল্যান্সার আলী হোসাইন ভাই-এর মেন্টরশিপে শিখুন:

- ক্লায়েন্টকে আকৃষ্ট করার মতো প্রফেশনাল প্রোফাইল তৈরি
- সফল ক্লায়েন্ট কমিউনিকেশন, প্রজেক্ট প্রাইসিং ও নেগোসিয়েশন
- লং-টার্ম ফ্রিল্যান্সিং-এ সফল হওয়ার কৌশল

ডেটা অ্যানালিটিক্স জগতে আপনার নতুন ক্যারিয়ার শুরু করতে, আজই আমাদের সাথে যোগ দিন!

**যোগাযোগ:** বিস্তারিত জানতে আমাদের হেল্পলাইন নম্বরে কল করুন: +88017XX-XXXXXX অথবা +88017XX-XXXXXX`,
  details: `- ৫০+ রিয়েলওয়ার্ল্ড প্রজেক্ট লেকচার
- ৩৮+ কনসেপচুয়াল লাইভ ক্লাস
- ৩৮+ কনসেপচুয়াল লাইভ ক্লাস
- ৮০+ প্র্যাকটিক্যাল লাইভ ক্লাস
- ডেইলি ৬টি সাপোর্ট সেশন
- ইন্ডাস্ট্রি স্ট্যান্ডার্ড প্রজেক্ট
- জব প্রিপারেশন সেশন`,
};

const courseData: HeroProps = {
  title: 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস',
  subtitle: 'UI/UX ডিজাইন',
  totalStudents: 254,
  totalClasses: 16,
  batch: 'ব্যাচ ১',
  rating: 4.0,
  totalReviews: 25,
  price: '৳ ৭,৯৯৯',
  deletedPrice: '৳ ৯,৯৯৯',
  videoThumbnail: '/Card/cover.png',
};

export default function Page() {
  const { course_id } = useParams();
  console.log(course_id);

  return (
    <>
      <Hero {...courseData} />
      <div
        id="details"
        className="w-full rounded-xl mx-auto flex flex-col lg:flex-row gap-6 relative max-w-7xl"
      >
        <MainContent AboutCourse={aboutCourseData} />
        <SideBar AboutCourse={aboutCourseData} />
      </div>
    </>
  );
}
