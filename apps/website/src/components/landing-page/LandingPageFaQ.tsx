import Image from 'next/image';
import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

export default function LandingPageFaQ() {
  return (
    <div className="container mx-auto mt-20 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Card-1 */}
      <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-md dark:shadow-none border bg-white border-vibrant-blue/20 dark:bg-chart-1/10 dark:border-chart-1/20 p-7 flex flex-col justify-between flex-1">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="mb-4 flex-1">
            <h1 className="font-bold text-base md:text-lg">আমি কীভাবে কোর্সে ভর্তি হতে পারি?</h1>
            <p className="text-xs md:text-sm text-foreground/70 dark:text-white/70 w-1/2">
              আপনার প্রতিটি প্রশ্নের দ্রুত সমাধান পেতে আমাদের সাপোর্ট টিমে কল দিন
            </p>
          </div>

          <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
            {/* Glow effect */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/50 blur-2xl opacity-40 rounded-full z-0" />
            <Image
              src="/CourseDetails/customer-care.svg"
              alt="Query about course"
              fill
              className="object-contain relative z-10 scale-200 origin-top-right"
            />
          </div>
        </div>

        <div>
          <p className="font-bold text-xs md:text-sm mb-2 flex items-center gap-2">
            <span className="w-1 h-4 bg-vibrant-blue rounded-full" />
            <span>সকাল ৯টা - রাত ১০টা</span>
          </p>
          <button className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-foreground/5 dark:border-white text-xs md:text-sm flex items-center gap-2 mt-4 transition-all">
            +880112464645
          </button>
        </div>
      </div>

      {/* Right side grid */}
      <div className="grid grid-cols-1 gap-4 flex-1">
        {/* Card-2 */}
        <div className="rounded-3xl overflow-hidden shadow-md dark:shadow-none border bg-white border-vibrant-blue/20 dark:bg-chart-1/10 dark:border-chart-1/20 py-4 px-7 flex justify-between items-center">
          <div>
            <h1 className="font-bold mb-4 text-base md:text-lg">ফ্রি ভিডিও লাইব্রেরি</h1>
            <a
              href="#"
              className="border border-vibrant-blue font-bold rounded-full px-6 py-2 w-fit hover:bg-foreground/5 dark:border-white text-xs md:text-sm flex items-center gap-2 mt-5 transition-all"
            >
              ভিডিও দেখুন <MdArrowOutward className="text-lg" />
            </a>
          </div>
          <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-16 bg-red-500 blur-2xl opacity-40 rounded-full z-0" />
            <Image
              src="/CourseDetails/yt.png"
              alt="YouTube"
              width={150}
              height={150}
              className="object-contain relative z-1 w-28 aspect-square"
            />
          </div>
        </div>

        {/* Card-3 */}
        <div className="rounded-3xl overflow-hidden shadow-md dark:shadow-none border bg-white border-vibrant-blue/20 dark:bg-chart-1/10 dark:border-chart-1/20 py-4 px-7 flex justify-between items-center">
          <div>
            <h1 className="font-bold mb-4 text-base md:text-lg">Facebook গ্রুপে যোগ দিন</h1>
            <a
              href="#"
              className="border border-vibrant-blue font-bold rounded-full px-6 py-2 w-fit hover:bg-foreground/5 dark:border-white text-xs md:text-sm flex items-center gap-2 mt-5 transition-all"
            >
              যোগ দিন <MdArrowOutward className="text-lg" />
            </a>
          </div>
          <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-16 bg-blue-500 blur-2xl opacity-40 rounded-full z-0" />
            <Image
              src="/CourseDetails/fb.png"
              alt="Facebook"
              width={150}
              height={150}
              className="object-contain relative z-10 w-28 aspect-square"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
