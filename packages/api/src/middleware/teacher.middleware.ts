import { type Request, type Response, type NextFunction } from 'express';
import { prisma, UserRole } from '@repo/db';
import { ForbiddenError, NotFoundError } from '../utils/errors.js';

export async function validateTeacherCourseAccess(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const courseId = req.params.id;
    const supabaseId = req.user?.supabaseId;
    const userRole = req.user?.role;

    if (!supabaseId) {
      throw new ForbiddenError('User not authenticated');
    }

    if (!courseId) {
      throw new NotFoundError('Course ID not provided');
    }

    if (userRole === UserRole.ADMIN) {
      return next();
    }

    const teacher = await prisma.teacher.findUnique({
      where: { supabaseId },
      select: { id: true },
    });

    if (!teacher) {
      throw new ForbiddenError('Teacher profile not found');
    }

    const courseTeacher = await prisma.courseTeacher.findUnique({
      where: {
        courseId_teacherId: {
          courseId,
          teacherId: teacher.id,
        },
      },
    });

    if (!courseTeacher) {
      throw new ForbiddenError('Access denied. You are not assigned to this course.');
    }

    req.teacher = { id: teacher.id };
    req.courseId = courseId;

    next();
  } catch (error) {
    next(error);
  }
}
