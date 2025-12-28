import Image from 'next/image';
import React from 'react';
import { FaArrowDown } from 'react-icons/fa6';

interface ProspectusProps {
  classRoutinePdf?: string | null;
}

export default function Prospectus({ classRoutinePdf }: ProspectusProps) {
  return (
    <div id="routine" className="mt-20 scroll-m-20">
      <h1 className="font-bold text-2xl mb-4 text-black dark:text-white">
        প্রোগ্রাম রুটিন & প্রসপেক্টাস
      </h1>

      <div className="relative rounded-3xl overflow-hidden shadow-md border bg-vibrant-blue/10 border-vibrant-blue/20 dark:bg-chart-1/10 dark:border-chart-1/20 p-6">
        <div className="relative w-full aspect-2/1">
          <Image
            src="/CourseDetails/Prospectus.png"
            alt="Program Routine & Prospectus"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {classRoutinePdf ? (
          <a
            href={classRoutinePdf}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="border border-vibrant-blue font-bold rounded-full px-6 py-2 hover:bg-foreground/5 dark:border-white text-sm flex items-center justify-center gap-2 mt-5 w-full"
          >
            ডাউনলোড PDF <FaArrowDown className="text-lg" />
          </a>
        ) : (
          <button
            disabled
            className="border border-gray-400 font-bold rounded-full px-6 py-2 text-sm flex items-center justify-center gap-2 mt-5 opacity-50 cursor-not-allowed w-full"
          >
            ডাউনলোড PDF <FaArrowDown className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
}
