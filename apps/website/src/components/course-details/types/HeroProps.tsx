import { StaticImageData } from 'next/image';

export interface HeroProps {
  title: string;
  subtitle: string;
  totalStudents: number;
  totalClasses: number;
  batch: string;
  rating: number;
  totalReviews: number;
  price: string;
  deletedPrice: string;
  videoThumbnail: string;
  bgImage?: string | StaticImageData;
}
