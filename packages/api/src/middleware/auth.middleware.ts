import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';
import { SUPABASE_JWT_SECRET } from '../config/supabase.js';

interface SupabaseJWTPayload {
  sub: string;
  email?: string;
  role?: string;
  aud?: string;
  exp?: number;
}

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

    if (!SUPABASE_JWT_SECRET) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET) as SupabaseJWTPayload;

    if (!decoded.sub) {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { supabaseId: decoded.sub },
      include: {
        _count: {
          select: { enrollments: true, courses: true },
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
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
        message: 'Please refresh your session',
      });
      return;
    }

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
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
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET) as SupabaseJWTPayload;
    const user = await prisma.user.findUnique({
      where: { supabaseId: decoded.sub },
    });

    if (user) {
      req.user = user;
    }
  } catch {
    // Continue without user if auth fails
  }

  next();
}
