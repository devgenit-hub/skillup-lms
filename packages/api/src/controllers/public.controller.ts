import { type Request, type Response } from 'express';
import { prisma } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError } from '../utils/errors.js';

interface CourseMetadata {
  level?: string;
  heroImage?: string;
  courseType?: string;
  batchNo?: string;
  [key: string]: unknown;
}

export class PublicController {
  static getInitialData = asyncHandler(async (_req: Request, res: Response) => {
    const [coursesRaw, webinarsRaw, categories] = await Promise.all([
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
          coupons: {
            select: { discount: true },
            where: {
              active: true,
            },
            orderBy: { discount: 'desc' },
            take: 1,
          },
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
          coupons: {
            select: { discount: true },
            where: {
              active: true,
            },
            orderBy: { discount: 'desc' },
            take: 1,
          },
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
        maxDiscount: course.coupons[0]?.discount || null,
        _count: course._count,
      };
    });

    const webinars = webinarsRaw.map(({ coupons, ...webinarRest }) => {
      const maxDiscount = coupons[0]?.discount || null;

      const finalData = {
        ...webinarRest,
        maxDiscount: maxDiscount,
      };

      return finalData;
    });

    ApiResponse.success(res, { courses, webinars, categories });
  });

  // Get public course details by ID (no sensitive data exposed)
  static getCourseDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const now = new Date();

    const course = await prisma.course.findFirst({
      where: { id, published: true },
      select: {
        id: true,
        title: true,
        description: true,
        feeType: true,
        price: true,
        metadata: true,
        introVideoLink: true,
        category: { select: { id: true, title: true, slug: true } },
        courseTeachers: {
          select: {
            teacher: {
              select: {
                id: true,
                name: true,
                profileImage: true,
                specialization: true,
                phone: true,
              },
            },
          },
        },
        curriculumModules: {
          select: {
            id: true,
            title: true,
            details: true,
            order: true,
            _count: { select: { classes: true, materials: true } },
          },
          orderBy: { order: 'asc' },
        },
        coupons: {
          where: { active: true, expiresAt: { gte: now } },
          orderBy: { discount: 'desc' },
          select: {
            code: true,
            discount: true,
            title: true,
            usageCount: true,
            maxUsage: true,
            expiresAt: true,
          },
        },
        _count: { select: { enrollments: true, curriculumModules: true } },
      },
    });

    if (!course) throw new NotFoundError('Course');

    const metadata = (course.metadata || {}) as {
      batchNo?: string;
      heroImage?: string;
      courseType?: 'live' | 'recorded';
      level?: 'beginner' | 'intermediate' | 'advanced';
      aboutCourse?: { about?: string; details?: string };
      numClasses?: number;
      classRoutinePdf?: string;
      facebookGroupLink?: string;
      [key: string]: unknown;
    };

    const contactNumbers = course.courseTeachers
      .map((ct) => ct.teacher.phone)
      .filter((p): p is string => !!p)
      .slice(0, 2);

    const coupons = course.coupons.map((c) => ({
      code: c.code,
      discount: `${c.discount}%`,
      title: c.title || '',
      expiresAt: c.expiresAt,
    }));

    const courseDetails = {
      id: course.id,
      title: course.title,
      description: course.description,
      batchNo: metadata.batchNo || '',
      heroImage: metadata.heroImage || '',
      courseType: metadata.courseType || 'live',
      level: metadata.level || 'beginner',
      feeType: course.feeType,
      price: course.price,
      category: course.category,
      numClasses: metadata.numClasses || 0,
      totalStudents: course._count.enrollments,
      totalModules: course._count.curriculumModules,
      aboutCourse: {
        about: metadata.aboutCourse?.about || '',
        details: metadata.aboutCourse?.details || '',
      },
      teachers: course.courseTeachers.map((ct) => ({
        id: ct.teacher.id,
        name: ct.teacher.name,
        profileImage: ct.teacher.profileImage,
        specialization: ct.teacher.specialization,
      })),
      curriculum: course.curriculumModules.map((m) => ({
        id: m.id,
        title: m.title,
        details: m.details,
        order: m.order,
        classesCount: m._count.classes,
        materialsCount: m._count.materials,
      })),
      classRoutinePdf: metadata.classRoutinePdf || null,
      coupons,
      facebookGroupLink: metadata.facebookGroupLink || null,
      introVideoLink: course.introVideoLink || null,
      contactNumbers,
    };

    ApiResponse.success(res, courseDetails);
  });

  static getWebinarDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const webinar = await prisma.webinar.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        scheduleDateTime: true,
        duration: true,
        feeType: true,
        price: true,
        status: true,
        platform: true,
        sessionHighlights: true,
        aboutWebinar: true,
        speakers: true,
        sessionAgenda: true,
        resources: true,
        coupons: {
          where: { active: true },
          orderBy: { discount: 'desc' },
          select: {
            code: true,
            discount: true,
            title: true,
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!webinar) {
      throw new NotFoundError('Webinar');
    }

    ApiResponse.success(res, webinar);
  });
}
