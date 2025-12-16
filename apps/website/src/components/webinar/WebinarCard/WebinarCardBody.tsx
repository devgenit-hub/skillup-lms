'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import Count from '../../CountDown';

export default function WebinarCardBody({
  category,
  title,
  endDate,
}: {
  category: string;
  title: string;
  endDate: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-2 h-full justify-between">
      <span className="text-sm  text-primary/50">{category}</span>
      <span className="text-xl font-bold">{title}</span>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <Clock className="size-4"></Clock>
        <b>
          <Count endDate={endDate} />
        </b>
        দিন বাকি
      </div>
    </div>
  );
}
