import React from 'react';
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@/components/ui/shadcn-io/marquee';
import Image from 'next/image';

export default function LogoMarquee({ logoUrlList }: { logoUrlList: string[] }) {
  return (
    <div className="w-full mt-16 container px-4 max-w-7xl mx-auto">
      <h3 className="mb-8 text-center font-bold text-2xl sm:text-3xl md:text-4xl text-[#2300ff] dark:text-transparent dark:bg-clip-text dark:bg-linear-to-b dark:from-[#C3C0D8] dark:via-10% dark:via-[#9B90DF] dark:to-[#7361E5] py-8">
        আমাদের পার্টনার
      </h3>
      <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent>
          {logoUrlList.map((url, idx) => (
            <MarqueeItem key={idx}>
              <div className="mx-2 sm:mx-6 lg:mx-10 flex items-center justify-center relative h-fit w-10 sm:w-20 md:w-24">
                <Image
                  src={url}
                  alt={`Logo ${idx + 1}`}
                  width={150}
                  height={150}
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
                />
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
}
