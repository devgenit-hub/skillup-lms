'use client';
import type { InfoCardBodyProps } from '@/components/course/types/InfoCardProps/InfoCardBodyProps';
import React from 'react';

export default function InfoCardBody(props: InfoCardBodyProps) {
  return (
    <div>
      <div className="mt-3 text-shadow-black text-shadow-xs">
        <h3 className="text-lg font-semibold mb-2 tracking-wider text-white">{props.title}</h3>
      </div>

      <div className="whitespace-pre-line text-shadow-black text-shadow-xs">
        <p className="text-sm text-white font-[500] text-wrap break-words max-w-xs">
          {props.description}
        </p>
      </div>
    </div>
  );
}
