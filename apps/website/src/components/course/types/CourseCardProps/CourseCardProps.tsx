export interface CourseCardProps {
  imageUrl: string;
  courseId?: number | string;
  batchNo?: string;
  rating?: number;
  category?: string;
  title?: string;
  studentsEnrolled?: string;
  totalSessions?: string;
  bgColor?: string;
  borderColor?: string;
  route?: string;
  feeType?: 'FREE' | 'PAID';
  price?: number | null;
  maxDiscount?: number | string | null;
}
