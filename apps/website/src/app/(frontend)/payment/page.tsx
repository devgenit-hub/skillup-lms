'use client';
import React from 'react';
// import { useSearchParams } from "next/navigation"; // use later
import CourseDetailsCard from '@/components/payment/sections/CourseDetailsCard';
import { CourseDetailsProps } from '@/components/payment/types/CourseDetailsProps';
import CouponInput from '@/components/payment/sections/CouponInput';
import Contact from '@/components/payment/sections/Contact';
import PaymentMethod from '@/components/payment/sections/PaymentMethod';

const courseDetails: CourseDetailsProps = {
  imageUrl: '/Card/cover.png',
  batchNo: 'ব্যাচ ১',
  title: 'ডাটা সায়েন্স এবং মেশিন লার্নিং ক্যারিয়ার পাথ',
  rating: 4,
  totalReviews: 20,
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 pb-34 max-w-5xl">
      <h1 className="font-semibold text-center mt-16 mb-10">
        আপনি প্রিমিয়াম কোর্সে প্রবেশাধিকার থেকে মাত্র এক মুহূর্ত দূরে আছেন।
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="col-span-2 space-y-2 flex-2">
          <CourseDetailsCard {...courseDetails} />
          <CouponInput />
          <Contact />
        </div>
        <div className="flex-1">
          <PaymentMethod />
        </div>
      </div>
    </div>
  );
}
