import { z } from 'zod';

// Common schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// User schemas
export const createUserSchema = z.object({
  supabaseId: z.string().min(1, 'Supabase ID is required'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).default('STUDENT'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
});

// Course schemas
export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  instructorId: z.string().min(1, 'Instructor ID is required'),
  published: z.boolean().default(false),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
});

export const courseQuerySchema = paginationSchema.extend({
  published: z.coerce.boolean().optional(),
  instructorId: z.string().optional(),
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
