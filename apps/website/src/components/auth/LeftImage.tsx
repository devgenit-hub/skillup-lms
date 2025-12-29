import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { IoIosArrowBack } from 'react-icons/io';
import Image from 'next/image';

export default function LeftImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-auto max-w-lg h-auto relative not-md:hidden">
      <div className="absolute right-3 top-3 p-1">
        <Link href="/">
          <Button
            variant={'outline'}
            className="bg-transparent/50 backdrop-blur-xl rounded-full text-white hover:bg-transparent hover:text-white/85 hover:cursor-pointer"
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
        className="w-full h-full rounded-lg object-cover aspect-square"
      />
    </div>
  );
}
