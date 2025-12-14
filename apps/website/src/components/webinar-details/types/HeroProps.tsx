import { StaticImageData } from 'next/image';

export interface HeroProps {
  title: string;
  subtitle: string;
  sessionDate: string; // e.g., "১৫ ডিসেম্বর, ২০২৫"
  sessionTime: string; // e.g., "রাত ৮:০০ PM"
  duration: string; // e.g., "২ ঘণ্টা"
  totalRegistered: number | 0;
  isLive?: boolean;
  isFree: boolean;
  price?: string;
  deletedPrice?: string;
  videoThumbnail: string;
  bgImage?: string | StaticImageData;
  platform?: string; // e.g., "Zoom", "Google Meet"
}
