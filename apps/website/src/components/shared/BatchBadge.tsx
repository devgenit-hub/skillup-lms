import Image from 'next/image';
import React from 'react';

export default function BatchBadge(props: { batch: string }) {
  return (
    <span className="relative">
      <Image src={'/CourseDetails/batchIcon.svg'} width={66} height={56} alt="course-batch-icon" />
      <span className="absolute left-3 top-1/2 -translate-y-3/5 text-sm font-medium text-white">
        {props.batch}
      </span>
    </span>
  );
}
