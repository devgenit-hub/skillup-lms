'use client';
import React from 'react';
import type { InfoCardFooterProps } from '@/components/course/types/InfoCardProps/InfoCardFooterProps';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function InfoCardFooter(props: InfoCardFooterProps) {
  return (
    <div className="flex  items-center mt-5">
      <div className="flex -space-x-1.5">
        {props.topProfileImagesURLs?.map((url, index) => (
          <Avatar key={index} className="w-6 h-6 border border-white rounded-full">
            <AvatarImage src={url} className="rounded-full" />
          </Avatar>
        ))}
      </div>
      <p className="text-sm text-white text-shadow-black text-shadow-xs font-[700] ml-3">
        {props.totalStudents}+ জন শিক্ষার্থী
      </p>
    </div>
  );
}
