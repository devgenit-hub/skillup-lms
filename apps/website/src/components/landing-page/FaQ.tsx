'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight, ChevronRight } from 'lucide-react';

const faq = [
  {
    question: 'আমি কীভাবে কোর্সে ভর্তি হতে পারি?',
    answer: `আমাদের প্ল্যাটফর্মে ভর্তি হওয়া খুব সহজ। প্রথমে আপনার পছন্দের কোর্সটি কোর্স লিস্ট থেকে নির্বাচন করুন। কোর্স পেজে গিয়ে কোর্সের বিস্তারিত তথ্য পড়ে নিন এবং "Enroll Now" বাটনে ক্লিক করুন। এরপর আপনাকে অ্যাকাউন্ট খুলতে হবে অথবা আগের অ্যাকাউন্টে লগইন করতে হবে। পেমেন্ট করার জন্য বিকাশ, নগদ, রকেট বা অনলাইন কার্ড সিলেক্ট করুন। পেমেন্ট সফলভাবে সম্পন্ন হলে সঙ্গে সঙ্গে আপনার কোর্স অ্যাক্সেস অ্যাক্টিভেট হবে। সবশেষে ড্যাশবোর্ডে গিয়ে লেকচার দেখা শুরু করতে পারবেন।`,
  },
  {
    question: 'কোর্সের মেয়াদ কতদিন?',
    answer: `প্রতিটি কোর্সের মেয়াদ আলাদা। কোর্সের বিস্তারিত পৃষ্ঠায় মেয়াদ উল্লেখ থাকে। সাধারণত কোর্সের অ্যাক্সেস ৬ মাস থেকে ১ বছর পর্যন্ত দেওয়া হয়।`,
  },
  {
    question: 'আমি কীভাবে পেমেন্ট করবো?',
    answer: `আপনি বিকাশ, নগদ, রকেট অথবা আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ডের মাধ্যমে সহজেই পেমেন্ট করতে পারবেন। পেমেন্ট সফল হলে আপনার কোর্স সঙ্গে সঙ্গে অ্যাক্টিভেট হবে।`,
  },
  {
    question: 'কোর্স সম্পন্ন করার পর সার্টিফিকেট পাবো কি?',
    answer: `হ্যাঁ, প্রতিটি কোর্স সম্পন্ন করার পর আপনি একটি ডিজিটাল সার্টিফিকেট পাবেন যা আপনি আপনার প্রোফাইল থেকে ডাউনলোড করতে পারবেন।`,
  },
  {
    question: 'আমি কীভাবে সাপোর্ট পাবো?',
    answer: `যদি কোনো সমস্যা হয়, আপনি আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করতে পারেন। সাপোর্ট পেজে গিয়ে বা ইমেইলের মাধ্যমে আপনি দ্রুত সহায়তা পাবেন।`,
  },
];

export default function FaQ() {
  const [curId, setCurId] = React.useState<number | null>(null);

  return (
    <div className="container mx-auto my-36 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left Section */}
      <div className="flex flex-col justify-between gap-10 h-full">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-b from-[#C3C0D8] via-[#9B90DF] to-[#7361E5] text-transparent bg-clip-text mb-3">
            প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী
          </h3>
          <p className="dark:text-white/50 text-black/80 text-sm">
            আপনার যাত্রা শুরু করার আগে! এই বিভাগে আপনি সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নগুলোর (FAQ) সহজ
            সমাধান খুঁজে পাবেন। আপনার যা কিছু জানা প্রয়োজন—তা ক্লাস রুটিন হোক বা প্রসপেক্টাস—আমরা সব
            তথ্য এখানে গুছিয়ে রেখেছি। আপনার নির্দিষ্ট কোনো প্রশ্ন থাকলে বা ব্যক্তিগত সহায়তার প্রয়োজন
            হলে, আমাদের ডেডিকেটেড সাপোর্ট টিমের সাথে এখনই যোগাযোগ করুন।
          </p>
        </div>

        <div className="flex justify-start items-end max-w-[300px]">
          <div className="flex flex-col gap-2 border p-5 rounded-3xl">
            <h5 className="text-sm font-bold">এখনও প্রশ্ন আছে?</h5>
            <p className="text-xs dark:text-white/50">
              আমরা আপনার সাহায্যের জন্য প্রস্তুত। যেকোনো প্রশ্নের জন্য আমাদের যোগাযোগ করুন।
            </p>
            <div className="flex justify-start">
              <a
                href="#"
                className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-white/5 text-sm flex items-center gap-2 transition-all"
              >
                প্রশ্ন করুন <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Accordion */}
      <Accordion type="single" collapsible className="flex flex-col gap-4">
        {faq.map(({ question, answer }, idx) => (
          <AccordionItem
            key={idx}
            value={`Question-${idx}`}
            className={`shadow-md  ${
              idx == curId ? 'bg-vibrant-blue text-white' : 'bg-vibrant-blue/10 '
            } border border-vibrant-blue/20 dark:border-chart-1/20 rounded-lg px-4 `}
          >
            <AccordionTrigger
              className="flex items-center justify-between py-3 font-semibold text-left"
              onClick={() => {
                if (idx === curId) {
                  setCurId(null);
                } else {
                  setCurId(idx);
                }
              }}
            >
              <span className="flex gap-3 items-center">
                <ChevronRight className="w-4 h-4" />
                {question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="dark:text-white/70 pb-4">{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
