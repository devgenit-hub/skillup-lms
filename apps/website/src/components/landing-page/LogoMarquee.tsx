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
    <div className="w-full py-8 mt-16 container mx-auto">
      <Marquee>
        <MarqueeFade side="left" />
        <MarqueeFade side="right" />
        <MarqueeContent>
          {logoUrlList.map((url, idx) => (
            <MarqueeItem key={idx}>
              <div className="mx-2 flex items-center justify-center relative h-16 w-32">
                <Image
                  src={url}
                  alt={`Logo ${idx + 1}`}
                  fill
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
