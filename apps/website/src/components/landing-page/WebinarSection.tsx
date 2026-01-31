'use client';
import React, { useCallback, useEffect, useState } from 'react';
import WebinarCard from '@/components/webinar/WebinarCard/WebinarCard';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Calendar, Video, Sparkles } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';
import { useAppStore } from '@/lib/zustand/app-store';

export default function WebinarSection() {
  const { t } = useLocale();
  const pageText = t('landing');
  const { webinars } = useAppStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { align: 'start' },
      '(min-width: 1024px)': { align: 'start' },
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Empty state component
  const EmptyState = () => (
    <div className="w-full px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-linear-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl"></div>
          <div className="relative bg-linear-to-br from-purple-500/10 to-blue-500/10 rounded-full p-6 backdrop-blur-sm border border-purple-500/20">
            <Video className="w-12 h-12 text-purple-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-3 bg-linear-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
          No Webinars Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          We&apos;re preparing exciting webinars for you. Check back soon to discover upcoming
          sessions with industry experts!
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Coming Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Stay Tuned</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full py-16 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-linear-to-b from-[#C3C0D8] via-[#9B90DF] to-[#7361E5] text-transparent bg-clip-text">
            {pageText['webinar_heading']}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Join our expert-led webinars and expand your knowledge
          </p>
        </div>

        {webinars.length > 0 ? (
          <div className="relative">
            {/* Gradient Overlays for better visual depth */}
            <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none hidden sm:block"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none hidden sm:block"></div>

            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 md:gap-6 py-4">
                {webinars.map((webinar, idx) => (
                  <div
                    key={webinar.id}
                    className="flex-[0_0_90%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 transition-all duration-300 ease-out"
                  >
                    <div
                      className={`
                        transition-all duration-300 ease-out
                        ${selectedIndex === idx ? 'scale-100 opacity-100' : 'scale-95 opacity-75 hover:scale-98 hover:opacity-90'}
                      `}
                    >
                      <WebinarCard
                        imageUrl={webinar.image || undefined}
                        category={webinar.category?.title}
                        title={webinar.title}
                        webinarId={webinar.id}
                        endDate={webinar.scheduleDateTime}
                        feeType={webinar.feeType}
                        price={webinar.price}
                        maxDiscount={webinar.maxDiscount}
                        showShadow={selectedIndex === idx}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons - Hidden on mobile for better UX */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={`
                hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 
                w-12 h-12 rounded-full items-center justify-center
                bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl
                border border-gray-200 dark:border-gray-700
                transition-all duration-300 z-20 cursor-pointer
                ${canScrollPrev ? 'opacity-100 hover:scale-110' : 'opacity-40 cursor-not-allowed'}
              `}
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`
                hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 
                w-12 h-12 rounded-full items-center justify-center
                bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl
                border border-gray-200 dark:border-gray-700
                transition-all duration-300 z-20 cursor-pointer
                ${canScrollNext ? 'opacity-100 hover:scale-110' : 'opacity-40 cursor-not-allowed'}
              `}
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Pagination Dots */}
            {scrollSnaps.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 md:mt-10">
                {scrollSnaps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    className={`
                      h-2 rounded-full transition-all duration-300 cursor-pointer
                      ${
                        idx === selectedIndex
                          ? 'w-8 bg-linear-to-r from-purple-500 to-blue-500'
                          : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }
                    `}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Mobile scroll indicator */}
            <div className="md:hidden text-center mt-6 text-xs text-gray-400">
              <p className="flex items-center justify-center gap-2">
                <span className="inline-block w-6 h-0.5 bg-linear-to-r from-transparent via-gray-400 to-transparent"></span>
                Swipe to explore more
                <span className="inline-block w-6 h-0.5 bg-linear-to-r from-transparent via-gray-400 to-transparent"></span>
              </p>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
