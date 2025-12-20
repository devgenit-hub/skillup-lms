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
  assignTeachersSchema,
  createCouponSchema,
  updateCourseCurriculumSchema,
} from '../schemas/index.js';

export class CourseController {
  // Get all courses with pagination and filters
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const query = courseQuerySchema.parse(req.query);

    const where = {
      ...(query.published !== undefined && { published: query.published }),
      ...(query.teacherId && {
        courseTeachers: {
          some: { teacherId: query.teacherId },
        },
      }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          courseTeachers: {
            include: {
              teacher: {
                select: { id: true, name: true, email: true, profileImage: true },
              },
            },
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
        courseTeachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                bio: true,
                specialization: true,
              },
            },
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
          where: { published: true },
        },
        curriculumModules: {
          include: {
            classes: { orderBy: { order: 'asc' } },
            materials: { orderBy: { order: 'asc' } },
          },
          orderBy: { order: 'asc' },
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

    const course = await prisma.course.create({
      data,
      include: {
        courseTeachers: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true, profileImage: true },
            },
          },
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

    // Merge metadata instead of replacing it
    let updateData = { ...data };
    if (data.metadata && existingCourse.metadata) {
      const existingMetadata =
        typeof existingCourse.metadata === 'object' ? existingCourse.metadata : {};
      updateData = {
        ...data,
        metadata: {
          ...existingMetadata,
          ...data.metadata,
        },
      };
    }

    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        courseTeachers: {
          include: {
            teacher: {
              select: { id: true, name: true, email: true, profileImage: true },
            },
          },
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

  static assignTeachers = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const { teacherIds } = assignTeachersSchema.parse(req.body);

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundError('Course');
    }

    await prisma.courseTeacher.deleteMany({
      where: { courseId: id },
    });

    const courseTeachers = teacherIds.map((teacherId) => ({
      courseId: id,
      teacherId,
    }));

    await prisma.courseTeacher.createMany({
      data: courseTeachers,
    });

    const updatedCourse = await prisma.course.findUnique({
      where: { id },
      include: {
        courseTeachers: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    ApiResponse.success(res, updatedCourse, 'Teachers assigned successfully');
  });

  // Create coupon for course
  static createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = createCouponSchema.parse(req.body);

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundError('Course');
    }

    // Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: data.code },
    });

    if (existingCoupon) {
      throw new ConflictError('Coupon code already exists');
    }

    const coupon = await prisma.coupon.create({
      data: {
        courseId: id,
        code: data.code,
        title: data.title,
        discount: data.discount,
        expiresAt: new Date(data.expiresAt),
        maxUsage: data.maxUsage,
      },
    });

    // Return with isActive for frontend compatibility
    ApiResponse.success(
      res,
      { ...coupon, isActive: coupon.active, maxUses: coupon.maxUsage },
      'Coupon created successfully'
    );
  });

  // Get coupons for course
  static getCoupons = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const coupons = await prisma.coupon.findMany({
      where: { courseId: id },
      orderBy: { createdAt: 'desc' },
    });

    // Transform active to isActive for frontend compatibility
    const transformedCoupons = coupons.map((coupon) => ({
      ...coupon,
      isActive: coupon.active,
      maxUses: coupon.maxUsage,
    }));

    ApiResponse.success(res, transformedCoupons);
  });

  // Toggle coupon active status
  static toggleCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { id, couponId } = req.params;

    const coupon = await prisma.coupon.findFirst({
      where: { id: couponId, courseId: id },
    });

    if (!coupon) {
      throw new NotFoundError('Coupon');
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: { active: !coupon.active },
    });

    // Return with isActive for frontend compatibility
    ApiResponse.success(
      res,
      { ...updatedCoupon, isActive: updatedCoupon.active },
      `Coupon ${updatedCoupon.active ? 'activated' : 'deactivated'} successfully`
    );
  });

  // Update coupon details
  static updateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { id, couponId } = req.params;
    const { code, title, discount, expiresAt } = req.body;

    const coupon = await prisma.coupon.findFirst({
      where: { id: couponId, courseId: id },
    });

    if (!coupon) {
      throw new NotFoundError('Coupon');
    }

    // Check if code is being changed and if the new code already exists
    if (code && code !== coupon.code) {
      const existingCoupon = await prisma.coupon.findUnique({
        where: { code },
      });
      if (existingCoupon) {
        throw new ConflictError('Coupon code already exists');
      }
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        ...(code && { code }),
        ...(title !== undefined && { title }),
        ...(discount !== undefined && { discount }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      },
    });

    // Return with isActive for frontend compatibility
    ApiResponse.success(
      res,
      { ...updatedCoupon, isActive: updatedCoupon.active, maxUses: updatedCoupon.maxUsage },
      'Coupon updated successfully'
    );
  });

  // Delete coupon
  static deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { id, couponId } = req.params;

    const coupon = await prisma.coupon.findFirst({
      where: { id: couponId, courseId: id },
    });

    if (!coupon) {
      throw new NotFoundError('Coupon');
    }

    await prisma.coupon.delete({
      where: { id: couponId },
    });

    ApiResponse.success(res, null, 'Coupon deleted successfully');
  });

  // Update course curriculum using proper database tables
  static updateCurriculum = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const { modules } = updateCourseCurriculumSchema.parse(req.body);

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundError('Course');
    }

    // Use a transaction to update curriculum
    await prisma.$transaction(async (tx) => {
      // Delete existing curriculum modules and their related data (cascade)
      await tx.curriculumModule.deleteMany({
        where: { courseId: id },
      });

      // Create new modules with classes and materials
      for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        const createdModule = await tx.curriculumModule.create({
          data: {
            courseId: id,
            title: module.title,
            details: module.details || null,
            order: i,
          },
        });

        // Create classes for this module
        if (module.classes && module.classes.length > 0) {
          await tx.curriculumClass.createMany({
            data: module.classes.map((cls, idx) => ({
              moduleId: createdModule.id,
              title: cls.title,
              videoUrl: cls.videoUrl || null,
              duration: cls.duration || null,
              order: idx,
            })),
          });
        }

        // Create materials for this module
        if (module.materials && module.materials.length > 0) {
          await tx.curriculumMaterial.createMany({
            data: module.materials.map((mat, idx) => ({
              moduleId: createdModule.id,
              title: mat.title,
              fileUrl: mat.fileUrl || null,
              fileType: mat.fileType || null,
              fileSize: mat.fileSize || null,
              order: idx,
            })),
          });
        }
      }
    });

    // Fetch the updated curriculum
    const curriculumModules = await prisma.curriculumModule.findMany({
      where: { courseId: id },
      include: {
        classes: { orderBy: { order: 'asc' } },
        materials: { orderBy: { order: 'asc' } },
      },
      orderBy: { order: 'asc' },
    });

    ApiResponse.success(res, { modules: curriculumModules }, 'Curriculum updated successfully');
  });

  // Get course curriculum
  static getCurriculum = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundError('Course');
    }

    const curriculumModules = await prisma.curriculumModule.findMany({
      where: { courseId: id },
      include: {
        classes: { orderBy: { order: 'asc' } },
        materials: { orderBy: { order: 'asc' } },
      },
      orderBy: { order: 'asc' },
    });

    ApiResponse.success(res, { modules: curriculumModules });
  });

  static getEnrolledStudents = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundError('Course');
    }

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where: { courseId: id },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              suspended: true,
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      prisma.enrollment.count({ where: { courseId: id } }),
    ]);

    const students = enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      status: enrollment.status,
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      student: enrollment.user,
    }));

    ApiResponse.paginated(res, students, {
      page: pageNum,
      limit: limitNum,
      total,
    });
  });
}
