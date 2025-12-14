'use client';

import React from 'react';
import Image from 'next/image';

const steps = [
  {
    icon: '/UI/LandingPage/card.svg',
    title: 'একটি অ্যাকাউন্ট তৈরি করুন',
    description:
      'প্রথমে আমাদের প্ল্যাটফর্মে আপনার অ্যাকাউন্টটি তৈরি করুন এবং আপনার শিক্ষার যাত্রার জন্য প্রয়োজনীয় তথ্য সংযোজন করুন।',
  },
  {
    icon: '/UI/LandingPage/search.svg',
    title: 'কোর্স নির্বাচন করুন',
    description:
      'আপনার পছন্দের এক বা একাধিক কোর্স বেছে নিন এবং যেগুলো আপনার লক্ষ্য অর্জনে সহায়ক মনে হয় সেগুলো নির্বাচন করুন।',
  },
  {
    icon: '/UI/LandingPage/check.svg',
    title: 'নির্বাচিত কোর্সে ভর্তি হোন',
    description:
      'নির্বাচিত কোর্সে ভর্তি হতে অর্থ প্রদান করুন, এবং তারপর ক্লাসে অংশগ্রহণ শুরু করুন।',
  },
  {
    icon: '/UI/LandingPage/dashboard.svg',
    title: 'কোর্স ড্যাশবোর্ড খুলুন',
    description:
      'আপনার কোর্স ড্যাশবোর্ডে লগইন করুন, প্রগতি ট্র্যাক করুন এবং অন্যান্য শিক্ষার্থীদের সাথে সংযুক্ত থাকুন।',
  },
];

export default function JoiningProcess() {
  const svgClass = 'hidden md:block scale-150';

  return (
    <section className="container mx-auto my-20">
      {/* Section Title */}
      <h2 className="text-center text-xl md:text-2xl font-bold bg-gradient-to-b from-[#C3C0D8] via-[#9B90DF] to-[#7361E5] text-transparent bg-clip-text py-8 mb-8">
        কোর্সে যোগদানের ধাপসমূহ
      </h2>

      {/* Steps Grid - Modified for equal width and horizontal flow */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-0">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`bg-vibrant-blue/10 p-5 rounded-3xl border border-white/10 flex flex-col gap-10 w-full md:w-1/4 min-h-[300px] ${
                idx % 2 !== 0 ? 'md:flex-col-reverse mt-10 md:mt-0' : ''
              } ${idx > 0 ? 'mt-8 md:mt-0' : ''}`}
            >
              <div>
                <h3 className="font-bold mb-6 text-sm">{step.title}</h3>
                <p className="dark:text-white/80 text-black/80 text-xs">{step.description}</p>
              </div>

              {/* Icon Container with Glow Effect */}
              <div className="relative w-20 h-20 mx-auto my-4">
                {/* Outer Glow Effect (blur and pulse) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-vibrant-blue/20 blur-xl animate-pulse"></div>
                </div>
                {/* Icon Image */}
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={64}
                  height={64}
                  className="relative z-10 p-2 flex items-center justify-center h-full w-full"
                />
                {/* Solid Circular Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {idx % 2 == 0 && (
                    <div className="w-20 h-20 scale-120 rounded-full bg-vibrant-blue/20"></div>
                  )}
                  {idx % 2 == 1 && (
                    <div className="w-20 h-20 scale-120 rounded-full border border-vibrant-blue/20 border-dashed">
                      <div className="w-20 h-20 scale-120 rounded-full border border-vibrant-blue/20 border-dashed"></div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-vibrant-blue/80 blur-3xl opacity-50 z-[-1] pointer-events-none"></div>
              </div>
            </div>

            {/* SVG Connector - Show only between cards and not after the last one */}
            {idx < steps.length - 1 &&
              (idx % 2 === 0 ? (
                // Connector for step 1 -> 2 and 3 -> 4 (Downward curve)
                <svg
                  className={svgClass}
                  width="100" // Increased size
                  height="100" // Increased size
                  viewBox="0 0 76 130"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-2.0504e-05 124.334C-2.0504e-05 127.279 2.38779 129.667 5.33331 129.667C8.27883 129.667 10.6666 127.279 10.6666 124.334C10.6666 121.388 8.27883 119 5.33331 119C2.38779 119 -2.0504e-05 121.388 -2.0504e-05 124.334ZM64.5 5.3335C64.5 8.27901 66.8878 10.6668 69.8333 10.6668C72.7788 10.6668 75.1666 8.27901 75.1666 5.3335C75.1666 2.38798 72.7788 0.000162601 69.8333 0.000162601C66.8878 0.000162601 64.5 2.38798 64.5 5.3335ZM5.33331 124.334L5.33331 125.334L24.3333 125.333V124.333V123.333L5.33331 123.334L5.33331 124.334ZM39.3333 109.334H40.3333V20.3335H39.3333H38.3333V109.334H39.3333ZM54.332 5.3335V6.3335C59.2712 6.3335 64.7436 6.3335 69.8333 6.3335V5.3335V4.3335C64.7713 4.3335 59.2435 4.3335 54.332 4.3335V5.3335ZM39.3333 20.3335H40.3333C40.3333 12.6014 46.6001 6.3335 54.332 6.3335V5.3335V4.3335C45.4953 4.3335 38.3333 11.4971 38.3333 20.3335H39.3333ZM24.3333 124.333V125.333C33.1699 125.333 40.3333 118.17 40.3333 109.334H39.3333H38.3333C38.3333 117.065 32.0653 123.333 24.3333 123.333V124.333Z"
                    fill="#875EFF"
                  />
                </svg>
              ) : (
                // Connector for step 2 -> 3 (Upward curve)
                <svg
                  className={svgClass}
                  width="100" // Increased size
                  height="100" // Increased size
                  viewBox="0 0 76 130"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M75.1667 124.334C75.1667 127.279 72.7789 129.667 69.8334 129.667C66.8879 129.667 64.5 127.279 64.5 124.334C64.5 121.388 66.8879 119 69.8334 119C72.7789 119 75.1667 121.388 75.1667 124.334ZM10.6667 5.3335C10.6667 8.27901 8.27889 10.6668 5.33337 10.6668C2.38786 10.6668 3.8147e-05 8.27901 3.8147e-05 5.3335C3.8147e-05 2.38798 2.38786 0.000162601 5.33337 0.000162601C8.27889 0.000162601 10.6667 2.38798 10.6667 5.3335ZM69.8334 124.334L69.8334 125.334L50.8334 125.333V124.333V123.333L69.8334 123.334L69.8334 124.334ZM35.8334 109.334H34.8334V20.3335H35.8334H36.8334V109.334H35.8334ZM20.8347 5.3335V6.3335C15.8955 6.3335 10.4231 6.3335 5.33337 6.3335V5.3335V4.3335C10.3954 4.3335 15.9232 4.3335 20.8347 4.3335V5.3335ZM35.8334 20.3335H34.8334C34.8334 12.6014 28.5666 6.3335 20.8347 6.3335V5.3335V4.3335C29.6714 4.3335 36.8334 11.4971 36.8334 20.3335H35.8334ZM50.8334 124.333V125.333C41.9968 125.333 34.8334 118.17 34.8334 109.334H35.8334H36.8334C36.8334 117.065 43.1014 123.333 50.8334 123.333V124.333Z"
                    fill="#875EFF"
                  />
                </svg>
              ))}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
