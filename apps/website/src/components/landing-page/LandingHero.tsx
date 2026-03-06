import Image from 'next/image';
import React from 'react';

const stats = [
  { label: '৩০ লক্ষ+', subLabel: 'শিক্ষার্থী', color: '#FF6E76' },
  { label: '২০ জন+', subLabel: 'অভিজ্ঞ মেন্টর', color: '#EDAFFD' },
  { label: '২০ লক্ষ+', subLabel: 'অ্যাপ ডাউনলোড', color: '#00B19E' },
  { label: '১.৮ লক্ষ+', subLabel: 'লার্নিং ম্যাটেরিয়াল', color: '#EAA819' },
];

export default function LandingHero() {
  return (
    <div className="relative pb-36 sm:pb-24 md:pb-16 px-4 sm:px-6 lg:px-8 mx-auto mt-4">
      <div className="relative w-full aspect-video max-h-170 rounded-2xl md:rounded-3xl bg-transparent">
        {' '}
        {/*  bg-linear-to-br from-purple-600 via-blue-600 to-cyan-600 */}
        <Image
          src="/UI/LandingPage/herobanner.gif"
          alt="Background"
          width={1920}
          height={600}
          priority
          className="object-cover rounded-xl aspect-video h-full w-full pointer-events-none"
        />
        {/* Stats Card */}
        <div className="absolute -bottom-32 sm:-bottom-16 md:-bottom-15 left-1/2 -translate-x-1/2 w-[92%] sm:w-full max-w-7xl flex justify-center items-center">
          <div className="relative w-full">
            {/* Gradient Shadow */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-yellow-500 rounded-xl md:rounded-2xl blur-xl opacity-30 translate-y-2"></div>

            {/* Gradient Border */}
            <div className="relative bg-linear-to-r from-blue-500 via-red-800 to-yellow-500 p-0.5 rounded-xl md:rounded-2xl">
              <div className="relative flex items-center bg-black backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl">
                {/* Stats List */}
                <ul className="grid grid-cols-2 sm:grid-cols-4 w-full py-3 sm:py-8 md:py-10 divide-gray-500/70 divide-x sm:divide-y-0">
                  {stats.map((stat, idx) => (
                    <li
                      key={idx}
                      className={`flex flex-col justify-center items-center px-3 sm:px-8 md:px-12 lg:px-16 py-2 sm:py-0 flex-1 ${idx >= 2 ? 'border-t border-gray-500/70 sm:border-t-0' : ''} ${idx % 2 === 0 ? '!border-l-0' : ''}`}
                    >
                      <h3
                        className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1"
                        style={{ color: stat.color }}
                      >
                        {stat.label}
                      </h3>
                      <p className="text-center text-xs sm:text-sm text-gray-200">
                        {stat.subLabel}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
