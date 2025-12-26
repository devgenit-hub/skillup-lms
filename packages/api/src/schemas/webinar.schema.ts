import { z } from 'zod';
import { paginationSchema } from './index.js';

export const createWebinarSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  categoryId: z.string().optional(),
  categoryTitle: z.string().optional(), // For creating new category inline
  image: z.string().optional(),
  scheduleDateTime: z.string().datetime(),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
  feeType: z.enum(['free', 'paid']).default('free'),
  price: z.number().min(0).optional(),
  platform: z.string().min(1, 'Platform is required'),
  status: z.enum(['draft', 'upcoming', 'live', 'completed']).default('draft'),
  sessionHighlights: z.string().optional(),
  aboutWebinar: z.string().optional(),
  speakers: z.array(z.any()).optional(),
  sessionAgenda: z.array(z.any()).optional(),
  resources: z.array(z.any()).optional(),
  liveLink: z.string().url().optional().or(z.literal('')),
});

export const updateWebinarSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  categoryId: z.string().optional(),
  categoryTitle: z.string().optional(), // For creating new category inline
  image: z.string().optional(),
  scheduleDateTime: z.string().datetime().optional(),
  duration: z.number().int().min(1).optional(),
  feeType: z.enum(['free', 'paid']).optional(),
  price: z.number().min(0).optional(),
  platform: z.string().optional(),
  status: z.enum(['draft', 'upcoming', 'live', 'completed']).optional(),
  sessionHighlights: z.string().optional(),
  aboutWebinar: z.string().optional(),
  speakers: z.array(z.any()).optional(),
  sessionAgenda: z.array(z.any()).optional(),
  resources: z.array(z.any()).optional(),
  liveLink: z.string().url().optional().or(z.literal('')),
});

export const webinarQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(['draft', 'upcoming', 'live', 'completed', 'all']).optional(),
  category: z.string().optional(),
  feeType: z.enum(['free', 'paid']).optional(),
});
