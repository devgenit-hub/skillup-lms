'use client';
import React from 'react';

export default function Count({ num }: { num: string }) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  return (
    <span>
      {num
        .split('')
        .map((d: string) => banglaDigits[parseInt(d, 10)])
        .join('')}
    </span>
  );
}
