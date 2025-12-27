import React from 'react';
import Image from 'next/image';

export default function WebinarCardHeader({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title: string;
}) {
  return (
    <div className="relative w-full p-1.5 z-0 rounded-t-3xl">
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
