import React from 'react';
import Image from 'next/image';
import { FeeType } from '@repo/shared';

export default function CourseCardHeader({
  imageUrl,
  title,
  feeType,
  price,
  batchNo,
  maxDiscount,
}: {
  imageUrl: string;
  title: string;
  feeType?: string;
  price?: number | null;
  batchNo: string;
  maxDiscount?: string | null;
}) {
  return (
    <div className="relative w-full h-full p-1.5 z-0 rounded-3xl">
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
      />
      <div className="hidden dark:block absolute w-full h-fit blur-xl top-0 left-0 rounded-3xl -z-10">
        <Image
          src={imageUrl}
          alt={title}
          className="-z-10 rounded-2xl aspect-video object-center w-full"
          width={286}
          height={161}
        />
      </div>

      <div className="flex justify-between items-center my-2">
        <span className="relative">
          <Image
            className="absolutee left-0 top-2/3"
            src={'/CourseDetails/batchIcon.svg'}
            width={66}
            height={56}
            alt="course-batch-icon"
          />
          <span className="absolute left-1.5 top-1/2 -translate-y-2/3 text-xs font-medium text-white">
            {batchNo}
          </span>
        </span>

        {feeType === FeeType.FREE ? (
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            ফ্রি
          </span>
        ) : (
          <div className="flex items-center gap-2">
            {maxDiscount && price ? (
              <>
                <span className="px-3 py-0.5 bg-blue-500 text-white text-sm font-semibold rounded-full">
                  ৳ {Math.round(price - (price * parseFloat(maxDiscount)) / 100)}
                </span>
                <span className="text-xs line-through text-foreground/50">৳{price}</span>
              </>
            ) : (
              <span className="px-3 py-0.5 bg-blue-500 text-white text-sm font-semibold rounded-full">
                ৳ {price || 0}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
