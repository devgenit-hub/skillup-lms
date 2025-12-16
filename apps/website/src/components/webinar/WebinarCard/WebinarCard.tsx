'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import type { WebinarCardProps } from '@/components/webinar/types/WebinarCardProps/WebinarCardProps';
import WebinarCardHeader from './WebinarCardHeader';
import WebinarCardBody from './WebinarCardBody';
import CardButton from '../../shared/CardButton';

export default function WebinarCard(props: WebinarCardProps) {
  const router = useRouter();

  return (
    <div className="w-auto h-full flex flex-col relative rounded-3xl pb-10 sbg-card border-white/10 border-2 text-card-foreground  shadow-md shadow-black/25">
      <div className="overflow-hidden h-full flex flex-col justify-between gap-2 rounded-3xl w-full">
        <WebinarCardHeader
          imageUrl={props.imageUrl || '/test_images/webinar_test_image.png'}
          title={props.title || 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস'}
        />
        <WebinarCardBody
          category={props.category || 'ওয়েবিনার'}
          title={props.title || 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস'}
          endDate={props.endDate || '2025-12-31'}
        />
      </div>
      <div className="absolute left-0 bottom-0 translate-y-1/2 w-full flex justify-center">
        <CardButton
          handleClick={() => {
            router.push('/webinar/' + props.webinarId);
          }}
        />
      </div>
    </div>
  );
}
