import { type Request, type Response } from 'express';
import { prisma } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import {
  createCourseSchema,
  updateCourseSchema,
  courseQuerySchema,
  idParamSchema,
} from '../schemas/index.js';

export class CourseController {
  // Get all courses with pagination and filters
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const query = courseQuerySchema.parse(req.query);

    const where = {
      ...(query.published !== undefined && { published: query.published }),
      ...(query.instructorId && { instructorId: query.instructorId }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { enrollments: true, lessons: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ]);

    ApiResponse.paginated(res, courses, {
      page: query.page,
      limit: query.limit,
      total,
    });
  });

  // Get single course by ID
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true },
        },
        lessons: {
          orderBy: { order: 'asc' },
          where: { published: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundError('Course');
    }

    ApiResponse.success(res, course);
  });

  // Create new course
  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = createCourseSchema.parse(req.body);

    // Verify instructor exists
    const instructor = await prisma.user.findUnique({
      where: { id: data.instructorId },
    });

    if (!instructor) {
      throw new NotFoundError('Instructor');
    }

    if (instructor.role !== 'INSTRUCTOR' && instructor.role !== 'ADMIN') {
      throw new ConflictError('User must be an instructor to create courses');
    }

    const course = await prisma.course.create({
      data,
      include: {
        instructor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    ApiResponse.created(res, course, 'Course created successfully');
  });

  // Update course
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateCourseSchema.parse(req.body);

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundError('Course');
    }

    const course = await prisma.course.update({
      where: { id },
      data,
      include: {
        instructor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    ApiResponse.success(res, course, 'Course updated successfully');
  });

  // Delete course
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundError('Course');
    }

    await prisma.course.delete({
      where: { id },
    });

    ApiResponse.noContent(res);
  });
}
