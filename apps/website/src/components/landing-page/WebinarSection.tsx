'use client';
import React, { useCallback, useEffect, useState } from 'react';
import WebinarCard from '@/components/webinar/WebinarCard/WebinarCard';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocale } from '@/providers/locale-provider';

export default function WebinarSection() {
  const { t } = useLocale();
  const pageText = t('landing');
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
  });

  const [selectedIndex, setSelectedIndex] = useState(1);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.scrollTo(1, true);
    onSelect();
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const webinars = [
    {
      category: 'প্রোগ্রামিং',
      title: 'ইউজার এক্সপেরিয়েন্স ডিজাইন ফান্ডামেন্টালস',
      endDate: '',
      duration: '৪ দিন বাকি',
    },
    {
      category: 'প্রোগ্রামিং',
      title: 'ওয়েব ডেভেলপমেন্ট মাস্টারক্লাস',
      endDate: '',
      duration: '৩ দিন বাকি',
      imageUrl: '/UI/LandingPage/services.png',
    },
    {
      category: 'প্রোগ্রামিং',
      title: 'মোবাইল অ্যাপ ডেভেলপমেন্ট',
      endDate: '',
      duration: '৫ দিন বাকি',
    },
    {
      category: 'প্রোগ্রামিং',
      title: 'ডেটা সায়েন্স বেসিক',
      endDate: '',
      duration: '২ দিন বাকি',
    },
  ];

  return (
    <div className="container px-4 w-full max-w-7xl mx-auto mt-20 py-8">
      <div className="w-full">
        <h3 className="text-center font-bold text-2xl bg-linear-to-b from-[#C3C0D8] via-10% via-[#9B90DF] to-[#7361E5] text-transparent bg-clip-text">
          {pageText['webinar_heading']}
        </h3>
        <div className="relative">
          {/* <div className="absolute top-0 bottom-0 z-10 h-full w-1/3 from-background to-transparent left-0 bg-gradient-to-r pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 z-10 h-full w-1/3 from-background to-transparent right-0 bg-gradient-to-l pointer-events-none"></div> */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 px-10 py-14">
              {webinars.map((webinar, idx) => (
                <div
                  key={idx}
                  className={`
                    flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_35%] min-w-0
                    transition-transform duration-500 ease-out
                    ${selectedIndex === idx ? 'scale-100' : 'scale-75'}
                  `}
                >
                  <WebinarCard {...webinar} showShadow={selectedIndex === idx} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-20 not-dark:border not-dark:border-gray-100 cursor-pointer"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-6 h-6 dark:text-white text-black" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all z-20 not-dark:border not-dark:border-gray-100 cursor-pointer"
            aria-label="Next slide"
          >
            <ArrowRight className="w-6 h-6 dark:text-white text-black" />
          </button>

          <div className="flex justify-center gap-2 mt-10">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${
                    idx === selectedIndex
                      ? 'w-8 bg-foreground'
                      : 'w-2 bg-foreground/70 hover:bg-gray-400'
                  }
                `}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
