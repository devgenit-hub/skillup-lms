import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';

export default function SkillSection() {
  return (
    <div className="mt-20 py-8 container px-4 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-7">
      <div className="space-y-5">
        <h3 className="flex flex-col text-xl font-bold text-[#2300ff] dark:text-transparent dark:bg-clip-text dark:bg-linear-to-b dark:from-[#C3C0D8] dark:via-[#9B90DF] dark:to-[#7361E5]">
          <span>SkillShikho দক্ষতা শিখুন</span>
          <span className="">ভবিষ্যত গড়ুন</span>
        </h3>
        <p className="text-base dark:text-white/70">
          SkillShikho শুধুমাত্র একটি লার্নিং প্ল্যাটফর্ম নয়; এটি আপনার ক্যারিয়ার গড়ার একটি কমপ্লিট
          গেটওয়ে। আমাদের প্রতিটি ক্যারিয়ার পাথ এমনভাবে ডিজাইন করা হয়েছে যা আপনাকে কেবল দক্ষই করে
          তুলবে না, বরং জব মার্কেটে আপনার প্লেসমেন্টও নিশ্চিত করবে। লার্নিং জার্নির শুরু থেকে
          প্রফেশনাল ক্যারিয়ারে পদার্পণ পর্যন্ত প্রতিটি ধাপে আপনি পাবেন ইন্ডাস্ট্রি এক্সপার্টদের
          মেন্টরশিপ এবং তাৎক্ষণিক প্রবলেম সলভিং সাপোর্ট।
        </p>
        <Button
          asChild
          className="rounded-full bg-vibrant-blue dark:text-white font-bold px-6 cursor-pointer"
        >
          <Link href="/about">আরও জানুন</Link>
        </Button>
      </div>
      <div className="w-full lg:min-w-1/2 relative">
        <div className="min-h-75 bg-vibrant-blue/10 border border-vibrant-blue/20 rounded-3xl w-full flex flex-col items-center justify-center gap-2">
          <Play
            className="bg-white/20 rounded-full p-2 text-2xl"
            size={24}
            width={48}
            height={48}
          />
        </div>
      </div>
    </div>
  );
}
