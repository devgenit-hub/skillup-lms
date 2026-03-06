import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { IoIosArrowBack } from 'react-icons/io';
import Image from 'next/image';

export default function LeftImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-auto max-w-md h-auto relative not-md:hidden flex-shrink-0">
      <div className="absolute left-4 top-4 z-10">
        <Link href="/">
          <Button
            variant={'outline'}
            className="bg-black/30 backdrop-blur-xl border-white/20 rounded-full text-white hover:bg-black/50 hover:text-white hover:cursor-pointer text-sm px-4 py-2 transition-all duration-300"
          >
            <IoIosArrowBack className="size-4" />
            ওয়েবসাইটে ফিরে যান
          </Button>
        </Link>
      </div>
      <Image
        src={src}
        alt={alt}
        width={510}
        height={510}
        className="w-full h-full rounded-2xl object-cover"
      />
    </div>
  );
}
