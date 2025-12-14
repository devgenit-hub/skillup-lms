'use client';
import { Calendar, Award, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import React from 'react';
import { NumberCardProps } from './types/NumberCardProps';

export default function NameCard() {
  const date = new Date();

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const greeting = () => {
    const hour = date.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const numberCardData: NumberCardProps[] = [
    {
      numb: 12,
      chipText: 'Owned',
      style: 'bg-[#FFA800]/20 text-[#FFA800]',
    },
    {
      numb: 7,
      chipText: 'Completed',
      style: 'bg-[#04C56C]/20 text-[#04C56C]',
    },
    {
      numb: 5,
      chipText: 'Remaining ',
      style: 'bg-[#FF3F34]/20 text-[#FF3F34]',
    },
  ];

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl group"
      style={{
        backgroundImage: `url('/student/card_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-600/90 via-blue-600/90 to-purple-600/90"></div>

      {/* Animated Particles Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-150"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-6 px-6 lg:px-10 text-white">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          {/* Left Section - Greeting */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm lg:text-base font-medium text-blue-100">{greeting()},</span>
              <Award className="w-5 h-5 text-yellow-300 animate-bounce" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Mahadi Hasan Fardin
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/30">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Quick Stats */}
          <div className="flex gap-4">
            {numberCardData?.map((ele, idx) => {
              const getIcon = () => {
                const chipText = ele.chipText;
                if (chipText.includes('Owned')) return <BookOpen size={16} />;
                if (chipText.includes('Completed')) return <CheckCircle2 size={16} />;
                if (chipText.includes('Remaining')) return <Clock size={16} />;
                return null;
              };
              return (
                <div
                  key={idx}
                  className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/30 shadow-lg hover:scale-105 transition-transform"
                >
                  <p className="text-2xl text-center font-bold">{ele.numb}</p>
                  <div className="flex items-center gap-2 text-white font-bold mb-1">
                    {getIcon()}
                    <span className="text-xs font-medium">{ele.chipText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
