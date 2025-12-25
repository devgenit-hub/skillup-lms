import type { Curriculum } from '@/components/props/CourseProps';

export interface ClassItem {
  id: string;
  title: string;
  videoUrl?: string | undefined;
}

export interface MaterialItem {
  id: string;
  title: string;
  fileUrl?: string | null;
  file?: File | null;
}

export interface ExtendedModule extends Curriculum {
  id: string;
  classes: ClassItem[];
  materials: MaterialItem[];
  isOpen: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  title?: string | null;
  discount: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
  maxUses?: number | null;
}
