import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '@repo/db';
import { supabaseAdmin } from '../config/supabase.js';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  try {
    token = req.cookies?.access_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const {
      data: { user: supabaseUser },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
      res.status(401).json({ error: error?.message || 'Invalid token' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!user) {
      res.status(401).json({
        error: 'User not found',
        code: 'USER_NOT_SYNCED',
        message: 'Please log in again to sync your account',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.cookies?.access_token;

  if (!token) {
    next();
    return;
  }

  try {
    const {
      data: { user: supabaseUser },
    } = await supabaseAdmin.auth.getUser(token);

    if (supabaseUser) {
      const user = await prisma.user.findUnique({
        where: { supabaseId: supabaseUser.id },
      });

      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Silent fail for optional auth
  }

  next();
}
