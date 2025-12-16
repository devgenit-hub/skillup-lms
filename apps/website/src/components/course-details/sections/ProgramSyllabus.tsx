import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IoBookOutline } from 'react-icons/io5';
import { SyllabusItemProps } from '../types/SyllabusItemProps';

const syllabusData: SyllabusItemProps[] = [
  {
    id: 'item-1',
    title: 'প্রোগ্রামটি কি সহজলভ্য?',
    description:
      'হ্যাঁ। এটি WAI-ARIA ডিজাইন প্যাটার্ন অনুসরণ করে, যা নিশ্চিত করে যে প্রোগ্রামটি সকল ব্যবহারকারীর জন্য সহজলভ্য ও ব্যবহারবান্ধব। এছাড়াও এটি বিভিন্ন অ্যাক্সেসিবিলিটি টুলসের সাথে সামঞ্জস্যপূর্ণ।',
  },
  {
    id: 'item-2',
    title: 'কোর্সের মেয়াদ কত?',
    description:
      'কোর্সটি মোট ৬ মাসব্যাপী চলবে। এই সময়কালে শিক্ষার্থীরা ধাপে ধাপে বিভিন্ন বিষয়ের ওপর দক্ষতা অর্জন করবে এবং প্রয়োগমূলক প্রকল্পের মাধ্যমে নিজেকে পরীক্ষা করার সুযোগ পাবে।',
  },
  {
    id: 'item-3',
    title: 'কোর্সে কি কি টপিক থাকবে?',
    description:
      'এই কোর্সে জাভাস্ক্রিপ্ট, রিয়্যাক্ট, এবং টাইপস্ক্রিপ্ট শেখানো হবে। পাশাপাশি আধুনিক ওয়েব ডেভেলপমেন্টের জন্য প্রয়োজনীয় টুলস ও লাইব্রেরির ব্যবহার যেমন Redux, Next.js, এবং Tailwind CSS-এর ওপরও দৃষ্টি দেয়া হবে।',
  },
  {
    id: 'item-4',
    title: 'কোর্স সম্পন্ন করার পরে কী ধরনের দক্ষতা অর্জন করব?',
    description:
      'কোর্স শেষ করার পরে, আপনি দক্ষ ফ্রন্ট-এন্ড ডেভেলপার হিসেবে কাজ করার জন্য প্রয়োজনীয় জ্ঞানে সমৃদ্ধ হবেন। আপনি কাস্টম ওয়েব অ্যাপ্লিকেশন ডিজাইন ও ডেভেলপমেন্ট, রেসপনসিভ ডিজাইন, এবং অ্যাডভান্সড জাভাস্ক্রিপ্ট কনসেপ্টে দক্ষতা অর্জন করবেন।',
  },
  {
    id: 'item-5',
    title: 'কোর্সের সাপোর্ট সিস্টেম কেমন?',
    description:
      'কোর্সের শিক্ষার্থীদের জন্য রয়েছে এক্সক্লুসিভ কমিউনিটি ফোরাম এবং লাইভ সেশন। এছাড়াও সপ্তাহে একবার মেন্টরদের সঙ্গে এক-অন-এক গাইডেন্স সেশন থাকে যা শিক্ষার্থীদের যেকোনো সমস্যা দ্রুত সমাধানে সাহায্য করে।',
  },
  {
    id: 'item-6',
    title: 'কোর্সের মূল্য এবং ছাড় সম্পর্কে জানাবেন?',
    description:
      'কোর্সের মূল্য প্রতিটি শিক্ষার্থীকে সুবিধাজনক ও কার্যকর করার জন্য নির্ধারিত। মাঝে মাঝে বিশেষ অফার ও কুপন দিয়ে মূল্য হ্রাস করা হয়। বিস্তারিত জানতে কোর্সের অফিশিয়াল ওয়েবসাইট ভিজিট করুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।',
  },
];

export default function ProgramSyllabus() {
  const [curId, setCurId] = useState<string | null>(null);
  return (
    <div id="curriculum" className="container mx-auto mt-20 scroll-m-20">
      <h1 className="font-bold text-2xl mb-6">প্রোগ্রামের পাঠ্যসূচি</h1>
      {/* Accordion section */}
      <Accordion type="single" collapsible className="flex flex-col gap-4">
        {syllabusData.map(({ id, title, description }) => (
          <AccordionItem
            key={id}
            value={id}
            className={`shadow-md ${
              id == curId ? 'bg-vibrant-blue text-white' : 'bg-vibrant-blue/10 '
            } border-vibrant-blue/20 border dark:border-chart-1/20 rounded-lg px-4`}
          >
            <AccordionTrigger
              onClick={() => {
                if (id === curId) {
                  setCurId(null);
                } else {
                  setCurId(id);
                }
              }}
            >
              <span className="flex gap-4 items-center font-semibold">
                <IoBookOutline className="text-lg" />
                {title}
              </span>
            </AccordionTrigger>
            <AccordionContent>{description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
