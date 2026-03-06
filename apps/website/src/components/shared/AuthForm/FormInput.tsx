'use client';

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { FormInputProps } from './FormInputProps';
import { EyeOff } from 'lucide-react';

export default function FormInput(props: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = props.type === 'password' && showPassword ? 'text' : props.type;

  const IconComponent = props.type === 'password' && showPassword ? EyeOff : props.Icon;

  return (
    <div className="relative group">
      <Input
        name={props.name}
        type={inputType || 'text'}
        placeholder={props.placeholder || ''}
        required={props.required || false}
        className="w-full rounded-lg px-4 py-7 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:text-base text-base text-gray-900 dark:text-white focus:border-vibrant-blue focus:ring-1 focus:ring-vibrant-blue/30 transition-all duration-200"
      />
      {props.Icon && (
        <button
          type="button"
          onClick={() => props.type === 'password' && setShowPassword(!showPassword)}
          className="absolute right-4 bottom-1/2 translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          {IconComponent && <IconComponent className="size-[18px]" />}
        </button>
      )}
    </div>
  );
}
