import { type Request, type Response, type NextFunction } from 'express';
import { UserRole } from '@repo/db';

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticate middleware
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Shorthand middleware for common roles
 */
export const requireStudent = requireRole(['STUDENT']);
export const requireInstructor = requireRole(['INSTRUCTOR', 'ADMIN']);
export const requireAdmin = requireRole(['ADMIN']);
