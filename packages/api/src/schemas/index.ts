import { z } from 'zod';
import { UserRole } from '@repo/db';

// Common schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(10),
});

// User schemas
export const createUserSchema = z.object({
  supabaseId: z.string().min(1, 'Supabase ID is required'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.nativeEnum(UserRole).optional(),
});

// Course fee type enum
export const feeTypeEnum = z.enum(['FREE', 'PAID']);

// Course schemas
export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  published: z.boolean().default(false),
  introVideoLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  feeType: feeTypeEnum.default('FREE'),
  price: z.number().positive('Price must be positive').optional().nullable(),
  categoryId: z.string().optional(),
  categoryTitle: z.string().optional(), // For creating new category inline
  metadata: z.any().optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
  introVideoLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  feeType: feeTypeEnum.optional(),
  price: z.number().positive('Price must be positive').optional().nullable(),
  categoryId: z.string().optional().nullable(),
  categoryTitle: z.string().optional(), // For creating new category inline
  metadata: z.any().optional(),
});

export const courseQuerySchema = paginationSchema.extend({
  published: z.coerce.boolean().optional(),
  teacherId: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  language: z.string().optional(),
  feeType: feeTypeEnum.optional(),
});

export const assignTeachersSchema = z.object({
  teacherIds: z
    .array(z.string().min(1, 'Teacher ID required'))
    .min(1, 'At least one teacher required'),
});

// Coupon schemas
export const createCouponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters'),
  title: z.string().max(100, 'Title cannot exceed 100 characters').optional(),
  discount: z
    .number()
    .min(1, 'Discount must be at least 1%')
    .max(100, 'Discount cannot exceed 100%'),
  expiresAt: z.string().datetime('Invalid expiration date'),
  maxUsage: z.number().positive('Max usage must be positive').optional(),
});

// Enrollment schemas
export const createEnrollmentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
});

export const updateEnrollmentSchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'DROPPED']).optional(),
  progress: z.number().int().min(0).max(100).optional(),
});

// Lesson schemas
export const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  order: z.number().int().min(1, 'Order must be at least 1'),
  courseId: z.string().min(1, 'Course ID is required'),
  published: z.boolean().default(false),
});

export const updateLessonSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().optional(),
  order: z.number().int().min(1).optional(),
  published: z.boolean().optional(),
});

// Curriculum Class schema
export const curriculumClassSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Class title is required'),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  duration: z.number().int().positive().optional().nullable(),
  order: z.number().int().min(0).default(0),
});

// Curriculum Material schema
export const curriculumMaterialSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Material title is required'),
  fileUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  fileType: z.string().optional().nullable(),
  fileSize: z.number().int().positive().optional().nullable(),
  order: z.number().int().min(0).default(0),
});

// Curriculum Module schema
export const curriculumModuleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Module title is required'),
  details: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
  classes: z.array(curriculumClassSchema).optional().default([]),
  materials: z.array(curriculumMaterialSchema).optional().default([]),
});

// Create curriculum module
export const createCurriculumModuleSchema = curriculumModuleSchema.omit({ id: true });

// Update curriculum module
export const updateCurriculumModuleSchema = curriculumModuleSchema.partial();

// Bulk update curriculum (save all modules at once)
export const updateCourseCurriculumSchema = z.object({
  modules: z.array(curriculumModuleSchema),
});
