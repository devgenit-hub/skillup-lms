'use client';

import { FormInputProps } from '@/components/shared/AuthForm/FormInputProps';
import { Eye } from 'lucide-react';

export const registerFields: FormInputProps[] = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'আপনার নাম লিখুন',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'ইমেইল',
    required: true,
  },
  {
    name: 'mobile',
    type: 'text',
    placeholder: 'মোবাইল',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'পাসওয়ার্ড দিন',
    required: true,
    Icon: Eye,
  },
  {
    name: 'repeatPassword',
    type: 'password',
    placeholder: 'পাসওয়ার্ড পুনরায় লিখুন',
    required: true,
    Icon: Eye,
  },
];
