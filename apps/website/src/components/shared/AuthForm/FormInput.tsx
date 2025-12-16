'use client';

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { FormInputProps } from './FormInputProps';

export default function FormInput(props: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = props.type === 'password' && showPassword ? 'text' : props.type;

  return (
    <div className="relative">
      <Input
        name={props.name}
        type={inputType || 'text'}
        placeholder={props.placeholder || ''}
        required={props.required || false}
        className="w-full rounded-lg px-5 py-6 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(59,54,76,1)] placeholder:text-[16px]"
      />
      {props.Icon && (
        <button
          type="button"
          onClick={() => props.type === 'password' && setShowPassword(!showPassword)}
          className="absolute right-3 bottom-1/2 translate-y-1/2 text-foreground"
        >
          <props.Icon className="size-4 font-black" />
        </button>
      )}
    </div>
  );
}
