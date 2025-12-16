'use client';
import React, { useEffect, useState } from 'react';

export default function Countdown({ endDate }: { endDate: string }) {
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays > 0 ? diffDays : 0);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <span>
      {daysLeft
        .toString()
        .split('')
        .map((d: string) => banglaDigits[parseInt(d, 10)])
        .join('')}
    </span>
  );
}
