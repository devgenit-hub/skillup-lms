'use client';
import React, { useState } from 'react';
import { PaymentMethodProps } from '../types/PaymentMethodProps';
import PaymentButton from './PaymentButton';
import { Button } from '@/components/ui/button';
const paymentMethod: PaymentMethodProps[] = [
  {
    id: '1',
    title: 'Bkash',
    logo: '/payment/bkash.png',
    bgColor: '#E2136E',
    inputStyle: 'border-white checked:border-white checked:bg-white',
    height: 10,
    width: 24,
  },
  {
    id: '2',
    title: 'Nagad',
    logo: '/payment/nagad.png',
    bgColor: '#3C1E1B',
    inputStyle: 'border-white checked:border-white checked:bg-white',
    height: 20,
    width: 48,
  },
  {
    id: '3',
    title: 'Visa',
    logo: '/payment/visa.png',
    inputStyle: 'border-black checked:border-black checked:bg-black',
    height: 24,
    width: 47,
  },
];

export default function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState<string>('bkash');

  const handlePaymentChange = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  return (
    <div className="bg-white dark:bg-dark-blue/20 border dark:border-dark-blue p-4 rounded-3xl shadow-lg shadow-dark-blue/20 text-foreground text-sm w-full">
      <form className="flex flex-col justify-between">
        <h1 className="font-bold text-center">অর্ডারের সারসংক্ষেপ</h1>
        <div className="w-full mt-5 flex flex-col gap-1 mb-14">
          <div className="flex justify-between items-center">
            <p>নিয়মিত মূল্য</p>
            <p className="font-bold">৳ ১০,০০০</p>
          </div>
          <div className="flex justify-between items-center">
            <p>ডিসকাউন্ট (২০% ছাড়)</p>
            <p className="font-bold text-destructive">-৳ ২,০০০</p>
          </div>
          <span className="h-px bg-foreground/50"></span>
          <div className="flex justify-between items-center">
            <p>মোট</p>
            <p className="font-bold text-base">{'-৳ ৭,০০০'}</p>
          </div>
        </div>
        <PaymentButton
          paymentMethod={paymentMethod}
          selectedMethod={selectedMethod}
          onChange={handlePaymentChange}
        />

        <Button className="w-full mt-10 bg-vibrant-blue hover:bg-vibrant-blue/80 text-white font-bold rounded-2xl text-base py-6">
          পেমেন্ট সম্পন্ন করুন
        </Button>
      </form>
    </div>
  );
}
