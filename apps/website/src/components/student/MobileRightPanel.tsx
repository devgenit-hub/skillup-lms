'use client';
import React, { useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import UpcomingLive from './UpcomingLive';

interface MobileRightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileRightPanel({ isOpen, onClose }: MobileRightPanelProps) {
  const date = new Date();

  // Prevent body scroll when panel is open
  useEffect(() => {
    // if (isOpen) {
    //   document.body.style.overflow = 'hidden';
    // } else {
    //   document.body.style.overflow = '';
    // }
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full p-4 bg-linear-to-br from-background via-background to-muted/20 overflow-y-auto">
          <div className="space-y-5">
            <div className="bg-card backdrop-blur-xl rounded-3xl shadow-lg border border-border p-4">
              <Calendar
                mode="single"
                selected={date}
                className="rounded-2xl w-full"
                captionLayout="label"
              />
            </div>
            <UpcomingLive />
          </div>
        </div>
      </div>
    </>
  );
}
