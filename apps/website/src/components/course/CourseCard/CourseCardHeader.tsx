import React from 'react';
import Image from 'next/image';
const starFill = '/CourseDetails/starfill.svg';
const starEmpty = '/CourseDetails/starnofill.svg';
export default function CourseCardHeader({
  imageUrl,
  title,
  rating,
  batchNo,
}: {
  imageUrl: string;
  title: string;
  rating: number;
  batchNo: string;
}) {
  return (
    <div className="relative w-full h-full p-1.5 z-0 rounded-3xl">
      <Image
        src={imageUrl}
        alt={title}
        className="z-10 rounded-[18px] object-center aspect-video w-full"
        width={286}
        height={286}
      />
      <div className="hidden dark:block absolute w-full h-fit blur-xl top-0 left-0 rounded-3xl -z-10">
        <Image
          src={imageUrl}
          alt={title}
          className="-z-10 rounded-2xl aspect-video object-center w-full"
          width={286}
          height={286}
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
          <span className="absolute left-3 top-1/2 -translate-y-2/3 text-xs font-medium text-white">
            {batchNo}
          </span>
        </span>

        <span className="flex gap-0.25">
          {Array.from({ length: 5 }, (_, index) => {
            if (index < rating) {
              return (
                <Image key={index} src={starFill} width={20} height={20} alt="course-batch-icon" />
              );
            } else {
              return (
                <Image key={index} src={starEmpty} width={20} height={20} alt="course-batch-icon" />
              );
            }
          })}
        </span>
      </div>
    </div>
  );
}
