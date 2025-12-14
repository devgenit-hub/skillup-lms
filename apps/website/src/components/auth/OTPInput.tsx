import React from 'react';
import { Input } from '../ui/input';

export default function OTPInput({ length = 6 }) {
  return (
    <div className="flex justify-between">
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          inputMode="numeric"
          maxLength={1}
          aria-label={`OTP digit ${i + 1}`}
          className="size-20 rounded bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(59,54,76,1)] text-center text-xl"
        />
      ))}
    </div>
  );
}
