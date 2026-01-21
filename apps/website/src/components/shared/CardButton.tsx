import React from 'react';
import { Button } from '@/components/ui/button';

export default function CardButton({
  buttonText,
  handleClick,
}: {
  buttonText?: string;
  handleClick?: () => void;
}) {
  return (
    <Button
      className="w-[80%] h-fit mx-auto bg-vibrant-blue hover:bg-dark-blue text-white text-base font-semibold py-3 shadow-lg transition absolute -bottom-5 left-0 right-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-full shadow-black/25 dark:shadow-white/25 text-shadow-md text-shadow-black cursor-pointer"
      style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
      onClick={handleClick}
    >
      {buttonText || 'বিস্তারিত দেখুন'}
    </Button>
  );
}
