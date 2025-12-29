import React from 'react';
import Image from 'next/image';

export default function WebinarCardHeader({
  imageUrl,
  title,
  maxDiscount,
}: {
  imageUrl: string;
  title: string;
  maxDiscount?: string | null;
}) {
  return (
    <div className="relative w-full p-1.5 z-0 rounded-t-3xl">
      {/* Discount Badge */}
      {maxDiscount && (
        <div className="absolute top-2 left-2 z-20">
          <div className="bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-1">
            <span className="text-sm">🔥</span>
            <span>{maxDiscount}% ছাড়</span>
          </div>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={title}
        className="z-10 rounded-[18px] object-cover aspect-video w-full"
        width={286}
        height={161}
        unoptimized={imageUrl?.startsWith('http') || false}
      />
      <div className="hidden dark:block absolute w-full h-fit blur-xl top-0 left-0 rounded-3xl -z-10">
        <Image
          src={imageUrl}
          alt={title}
          className="-z-10 rounded-2xl aspect-video object-center w-full"
          width={286}
          height={161}
          unoptimized={imageUrl?.startsWith('http') || false}
        />
      </div>
    </div>
  );
}
