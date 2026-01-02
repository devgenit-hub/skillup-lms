'use client';
import React, { useState, useEffect } from 'react';
import { AboutWebinarProps } from '../types/AboutCourseProps';
import { IoClose } from 'react-icons/io5';
import { MdHighlight } from 'react-icons/md';
import RichTextDisplay from '@/components/ui/RichTextDisplay';

export default function SideBar({ AboutWebinar }: AboutWebinarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      {/* Mobile Button - Only visible on small screens */}
      <button
        onClick={() => setIsOpen(true)}
        className={`lg:hidden fixed bottom-6 right-6 z-40 bg-vibrant-blue hover:bg-dark-blue text-white p-4 rounded-full shadow-lg flex items-center gap-2 font-bold transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
        }`}
      >
        <MdHighlight className="text-2xl" />
        <span>সেশন হাইলাইটস</span>
      </button>

      {/* Mobile Popup Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-dark-blue/30 not-dark:bg-vibrant-blue/40 border border-dark-blue rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full transition"
            >
              <IoClose className="text-2xl" />
            </button>

            <h3 className="text-xl font-bold mb-6 text-white pr-10">সেশন হাইলাইটস</h3>
            {AboutWebinar.highlights && <RichTextDisplay content={AboutWebinar.highlights} />}
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Only visible on large screens */}
      <div className="hidden lg:block w-full">
        <div className="bg-dark-blue/30 not-dark:bg-vibrant-blue/40 border border-dark-blue rounded-xl p-6 px-5 top-6">
          <h3 className="text-xl font-bold mb-6 text-foreground">কোর্স বিষয়বস্তু</h3>
          {AboutWebinar.highlights && <RichTextDisplay content={AboutWebinar.highlights} />}
        </div>
      </div>
    </>
  );
}
