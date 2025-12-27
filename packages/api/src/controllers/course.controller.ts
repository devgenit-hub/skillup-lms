import { type Request, type Response } from 'express';
import { prisma, UserRole } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ConflictError, AppError, BadRequestError } from '../utils/errors.js';
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
  static getPublicCourses = asyncHandler(async (req: Request, res: Response) => {
    const query = courseQuerySchema.parse(req.query);
    const { page, limit, search, category, feeType, level, courseType } = query;

    const baseWhere: Record<string, unknown> = { published: true };

    if (search) {
      baseWhere.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (category) {
      baseWhere.category = { slug: category };
    }

    if (feeType) {
      baseWhere.feeType = feeType;
    }

    const metadataFilters: Array<{ path: string[]; equals: string }> = [];
    if (level) metadataFilters.push({ path: ['level'], equals: level });
    if (courseType) metadataFilters.push({ path: ['courseType'], equals: courseType });

    const where =
      metadataFilters.length > 0
        ? { AND: [baseWhere, ...metadataFilters.map((f) => ({ metadata: f }))] }
        : baseWhere;

    const [coursesRaw, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          feeType: true,
          price: true,
          metadata: true,
          category: { select: { id: true, title: true, slug: true } },
          _count: { select: { enrollments: true, curriculumModules: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ]);

    const courses = coursesRaw.map((course) => {
      const metadata = (course.metadata || {}) as Record<string, unknown>;
      return {
        id: course.id,
        title: course.title,
        image: (metadata.heroImage as string) || null,
        feeType: course.feeType,
        price: course.price,
        category: course.category,
        level: (metadata.level as string) || null,
        courseType: (metadata.courseType as string) || null,
        batchNo: (metadata.batchNo as string) || null,
        _count: course._count,
      };
    });

    ApiResponse.paginated(res, courses, { page, limit, total });
  });

  static getPublicCourse = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const course = await prisma.course.findUnique({
      where: { id, published: true },
      select: {
        id: true,
        title: true,
        description: true,
        feeType: true,
        price: true,
        published: true,
        metadata: true,
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        courseTeachers: {
          select: {
            teacher: {
              select: {
                id: true,
                name: true,
                profileImage: true,
                bio: true,
                specialization: true,
              },
            },
          },
        },
        curriculumModules: {
          select: {
            id: true,
            title: true,
            order: true,
            classes: {
              select: {
                id: true,
                title: true,
                duration: true,
                order: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundError('Course');
    }

    const metadata = (course.metadata || {}) as Record<string, unknown>;
    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      feeType: course.feeType,
      price: course.price,
      published: course.published,
      image: (metadata.heroImage as string) || null,
      category: course.category,
      level: (metadata.level as string) || null,
      language: (metadata.language as string) || null,
      metadata: course.metadata,
      teachers: course.courseTeachers.map((ct: { teacher: unknown }) => ct.teacher),
      curriculumModules: course.curriculumModules,
      _count: course._count,
    };

    ApiResponse.success(res, transformedCourse);
  });

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

    const isTeacherContext = !!query.teacherId;

    const [courses, total] = await Promise.all([
      isTeacherContext
        ? prisma.course.findMany({
            where,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            select: {
              id: true,
              title: true,
              published: true,
              feeType: true,
              price: true,
              metadata: true,
              _count: {
                select: { curriculumModules: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          })
        : prisma.course.findMany({
            where,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
            include: {
              category: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
              courseTeachers: {
                include: {
                  teacher: {
                    select: { id: true, name: true, email: true, profileImage: true },
                  },
                },
              },
              _count: {
                select: {
                  enrollments: true,
                  lessons: true,
                  curriculumModules: true,
                },
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
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
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

  // Helper to resolve categoryId from categoryTitle (creates new if needed)
  private static async resolveCategoryId(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    categoryId?: string,
    categoryTitle?: string
  ): Promise<{
    categoryId: string | null;
    newCategory?: { id: string; title: string; slug: string };
  }> {
    // If categoryId is provided, use it directly
    if (categoryId) {
      return { categoryId };
    }

    // If categoryTitle is provided, find or create category
    if (categoryTitle) {
      const slug = categoryTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Try to find existing category
      const existing = await tx.category.findUnique({
        where: { slug },
        select: { id: true, title: true, slug: true },
      });

      if (existing) {
        return { categoryId: existing.id };
      }

      // Create new category
      const newCategory = await tx.category.create({
        data: {
          title: categoryTitle,
          slug,
          courseCount: 0,
          webinarCount: 0,
        },
        select: { id: true, title: true, slug: true },
      });

      return { categoryId: newCategory.id, newCategory };
    }

    return { categoryId: null };
  }

  // Create new course
  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = createCourseSchema.parse(req.body);
    const { categoryTitle, ...courseData } = data;

    const result = await prisma.$transaction(async (tx) => {
      // Resolve category (find existing or create new)
      const { categoryId, newCategory } = await CourseController.resolveCategoryId(
        tx,
        data.categoryId,
        categoryTitle
      );

      // Create the course
      const newCourse = await tx.course.create({
        data: {
          ...courseData,
          categoryId,
        },
        include: {
          courseTeachers: {
            include: {
              teacher: {
                select: { id: true, name: true, email: true, profileImage: true },
              },
            },
          },
          category: {
            select: { id: true, title: true, slug: true },
          },
        },
      });

      // Increment category count if categoryId is set
      if (categoryId) {
        await tx.category.update({
          where: { id: categoryId },
          data: { courseCount: { increment: 1 } },
        });
      }

      return { course: newCourse, newCategory };
    });

    ApiResponse.created(res, result, 'Course created successfully');
  });

  // Update course
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateCourseSchema.parse(req.body);
    const { categoryTitle, ...updateFields } = data;
    const userRole = req.user?.role;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
      select: { id: true, categoryId: true, metadata: true },
    });

    if (!existingCourse) {
      throw new NotFoundError('Course');
    }

    // Teachers can only update 'published' field, admins can update everything
    let updateData: Partial<typeof updateFields>;
    if (userRole === UserRole.ADMIN) {
      updateData = { ...updateFields };
      if (updateFields.metadata && existingCourse.metadata) {
        const existingMetadata =
          typeof existingCourse.metadata === 'object' ? existingCourse.metadata : {};
        updateData = {
          ...updateFields,
          metadata: {
            ...existingMetadata,
            ...updateFields.metadata,
          },
        };
      }
    } else {
      if (Object.keys(updateFields).length === 1 && 'published' in updateFields) {
        updateData = { published: updateFields.published };
      } else {
        throw new BadRequestError(
          'Teachers can only update the published status. Contact an administrator for other changes.'
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      let newCategory: { id: string; title: string; slug: string } | undefined;
      let finalCategoryId = updateData.categoryId;

      // If categoryTitle provided and no categoryId, resolve category
      if (categoryTitle && !updateData.categoryId) {
        const resolved = await CourseController.resolveCategoryId(tx, undefined, categoryTitle);
        finalCategoryId = resolved.categoryId;
        newCategory = resolved.newCategory;
        updateData.categoryId = finalCategoryId;
      }

      // Handle category count changes if categoryId is being updated
      if (finalCategoryId !== undefined && finalCategoryId !== existingCourse.categoryId) {
        if (existingCourse.categoryId) {
          await tx.category.update({
            where: { id: existingCourse.categoryId },
            data: { courseCount: { decrement: 1 } },
          });
        }

        if (finalCategoryId) {
          await tx.category.update({
            where: { id: finalCategoryId },
            data: { courseCount: { increment: 1 } },
          });
        }
      }

      const course = await tx.course.update({
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
          category: {
            select: { id: true, title: true, slug: true },
          },
        },
      });

      return { course, newCategory };
    });

    ApiResponse.success(res, result, 'Course updated successfully');
  });

  // Delete course
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
      select: { id: true, categoryId: true },
    });

    if (!existingCourse) {
      throw new NotFoundError('Course');
    }

    await prisma.$transaction(async (tx) => {
      // Delete the course
      await tx.course.delete({
        where: { id },
      });

      // Decrement category count if categoryId exists
      if (existingCourse.categoryId) {
        await tx.category.update({
          where: { id: existingCourse.categoryId },
          data: { courseCount: { decrement: 1 } },
        });
      }
    });

    ApiResponse.noContent(res);
  });

  static assignTeachers = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    // Validate request body with better error message
    const validation = assignTeachersSchema.safeParse(req.body);
    if (!validation.success) {
      // Check if it's the teacherIds array validation (empty or missing)
      const hasTeacherIdsError = validation.error.errors.some(
        (err) => err.path.includes('teacherIds') || err.path.length === 0
      );
      const errorMessage = hasTeacherIdsError
        ? 'At least one teacher must remain assigned to the course'
        : validation.error.errors[0]?.message || 'Invalid teacher assignment data';
      throw new AppError(400, errorMessage);
    }

    const { teacherIds } = validation.data;

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
        if (!module) continue;

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
