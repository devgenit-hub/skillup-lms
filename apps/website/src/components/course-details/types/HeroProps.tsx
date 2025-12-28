import { StaticImageData } from 'next/image';

export interface HeroProps {
  title: string;
  subtitle: string;
  totalStudents: number;
  totalModules: number;
  batch: string;
  rating: number;
  totalReviews: number;
  price: string;
  deletedPrice?: string;
  videoThumbnail: string;
  bgImage?: string | StaticImageData;
  coupons?: Array<{ code: string; discount: string; title: string }>;
  couponCount?: number;
  introVideoLink?: string | null;
}
