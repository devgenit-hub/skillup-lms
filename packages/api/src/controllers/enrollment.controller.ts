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

  // Get authenticated user's enrolled courses with full details
  static getMyEnrollments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundError('User not authenticated');
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            introVideoLink: true,
            category: { select: { id: true, title: true } },
            feeType: true,
            price: true,
            _count: {
              select: {
                lessons: true,
                enrollments: true,
                curriculumModules: true,
              },
            },
            curriculumModules: {
              select: {
                _count: {
                  select: { classes: true },
                },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    // Calculate stats
    const totalEnrolled = enrollments.length;
    const completed = enrollments.filter((e) => e.status === 'COMPLETED').length;
    const inProgress = enrollments.filter((e) => e.status === 'ACTIVE').length;

    ApiResponse.success(res, {
      enrollments,
      stats: {
        total: totalEnrolled,
        completed,
        inProgress,
        remaining: totalEnrolled - completed,
      },
    });
  });

  // Get single enrolled course details with lessons/modules
  static getMyCourseDetails = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { courseId } = req.params;

    if (!userId || !courseId) {
      throw new NotFoundError('User not authenticated or course not specified');
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            category: { select: { id: true, title: true } },
            lessons: {
              where: { published: true },
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                content: true,
                order: true,
              },
            },
            curriculumModules: {
              orderBy: { order: 'asc' },
              include: {
                classes: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    videoUrl: true,
                    duration: true,
                    order: true,
                  },
                },
                materials: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    fileUrl: true,
                    fileType: true,
                    fileSize: true,
                    order: true,
                  },
                },
              },
            },
            _count: {
              select: { lessons: true, enrollments: true },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundError('You are not enrolled in this course');
    }

    ApiResponse.success(res, enrollment);
  });

  // Update lesson progress
  static updateLessonProgress = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { courseId } = req.params;
    const { completed } = req.body;

    if (!userId || !courseId) {
      throw new NotFoundError('User not authenticated or course not specified');
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundError('You are not enrolled in this course');
    }

    // Here you could track individual lesson completion
    // For now, we'll update overall progress
    // You may want to create a separate LessonProgress model for detailed tracking

    // Get total lessons and calculate progress
    const totalLessons = await prisma.lesson.count({
      where: { courseId, published: true },
    });

    // For now, increment progress proportionally
    if (completed && totalLessons > 0) {
      const progressIncrement = Math.floor(100 / totalLessons);
      const newProgress = Math.min(100, enrollment.progress + progressIncrement);

      const updatedEnrollment = await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progress: newProgress,
          ...(newProgress >= 100 && { status: 'COMPLETED', completedAt: new Date() }),
        },
      });

      ApiResponse.success(res, updatedEnrollment, 'Progress updated');
    } else {
      ApiResponse.success(res, enrollment, 'No progress update needed');
    }
  });

  // Get authenticated user's webinar registrations
  static getMyWebinarRegistrations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new NotFoundError('User not authenticated');
    }

    const registrations = await prisma.webinarRegistration.findMany({
      where: { userId },
      include: {
        webinar: {
          select: {
            id: true,
            title: true,
            image: true,
            scheduleDateTime: true,
            duration: true,
            platform: true,
            status: true,
            feeType: true,
            price: true,
            liveLink: true,
            category: { select: { id: true, title: true } },
            _count: {
              select: { registrations: true },
            },
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });

    // Calculate stats
    const total = registrations.length;
    const upcoming = registrations.filter(
      (r) => new Date(r.webinar.scheduleDateTime) > new Date()
    ).length;
    const completed = registrations.filter(
      (r) => new Date(r.webinar.scheduleDateTime) <= new Date()
    ).length;

    ApiResponse.success(res, {
      registrations,
      stats: {
        total,
        upcoming,
        completed,
      },
    });
  });

  // Get single webinar registration details
  static getMyWebinarDetails = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { webinarId } = req.params;

    if (!userId || !webinarId) {
      throw new NotFoundError('User not authenticated or webinar not specified');
    }

    const registration = await prisma.webinarRegistration.findUnique({
      where: {
        webinarId_userId: {
          userId,
          webinarId,
        },
      },
      include: {
        webinar: {
          include: {
            category: { select: { id: true, title: true } },
            _count: {
              select: { registrations: true },
            },
          },
        },
      },
    });

    if (!registration) {
      throw new NotFoundError('You are not registered for this webinar');
    }

    ApiResponse.success(res, registration);
  });
}
