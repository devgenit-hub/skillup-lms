'use client';
import React from 'react';
import type { InfoCardHeaderProps } from '@/components/course/types/InfoCardProps/InfoCardHeaderProps';
import { Badge } from '@/components/ui/badge';

export default function InfoCardHeader(props: InfoCardHeaderProps) {
  return (
    <Badge
      className="mb-4 px-4 py-1 rounded-full text-white text-sm flex items-center justify-center"
      style={{ backgroundColor: props.chipColor }}
    >
      <span className="text-shadow-black text-shadow-sm  tracking-wide text-center ">
        {props.chipText}
      </span>
    </Badge>
  );
}
