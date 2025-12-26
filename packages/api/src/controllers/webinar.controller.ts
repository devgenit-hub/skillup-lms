import { type Request, type Response } from 'express';
import { prisma } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, AppError, ConflictError } from '../utils/errors.js';
import {
  createWebinarSchema,
  updateWebinarSchema,
  webinarQuerySchema,
} from '../schemas/webinar.schema.js';
import { idParamSchema, createCouponSchema } from '../schemas/index.js';

export class WebinarController {
  static getPublicWebinars = asyncHandler(async (req: Request, res: Response) => {
    const query = webinarQuerySchema.parse(req.query);

    const where: Record<string, unknown> = {};

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' as const };
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    } else {
      where.status = { in: ['upcoming', 'live'] };
    }

    if (query.category) {
      where.category = {
        slug: query.category,
      };
    }

    if (query.feeType) {
      where.feeType = query.feeType;
    }

    const [webinars, total] = await Promise.all([
      prisma.webinar.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
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
          _count: {
            select: { registrations: true },
          },
        },
        orderBy: { scheduleDateTime: 'asc' },
      }),
      prisma.webinar.count({ where }),
    ]);

    ApiResponse.paginated(res, webinars, {
      page: query.page,
      limit: query.limit,
      total,
    });
  });

  static getPublicWebinar = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

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

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const query = webinarQuerySchema.parse(req.query);

    const where: Record<string, unknown> = {};

    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' as const };
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }

    const [webinars, total] = await Promise.all([
      prisma.webinar.findMany({
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
          _count: {
            select: { registrations: true },
          },
        },
        orderBy: { scheduleDateTime: 'desc' },
      }),
      prisma.webinar.count({ where }),
    ]);

    ApiResponse.paginated(res, webinars, {
      page: query.page,
      limit: query.limit,
      total,
    });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const webinar = await prisma.webinar.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
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

  // Helper to resolve categoryId from categoryTitle (creates new if needed)
  private static async resolveCategoryId(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    categoryId?: string,
    categoryTitle?: string
  ): Promise<{
    categoryId: string | null;
    newCategory?: { id: string; title: string; slug: string };
  }> {
    if (categoryId) {
      return { categoryId };
    }

    if (categoryTitle) {
      const slug = categoryTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existing = await tx.category.findUnique({
        where: { slug },
        select: { id: true, title: true, slug: true },
      });

      if (existing) {
        return { categoryId: existing.id };
      }

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

  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = createWebinarSchema.parse(req.body);
    const { categoryTitle, ...webinarData } = data;

    if (data.feeType === 'paid' && !data.price) {
      throw new AppError(400, 'Price is required for paid webinars');
    }

    const result = await prisma.$transaction(async (tx) => {
      const { categoryId, newCategory } = await WebinarController.resolveCategoryId(
        tx,
        data.categoryId,
        categoryTitle
      );

      const newWebinar = await tx.webinar.create({
        data: {
          title: webinarData.title,
          categoryId,
          image: webinarData.image,
          scheduleDateTime: new Date(webinarData.scheduleDateTime),
          duration: webinarData.duration,
          feeType: webinarData.feeType,
          price: webinarData.price,
          platform: webinarData.platform,
          status: webinarData.status,
          sessionHighlights: webinarData.sessionHighlights,
          aboutWebinar: webinarData.aboutWebinar,
          speakers: webinarData.speakers,
          sessionAgenda: webinarData.sessionAgenda,
          resources: webinarData.resources,
          liveLink: webinarData.liveLink,
        },
        include: {
          category: {
            select: { id: true, title: true, slug: true },
          },
          _count: {
            select: { registrations: true },
          },
        },
      });

      if (categoryId) {
        await tx.category.update({
          where: { id: categoryId },
          data: { webinarCount: { increment: 1 } },
        });
      }

      return { webinar: newWebinar, newCategory };
    });

    ApiResponse.created(res, result, 'Webinar created successfully');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateWebinarSchema.parse(req.body);
    const { categoryTitle, ...updateFields } = data;

    const existingWebinar = await prisma.webinar.findUnique({
      where: { id },
      select: { id: true, categoryId: true },
    });

    if (!existingWebinar) {
      throw new NotFoundError('Webinar');
    }

    const updateData: Record<string, unknown> = { ...updateFields };
    if (updateFields.scheduleDateTime) {
      updateData.scheduleDateTime = new Date(updateFields.scheduleDateTime);
    }

    const result = await prisma.$transaction(async (tx) => {
      let newCategory: { id: string; title: string; slug: string } | undefined;
      let finalCategoryId = updateData.categoryId as string | undefined;

      if (categoryTitle && !updateData.categoryId) {
        const resolved = await WebinarController.resolveCategoryId(tx, undefined, categoryTitle);
        finalCategoryId = resolved.categoryId ?? undefined;
        newCategory = resolved.newCategory;
        updateData.categoryId = finalCategoryId;
      }

      if (finalCategoryId !== undefined && finalCategoryId !== existingWebinar.categoryId) {
        if (existingWebinar.categoryId) {
          await tx.category.update({
            where: { id: existingWebinar.categoryId },
            data: { webinarCount: { decrement: 1 } },
          });
        }

        if (finalCategoryId) {
          await tx.category.update({
            where: { id: finalCategoryId },
            data: { webinarCount: { increment: 1 } },
          });
        }
      }

      const webinar = await tx.webinar.update({
        where: { id },
        data: updateData,
        include: {
          category: {
            select: { id: true, title: true, slug: true },
          },
          _count: {
            select: { registrations: true },
          },
        },
      });

      return { webinar, newCategory };
    });

    ApiResponse.success(res, result, 'Webinar updated successfully');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const existingWebinar = await prisma.webinar.findUnique({
      where: { id },
      select: { id: true, categoryId: true },
    });

    if (!existingWebinar) {
      throw new NotFoundError('Webinar');
    }

    await prisma.$transaction(async (tx) => {
      // Delete the webinar
      await tx.webinar.delete({
        where: { id },
      });

      // Decrement category count if categoryId exists
      if (existingWebinar.categoryId) {
        await tx.category.update({
          where: { id: existingWebinar.categoryId },
          data: { webinarCount: { decrement: 1 } },
        });
      }
    });

    ApiResponse.noContent(res);
  });

  static register = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const userId = req.user!.id;

    const webinar = await prisma.webinar.findUnique({
      where: { id },
    });

    if (!webinar) {
      throw new NotFoundError('Webinar');
    }

    const existingRegistration = await prisma.webinarRegistration.findUnique({
      where: {
        webinarId_userId: {
          webinarId: id,
          userId,
        },
      },
    });

    if (existingRegistration) {
      throw new AppError(400, 'Already registered for this webinar');
    }

    const registration = await prisma.webinarRegistration.create({
      data: {
        webinarId: id,
        userId,
      },
    });

    ApiResponse.created(res, registration, 'Registered successfully');
  });

  static unregister = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const userId = req.user!.id;

    const registration = await prisma.webinarRegistration.findUnique({
      where: {
        webinarId_userId: {
          webinarId: id,
          userId,
        },
      },
    });

    if (!registration) {
      throw new NotFoundError('Registration');
    }

    await prisma.webinarRegistration.delete({
      where: {
        webinarId_userId: {
          webinarId: id,
          userId,
        },
      },
    });

    ApiResponse.success(res, null, 'Unregistered successfully');
  });

  // Create coupon for webinar
  static createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = createCouponSchema.parse(req.body);

    // Check if webinar exists
    const webinar = await prisma.webinar.findUnique({
      where: { id },
    });

    if (!webinar) {
      throw new NotFoundError('Webinar');
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
        webinarId: id,
        code: data.code,
        title: data.title,
        discount: data.discount,
        expiresAt: new Date(data.expiresAt),
        maxUsage: data.maxUsage,
      },
    });

    ApiResponse.success(
      res,
      { ...coupon, isActive: coupon.active, maxUses: coupon.maxUsage },
      'Coupon created successfully'
    );
  });

  // Get coupons for webinar
  static getCoupons = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const coupons = await prisma.coupon.findMany({
      where: { webinarId: id },
      orderBy: { createdAt: 'desc' },
    });

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
      where: { id: couponId, webinarId: id },
    });

    if (!coupon) {
      throw new NotFoundError('Coupon');
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: { active: !coupon.active },
    });

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
      where: { id: couponId, webinarId: id },
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
      where: { id: couponId, webinarId: id },
    });

    if (!coupon) {
      throw new NotFoundError('Coupon');
    }

    await prisma.coupon.delete({
      where: { id: couponId },
    });

    ApiResponse.success(res, null, 'Coupon deleted successfully');
  });
}
