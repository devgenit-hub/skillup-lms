'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { WebinarFeeType } from '@repo/shared';
import Count from '../../CountDown';

export default function WebinarCardBody({
  category,
  title,
  endDate,
  feeType,
  price,
  maxDiscount,
}: {
  category: string;
  title: string;
  endDate: string;
  feeType?: string;
  price?: number | null;
  maxDiscount?: string | null;
}) {
  const isFree = feeType === WebinarFeeType.FREE;

  return (
    <div className="flex flex-col gap-2 px-2 h-full justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm text-primary/50">{category}</span>
        {feeType && (
          <div>
            {isFree ? (
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
        )}
      </div>
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
