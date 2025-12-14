import React from 'react';
import { FaPhone } from 'react-icons/fa';
export default function Contact() {
  return (
    <div className="bg-dark-blue/10 border border-dark-blue py-4 px-5 rounded-3xl shadow-md text-foreground text-sm">
      <h1 className="font-semibold mb-2">প্রয়োজনে কল করুন</h1>
      <div className="flex justify-between items-center mt-5">
        <div className="border border-foreground font-bold rounded-full px-6 py-1 hover:bg-white/5 text-xs flex items-center gap-2">
          <FaPhone />
          +8801512345678
        </div>
        <div className="flex gap-2">
          <div className="w-[6px] bg-vibrant-blue rounded-full"></div>
          <p>সকাল ৯টা - রাত ১০টা</p>
        </div>
      </div>
    </div>
  );
}
