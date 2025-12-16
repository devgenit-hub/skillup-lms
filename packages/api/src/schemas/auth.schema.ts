import { z } from 'zod';

// Schema for syncing Supabase user to our database
export const syncUserSchema = z.object({
  supabaseId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  emailVerified: z.boolean().optional(),
  provider: z.enum(['EMAIL', 'GOOGLE']).optional(),
});

// Schema for updating user profile
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  avatarUrl: z.string().url().optional(),
  phone: z.string().optional(),
});

export type SyncUserInput = z.infer<typeof syncUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
