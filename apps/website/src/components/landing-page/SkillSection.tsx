import React from 'react';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';

export default function SkillSection() {
  return (
    <div className="mt-20 py-8 container mx-auto flex items-center gap-7">
      <div className="space-y-5">
        <h3 className="flex flex-col text-xl font-bold bg-[#7361E5] dark:bg-gradient-to-b from-[#C3C0D8] via-[#9B90DF] to-[#7361E5] text-transparent bg-clip-text">
          <span>Skill UP দক্ষতা শিখুন</span>
          <span className="">ভবিষ্যত গড়ুন</span>
        </h3>
        <p className="text-base dark:text-white/70">
          এখানে শিক্ষার্থীরা সমস্ত গুরুত্বপূর্ণ স্কিল শেখার সুযোগ পায়, যা তাদের পেশাদার জীবনে
          সাহায্য করবে। আমাদের কোর্সগুলো প্রফেশনাল মেন্টরদের দ্বারা তৈরি, তাই শেখা হয় প্রায়োগিক
          এবং ফলপ্রসূ।
        </p>
        <Button className="rounded-full bg-vibrant-blue dark:text-white font-bold px-6 cursor-pointer">
          আরও জানুন
        </Button>
      </div>
      <div className="min-w-1/2 relative">
        <div className="min-h-[300px] bg-vibrant-blue/10 border border-vibrant-blue/20 rounded-3xl w-full"></div>
        <div className="absolute left-1/2 top-1/2 p-3 bg-white/10 rounded-full">
          <Play />
        </div>
      </div>
    </div>
  );
}
