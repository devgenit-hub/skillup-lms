import { createClient } from '@supabase/supabase-js';

// Supabase admin client for JWT verification only
// Never use this for user operations - that's frontend's job
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// JWT secret for manual verification (alternative to Supabase client)
export const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';
