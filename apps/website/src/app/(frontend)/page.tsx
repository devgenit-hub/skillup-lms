import React from 'react';
import LandingHero from '@/components/landing-page/LandingHero';
import LogoMarquee from '@/components/landing-page/LogoMarquee';
import OurCourses from '@/components/landing-page/OurCourses';
import WebinarSection from '@/components/landing-page/WebinarSection';
import SkillSection from '@/components/landing-page/SkillSection';
import JoiningProcess from '@/components/landing-page/JoiningProcess';
import FaQ from '@/components/landing-page/FaQ';
import LandingPageFaQ from '@/components/landing-page/LandingPageFaQ';

// Move outside component to avoid recreation on every render
const LOGO_URL_LIST: string[] = [
  '/icons/Marquee/Express.png',
  '/icons/Marquee/Infinity.png',
  '/icons/Marquee/PN.png',
  '/icons/Marquee/Studio.png',
  '/icons/Marquee/Hookoom.png',
  '/icons/Marquee/Shining.png',
] as const;

function Home() {
  return (
    <>
      <LandingHero />
      <LogoMarquee logoUrlList={LOGO_URL_LIST} />
      <OurCourses />
      <WebinarSection />
      <SkillSection />
      <JoiningProcess />
      <FaQ />
      {/* <Testimonial /> */}
      <LandingPageFaQ />
    </>
  );
}

export default Home;
