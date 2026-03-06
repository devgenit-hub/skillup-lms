'use client';
import type { InfoCardProps } from '@/components/course/types/InfoCardProps/InfoCardProps';
import React from 'react';
import InfoCardHeader from './InfoCardHeader';
import InfoCardBody from './InfoCardBody';

export default function InfoCard(props: InfoCardProps) {
  return (
    <div
      className="flex flex-col gap-x-2 p-6 rounded-3xl border backdrop-blur-[100px] max-w-2xs shadow-md"
      style={{
        backgroundColor: props.bgColor || 'rgba(83,150,34,0.1)',
        borderColor: props.borderColor || 'rgba(255,255,255,0.1)',
      }}
    >
      <InfoCardHeader
        chipText={props.chipText || 'লাইভ'}
        chipColor={props.chipColor || 'rgba(83,150,34,1)'}
        maxDiscount={props.maxDiscount}
      />

      <InfoCardBody
        title={props.title || 'ডিজিটাল যুগে যোগাযোগের সহজ মাধ্যম'}
        description={
          props.description ||
          'উপস্থাপক, অংশগ্রহণকারী, বিষয়বস্তু (স্লাইড বা স্ক্রিন শেয়ার), আলাপচারিতার জন্য চ্যাট/প্রশ্নোত্তর এবং ভবিষ্যতের জন্য রেকর্ডিং।'
        }
      />
    </div>
  );
}
