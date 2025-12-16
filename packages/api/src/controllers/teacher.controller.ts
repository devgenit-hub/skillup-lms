import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { prisma } from '@repo/db';
import { UserRole } from '@repo/db';
import { createClient } from '@supabase/supabase-js';
import { AppError } from '../utils/errors.js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const getTeachers = asyncHandler(async (req: Request, res: Response) => {
  const teachers = await prisma.user.findMany({
    where: { role: UserRole.INSTRUCTOR },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      lastLoginAt: true,
      _count: { select: { courses: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: teachers,
  });
});

export const createTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(409, 'Email already registered');
  }

  const password = generatePassword();
  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (error || !authUser.user) {
    throw new AppError(500, error?.message || 'Failed to create auth user');
  }

  const teacher = await prisma.user.create({
    data: {
      supabaseId: authUser.user.id,
      email,
      name,
      emailVerified: true,
      role: UserRole.INSTRUCTOR,
    },
  });

  res.status(201).json({
    success: true,
    data: { teacher, temporaryPassword: password },
    message: 'Teacher created successfully',
  });
});

export const updateTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const teacher = await prisma.user.findUnique({ where: { id } });
  if (!teacher || teacher.role !== UserRole.INSTRUCTOR) {
    throw new AppError(404, 'Teacher not found');
  }

  if (email && email !== teacher.email) {
    const { error } = await supabase.auth.admin.updateUserById(teacher.supabaseId, {
      email,
      email_confirm: true,
    });

    if (error) {
      throw new AppError(500, 'Failed to update email in auth system');
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { name, email },
  });

  res.json({
    success: true,
    data: updated,
    message: 'Teacher updated successfully',
  });
});

export const resetTeacherPassword = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const teacher = await prisma.user.findUnique({ where: { id } });
  if (!teacher || teacher.role !== UserRole.INSTRUCTOR) {
    throw new AppError(404, 'Teacher not found');
  }

  const newPassword = generatePassword();
  const { error } = await supabase.auth.admin.updateUserById(teacher.supabaseId, {
    password: newPassword,
  });

  if (error) {
    throw new AppError(500, 'Failed to reset password');
  }

  res.json({
    success: true,
    data: { newPassword },
    message: 'Password reset successfully',
  });
});

export const deleteTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const teacher = await prisma.user.findUnique({ where: { id } });
  if (!teacher || teacher.role !== UserRole.INSTRUCTOR) {
    throw new AppError(404, 'Teacher not found');
  }

  await supabase.auth.admin.deleteUser(teacher.supabaseId);
  await prisma.user.delete({ where: { id } });

  res.json({
    success: true,
    message: 'Teacher deleted successfully',
  });
});
