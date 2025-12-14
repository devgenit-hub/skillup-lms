'use client';

import { FormInputProps } from '@/components/shared/AuthForm/FormInputProps';
import { Eye } from 'lucide-react';

export const loginFields: FormInputProps[] = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'ইমেইল/মোবাইল',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'পাসওয়ার্ড দিন',
    required: true,
    Icon: Eye,
  },
];
