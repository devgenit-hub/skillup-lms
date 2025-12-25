import { z } from 'zod';
import { paginationSchema } from './index.js';

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const updateStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const suspendStudentSchema = z.object({
  reason: z.string().min(1, 'Suspension reason is required'),
});

export const deleteStudentSchema = z.object({
  confirmId: z.string().min(1, 'Student ID confirmation is required'),
});

export const studentQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  courseId: z.string().optional(),
  status: z.enum(['active', 'suspended', 'all']).optional(),
});
