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
    <div className="relative pb-24 md:pb-16 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <Image
          src="/UI/LandingPage/waves-bg.png"
          alt="Background"
          fill
          priority
          className="object-cover rounded-xl"
        />

        {/* Stats Card */}
        <div className="absolute -bottom-20 sm:-bottom-16 md:-bottom-15 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-4xl flex justify-center items-center">
          <div className="relative w-full">
            {/* Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-xl md:rounded-2xl blur-xl opacity-30 translate-y-2 not-md:scale-75"></div>

            {/* Gradient Border */}
            <div className="relative bg-gradient-to-r from-blue-500 via-red-800 to-yellow-500 p-0.5 rounded-xl md:rounded-2xl not-md:scale-75">
              <div className="relative flex items-center bg-black backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl">
                {/* Stats List */}
                <ul className="grid grid-cols-2 sm:flex flex-col sm:flex-row w-full py-6 sm:py-8 md:py-10 sm:divide-y-0 sm:divide-x divide-gray-700/50">
                  {stats.map((stat, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-0 flex-1"
                    >
                      <h3
                        className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1"
                        style={{ color: stat.color }}
                      >
                        {stat.label}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200">{stat.subLabel}</p>
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
