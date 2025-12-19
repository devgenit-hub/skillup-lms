import { type Request, type Response } from 'express';
import { prisma } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, AppError } from '../utils/errors.js';
import {
  createWebinarSchema,
  updateWebinarSchema,
  webinarQuerySchema,
} from '../schemas/webinar.schema.js';
import { idParamSchema } from '../schemas/index.js';

export class WebinarController {
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

  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = createWebinarSchema.parse(req.body);

    if (data.feeType === 'paid' && !data.price) {
      throw new AppError(400, 'Price is required for paid webinars');
    }

    const webinar = await prisma.webinar.create({
      data: {
        title: data.title,
        category: data.category,
        image: data.image,
        scheduleDateTime: new Date(data.scheduleDateTime),
        duration: data.duration,
        feeType: data.feeType,
        price: data.price,
        platform: data.platform,
        status: data.status,
        sessionHighlights: data.sessionHighlights,
        aboutWebinar: data.aboutWebinar,
        speakers: data.speakers,
        sessionAgenda: data.sessionAgenda,
        resources: data.resources,
        liveLink: data.liveLink,
      },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    ApiResponse.created(res, webinar, 'Webinar created successfully');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateWebinarSchema.parse(req.body);

    const existingWebinar = await prisma.webinar.findUnique({
      where: { id },
    });

    if (!existingWebinar) {
      throw new NotFoundError('Webinar');
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.scheduleDateTime) {
      updateData.scheduleDateTime = new Date(data.scheduleDateTime);
    }

    const webinar = await prisma.webinar.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    ApiResponse.success(res, webinar, 'Webinar updated successfully');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const existingWebinar = await prisma.webinar.findUnique({
      where: { id },
    });

    if (!existingWebinar) {
      throw new NotFoundError('Webinar');
    }

    await prisma.webinar.delete({
      where: { id },
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
}
