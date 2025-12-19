import { type Request, type Response } from 'express';
import { prisma } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  paginationSchema,
  idParamSchema,
} from '../schemas/index.js';

export class EnrollmentController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const query = paginationSchema.parse(req.query);

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          course: {
            select: { id: true, title: true },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      prisma.enrollment.count(),
    ]);

    ApiResponse.paginated(res, enrollments, {
      page: query.page,
      limit: query.limit,
      total,
    });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        course: {
          include: {
            lessons: {
              where: { published: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment');
    }

    ApiResponse.success(res, enrollment);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = createEnrollmentSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new NotFoundError('Course');
    }

    if (!course.published) {
      throw new ConflictError('Cannot enroll in unpublished course');
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: data.userId,
          courseId: data.courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new ConflictError('User is already enrolled in this course');
    }

    const enrollment = await prisma.enrollment.create({
      data,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        course: {
          select: { id: true, title: true },
        },
      },
    });

    ApiResponse.created(res, enrollment, 'Enrollment created successfully');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateEnrollmentSchema.parse(req.body);

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!existingEnrollment) {
      throw new NotFoundError('Enrollment');
    }

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        ...data,
        ...(data.status === 'COMPLETED' && { completedAt: new Date() }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        course: {
          select: { id: true, title: true },
        },
      },
    });

    ApiResponse.success(res, enrollment, 'Enrollment updated successfully');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!existingEnrollment) {
      throw new NotFoundError('Enrollment');
    }

    await prisma.enrollment.delete({
      where: { id },
    });

    ApiResponse.noContent(res);
  });
}
