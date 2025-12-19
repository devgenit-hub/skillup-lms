import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { prisma } from '@repo/db';
import { UserRole } from '@repo/db';
import { AppError } from '../utils/errors.js';

export const getInstructorStudents = asyncHandler(async (req: Request, res: Response) => {
  const instructorId = req.user!.id;
  const { courseId } = req.query;

  const students = await prisma.user.findMany({
    where: {
      role: UserRole.STUDENT,
      enrollments: {
        some: {
          course: courseId ? { id: courseId as string, instructorId } : { instructorId },
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      suspended: true,
      suspendedAt: true,
      suspensionReason: true,
      enrollments: {
        where: {
          course: courseId ? { id: courseId as string, instructorId } : { instructorId },
        },
        include: {
          course: {
            select: { id: true, title: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: students,
  });
});

export const suspendStudent = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { reason } = req.body;
  const instructorId = req.user!.id;

  const student = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: { course: true },
      },
    },
  });

  if (!student || student.role !== UserRole.STUDENT) {
    throw new AppError(404, 'Student not found');
  }

  const hasAccess = student.enrollments.some((e) => e.course.instructorId === instructorId);
  if (!hasAccess) {
    throw new AppError(403, 'Not authorized to suspend this student');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      suspended: true,
      suspendedAt: new Date(),
      suspendedBy: instructorId,
      suspensionReason: reason,
    },
  });

  res.json({
    success: true,
    data: updated,
    message: 'Student suspended successfully',
  });
});

export const unsuspendStudent = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const instructorId = req.user!.id;

  const student = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: { course: true },
      },
    },
  });

  if (!student || student.role !== UserRole.STUDENT) {
    throw new AppError(404, 'Student not found');
  }

  const hasAccess = student.enrollments.some((e) => e.course.instructorId === instructorId);
  if (!hasAccess) {
    throw new AppError(403, 'Not authorized to unsuspend this student');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      suspended: false,
      suspendedAt: null,
      suspendedBy: null,
      suspensionReason: null,
    },
  });

  res.json({
    success: true,
    data: updated,
    message: 'Student unsuspended successfully',
  });
});

export const getStudentPayments = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const instructorId = req.user!.id;

  const student = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: { course: true },
      },
    },
  });

  if (!student || student.role !== UserRole.STUDENT) {
    throw new AppError(404, 'Student not found');
  }

  const hasAccess = student.enrollments.some((e) => e.course.instructorId === instructorId);
  if (!hasAccess) {
    throw new AppError(403, 'Not authorized to view this student payments');
  }

  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: payments,
  });
});
