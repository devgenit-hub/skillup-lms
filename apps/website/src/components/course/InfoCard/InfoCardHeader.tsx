'use client';
import React from 'react';
import type { InfoCardHeaderProps } from '@/components/course/types/InfoCardProps/InfoCardHeaderProps';
import { Badge } from '@/components/ui/badge';

export default function InfoCardHeader(props: InfoCardHeaderProps) {
  return (
    <div className="relative">
      {/* Discount Badge */}
      {props.maxDiscount && (
        <div className="absolute -top-8 -left-6 z-20">
          <div className="bg-linear-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-1">
            <span className="text-sm">🔥</span>
            <span>{props.maxDiscount} ছাড়</span>
          </div>
        </div>
      )}
      <Badge
        className="mb-4 px-4 py-1 rounded-full text-white text-sm flex items-center justify-center"
        style={{ backgroundColor: props.chipColor }}
      >
        <span className="text-shadow-black text-shadow-sm  tracking-wide text-center ">
          {props.chipText}
        </span>
      </Badge>
    </div>
  );
}
