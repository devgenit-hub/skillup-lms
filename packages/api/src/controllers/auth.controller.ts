import { type Request, type Response } from 'express';
import { prisma, UserRole } from '@repo/db';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { syncUserSchema, updateProfileSchema } from '../schemas/auth.schema.js';
import { NotFoundError } from '../utils/errors.js';

export class AuthController {
  static sync = asyncHandler(async (req: Request, res: Response) => {
    const data = syncUserSchema.parse(req.body);

    const user = await prisma.user.upsert({
      where: { supabaseId: data.supabaseId },
      update: {
        email: data.email,
        emailVerified: data.emailVerified ?? false,
        lastLoginAt: new Date(),
      },
      create: {
        supabaseId: data.supabaseId,
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        emailVerified: data.emailVerified ?? false,
        provider: data.provider ?? 'EMAIL',
        role: UserRole.STUDENT,
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        supabaseId: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        role: true,
        emailVerified: true,
        provider: true,
        createdAt: true,
      },
    });

    ApiResponse.success(res, user, 'User synced successfully');
  });

  static getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new NotFoundError('User not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        supabaseId: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        role: true,
        emailVerified: true,
        provider: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    ApiResponse.success(res, user);
  });

  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new NotFoundError('User not found');
    }

    const data = updateProfileSchema.parse(req.body);

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name || null;
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl;
    }
    if (data.phone !== undefined) {
      updateData.phone = data.phone || null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        role: true,
        emailVerified: true,
        provider: true,
        updatedAt: true,
      },
    });

    ApiResponse.success(res, updatedUser, 'Profile updated successfully');
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    ApiResponse.success(res, null, 'Logged out successfully');
  });
}
