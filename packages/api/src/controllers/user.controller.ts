import { type Request, type Response } from 'express';
import { prisma } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import {
  createUserSchema,
  updateUserSchema,
  paginationSchema,
  idParamSchema,
} from '../schemas/index.js';

export class UserController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const query = paginationSchema.parse(req.query);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          _count: {
            select: { enrollments: true, courses: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    ApiResponse.paginated(res, users, {
      page: query.page,
      limit: query.limit,
      total,
    });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        },
        courses: {
          select: {
            id: true,
            title: true,
            published: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    ApiResponse.success(res, user);
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = createUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    ApiResponse.created(res, user, 'User created successfully');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError('User');
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new ConflictError('Email already in use');
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    ApiResponse.success(res, user, 'User updated successfully');
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError('User');
    }

    await prisma.user.delete({
      where: { id },
    });

    ApiResponse.noContent(res);
  });
}
