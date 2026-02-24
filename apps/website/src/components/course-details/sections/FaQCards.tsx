import Image from 'next/image';
import React from 'react';
import { MdArrowOutward } from 'react-icons/md';

interface FaQCardsProps {
  contactNumbers?: string[];
  facebookGroupLink?: string | null;
  introVideoLink?: string | null;
}

export default function FaQCards({
  contactNumbers = [],
  facebookGroupLink,
  introVideoLink,
}: FaQCardsProps) {
  return (
    <div className="container mx-auto mt-20">
      {/* Card-1 */}
      <div className="rounded-3xl overflow-hidden shadow-md dark:shadow-none border bg-white border-vibrant-blue/20 dark:bg-chart-1/10 dark:border-chart-1/20 p-7 mb-2 flex justify-between items-center">
        <div>
          <div className="mb-4">
            <h1 className="font-bold">আমি কীভাবে কোর্সে ভর্তি হতে পারি?</h1>
            <p className="text-xs">
              আপনার প্রতিটি প্রশ্নের দ্রুত সমাধান পেতে আমাদের সাপোর্ট টিমে কল দিন
            </p>
          </div>
          <p className="font-bold text-xs mb-2">সকাল ৯টা - রাত ১০টা</p>
          <div className="flex flex-col gap-2">
            {contactNumbers.length > 0 ? (
              contactNumbers.map((number, index) => (
                <a
                  key={index}
                  href={`tel:${number}`}
                  className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-vibrant-blue hover:text-white transition-colors text-sm text-center"
                >
                  {number}
                </a>
              ))
            ) : (
              <button className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-foreground/5 dark:border-white text-sm">
                +880 1632-344220
              </button>
            )}
          </div>
        </div>
        <div className="relative w-28 h-fit">
          {/* Glow effect */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-16 bg-blue-500 blur-2xl opacity-40 rounded-full z-0" />
          <Image
            src="/CourseDetails/customer-care.svg"
            alt="Query about course"
            width={112}
            height={112}
            className="object-contain relative z-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Card-2 */}
        <div className="rounded-3xl overflow-hidden shadow-md dark:shadow-none border bg-white border-vibrant-blue/20 dark:bg-chart-1/10 dark:border-chart-1/20 p-7 flex justify-between items-center">
          <div>
            <h1 className="font-bold mb-4">ফ্রি ভিডিও লাইব্রেরি</h1>
            {introVideoLink ? (
              <a
                href={introVideoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-vibrant-blue hover:text-white transition-colors dark:border-white flex items-center gap-2 text-xs"
              >
                ভিডিও দেখুন <MdArrowOutward className="text-lg" />
              </a>
            ) : (
              <button
                disabled
                className="border border-gray-400 font-bold rounded-full px-6 py-2 flex items-center gap-2 text-xs opacity-50 cursor-not-allowed"
              >
                ভিডিও দেখুন <MdArrowOutward className="text-lg" />
              </button>
            )}
          </div>
          <div className="relative w-28 h-fit">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-16 bg-red-500 blur-2xl opacity-40 rounded-full z-0" />
            <Image
              src="/CourseDetails/yt.png"
              alt="YouTube"
              width={112}
              height={112}
              className="object-contain relative z-10"
            />
          </div>
        </div>

        {/* Card-3 */}
        <div className="rounded-3xl overflow-hidden shadow-md dark:shadow-none border bg-white border-vibrant-blue/20 dark:bg-chart-1/10 dark:border-chart-1/20 p-7 flex justify-between items-center">
          <div>
            <h1 className="font-bold mb-4">Facebook গ্রুপে যোগ দিন</h1>
            {facebookGroupLink ? (
              <a
                href={facebookGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-vibrant-blue hover:text-white transition-colors dark:border-white text-xs flex items-center gap-2"
              >
                যোগ দিন <MdArrowOutward className="text-lg" />
              </a>
            ) : (
              <button
                disabled
                className="border border-gray-400 font-bold rounded-full px-6 py-2 text-xs flex items-center gap-2 opacity-50 cursor-not-allowed"
              >
                যোগ দিন <MdArrowOutward className="text-lg" />
              </button>
            )}
          </div>
          <div className="relative w-28 h-fit">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-16 bg-blue-500 blur-2xl opacity-40 rounded-full z-0" />
            <Image
              src="/CourseDetails/fb.png"
              alt="Facebook"
              width={112}
              height={112}
              className="object-contain relative z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
