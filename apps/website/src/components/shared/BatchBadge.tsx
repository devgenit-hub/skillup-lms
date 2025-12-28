import Image from 'next/image';
import React from 'react';

export default function BatchBadge(props: { batch: string; className?: string }) {
  const { batch, className } = props;
  return (
    <span className="relative">
      <Image
        src={'/CourseDetails/batchIcon.svg'}
        width={66}
        height={56}
        alt="course-batch-icon"
        className={className}
      />
      <span className="absolute left-3 top-1/2 -translate-y-3/5 text-sm font-medium text-white">
        {batch}
      </span>
    </span>
  );
}
