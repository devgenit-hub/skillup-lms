import React from 'react';
export default function CouponInput() {
  return (
    <div className="bg-linear-to-r from-dark-blue/10 via-70% via-dark-blue/20 to-95% to-dark-blue/30 border border-dark-blue py-4 px-5 rounded-3xl shadow-md text-foreground text-sm">
      <h1 className="font-semibold mb-2">কুপন</h1>
      <div className="flex items-center bg-white/10 border border-dark-blue/20 rounded-full px-1 py-1">
        <input
          type="text"
          placeholder="কোড লিখুন"
          className="flex-grow bg-none outline-none text-sm px-4 py-2 placeholder-gray-400"
        />
        <button className="bg-vibrant-blue hover:bg-vibrant-blue/80 text-white text-sm font-semibold px-4 py-2 rounded-full transition">
          প্রয়োগ করুন
        </button>
      </div>
    </div>
  );
}
