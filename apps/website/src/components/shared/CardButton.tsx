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
      className="bg-vibrant-blue w-[80%] hover:bg-dark-blue font-bold text-white rounded-full shadow-md shadow-black/25 dark:shadow-white/25 py-2 text-sm text-shadow-md text-shadow-black cursor-pointer"
      style={{ textShadow: '0px 4px 4px rgba(0,0,0,0.25)' }}
      onClick={handleClick}
    >
      {buttonText || 'বিস্তারিত দেখুন'}
    </Button>
  );
}
