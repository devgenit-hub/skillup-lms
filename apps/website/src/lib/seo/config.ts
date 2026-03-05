import type { Metadata } from 'next';

// Site Configuration Constants
export const SITE_NAME = 'Skill শিখো';
export const SITE_URL = 'https://www.skillshikho.com';
export const SITE_DESCRIPTION =
  'Skill শিখো - বাংলাদেশের সেরা অনলাইন লার্নিং প্ল্যাটফর্ম। ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন, ডিজিটাল মার্কেটিং সহ বিভিন্ন স্কিল শিখুন।';
export const META_BANNER = `${SITE_URL}/metabanner.png`;

// Page-specific Metadata Configurations
export const PAGE_METADATA: Record<string, Metadata> = {
  home: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    alternates: { canonical: SITE_URL },
  },
  about: {
    title: 'আমাদের সম্পর্কে',
    description:
      'Skill শিখো সম্পর্কে জানুন - বাংলাদেশের অন্যতম সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম যেখানে আপনি দক্ষতা অর্জন করতে পারবেন।',
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
      title: 'আমাদের সম্পর্কে | Skill শিখো',
      description: 'Skill শিখো সম্পর্কে জানুন - বাংলাদেশের অন্যতম সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম।',
      url: `${SITE_URL}/about`,
    },
  },
  allcourse: {
    title: 'সকল কোর্স',
    description:
      'Skill শিখোতে সকল কোর্স দেখুন - ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন, ডিজিটাল মার্কেটিং এবং আরও অনেক কোর্স।',
    alternates: { canonical: `${SITE_URL}/allcourse` },
    openGraph: {
      title: 'সকল কোর্স | Skill শিখো',
      description: 'Skill শিখোতে সকল কোর্স দেখুন এবং আপনার পছন্দের কোর্সে এনরোল করুন।',
      url: `${SITE_URL}/allcourse`,
    },
  },
  career: {
    title: 'ক্যারিয়ার',
    description: 'Skill শিখো টিমে যোগ দিন এবং বাংলাদেশে শিক্ষাকে এগিয়ে নিয়ে যেতে সাহায্য করুন।',
    alternates: { canonical: `${SITE_URL}/career` },
    openGraph: {
      title: 'ক্যারিয়ার | Skill শিখো',
      description: 'Skill শিখো টিমে যোগ দিন এবং শিক্ষাকে এগিয়ে নিয়ে যেতে সাহায্য করুন।',
      url: `${SITE_URL}/career`,
    },
  },
  webinar: {
    title: 'ওয়েবিনার',
    description: 'Skill শিখোর ফ্রি ওয়েবিনারে অংশ নিন এবং ইন্ডাস্ট্রি বিশেষজ্ঞদের কাছ থেকে শিখুন।',
    alternates: { canonical: `${SITE_URL}/webinar` },
    openGraph: {
      title: 'ওয়েবিনার | Skill শিখো',
      description: 'Skill শিখোর ফ্রি ওয়েবিনারে অংশ নিন এবং বিশেষজ্ঞদের কাছ থেকে শিখুন।',
      url: `${SITE_URL}/webinar`,
    },
  },
  contact: {
    title: 'যোগাযোগ',
    description: 'Skill শিখোর সাথে যোগাযোগ করুন। আমরা আপনার সেবায় সদা প্রস্তুত।',
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
      title: 'যোগাযোগ | Skill শিখো',
      description: 'Skill শিখোর সাথে যোগাযোগ করুন।',
      url: `${SITE_URL}/contact`,
    },
  },
  privacy: {
    title: 'গোপনীয়তা নীতি',
    description: 'Skill শিখোর গোপনীয়তা নীতি সম্পর্কে জানুন।',
    alternates: { canonical: `${SITE_URL}/privacy` },
  },
  terms: {
    title: 'শর্তাবলী',
    description: 'Skill শিখোর ব্যবহারের শর্তাবলী পড়ুন।',
    alternates: { canonical: `${SITE_URL}/terms` },
  },
};

// Helper function to generate page metadata
export function generatePageMetadata(page: keyof typeof PAGE_METADATA): Metadata {
  return PAGE_METADATA[page] ?? PAGE_METADATA.home!;
}
