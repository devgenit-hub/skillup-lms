import { type Request, type Response } from 'express';
import { prisma } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

interface CourseMetadata {
  level?: string;
  heroImage?: string;
  courseType?: string;
  batchNo?: string;
  [key: string]: unknown;
}

export class PublicController {
  static getInitialData = asyncHandler(async (_req: Request, res: Response) => {
    const [coursesRaw, webinars, categories] = await Promise.all([
      prisma.course.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          feeType: true,
          price: true,
          metadata: true,
          category: { select: { id: true, title: true, slug: true } },
          _count: { select: { enrollments: true, curriculumModules: true } },
        },
        take: 9,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.webinar.findMany({
        where: { status: { in: ['upcoming', 'live'] } },
        select: {
          id: true,
          title: true,
          image: true,
          category: { select: { id: true, title: true, slug: true } },
          scheduleDateTime: true,
          duration: true,
          feeType: true,
          price: true,
          status: true,
          _count: { select: { registrations: true } },
        },
        take: 9,
        orderBy: { scheduleDateTime: 'asc' },
      }),
      prisma.category.findMany({
        select: { id: true, title: true, slug: true, courseCount: true, webinarCount: true },
        orderBy: { title: 'asc' },
      }),
    ]);

    const courses = coursesRaw.map((course) => {
      const metadata = (course.metadata || {}) as CourseMetadata;
      return {
        id: course.id,
        title: course.title,
        image: metadata.heroImage || null,
        feeType: course.feeType,
        price: course.price,
        category: course.category,
        level: metadata.level || null,
        courseType: metadata.courseType || null,
        batchNo: metadata.batchNo || null,
        _count: course._count,
      };
    });

    ApiResponse.success(res, { courses, webinars, categories });
  });
}
