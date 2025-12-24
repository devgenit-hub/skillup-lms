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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const courseId = req.query.courseId as string;

  const where: Record<string, unknown> = {};

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } },
      { specialization: { contains: search, mode: 'insensitive' as const } },
    ];
  }

  // Course filter
  if (courseId) {
    where.courseTeachers = {
      some: {
        courseId,
      },
    };
  }

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        supabaseId: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        qualification: true,
        experience: true,
        specialization: true,
        bio: true,
        profileImage: true,
        joiningDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.teacher.count({ where }),
  ]);

  const teachersWithStats = await Promise.all(
    teachers.map(async (teacher) => {
      const user = await prisma.user.findUnique({
        where: { supabaseId: teacher.supabaseId },
        select: {
          lastLoginAt: true,
        },
      });

      const courseCount = await prisma.courseTeacher.count({
        where: { teacherId: teacher.id },
      });

      return {
        ...teacher,
        lastLoginAt: user?.lastLoginAt || null,
        _count: { courses: courseCount },
      };
    })
  );

  // Calculate global stats (unfiltered)
  const [totalActiveTeachers, totalCourseAssignments] = await Promise.all([
    prisma.teacher.count({
      where: {
        courseTeachers: {
          some: {},
        },
      },
    }),
    prisma.courseTeacher.count(),
  ]);

  res.json({
    success: true,
    data: teachersWithStats,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      activeTeachers: totalActiveTeachers,
      totalAssignments: totalCourseAssignments,
    },
  });
});

export const createTeacher = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    qualification,
    experience,
    specialization,
    bio,
    profileImage,
    joiningDate,
  } = req.body;

  const existingTeacher = await prisma.teacher.findUnique({ where: { email } });
  if (existingTeacher) {
    throw new AppError(409, 'Email already registered as teacher');
  }

  const teacherPassword = password || generatePassword();

  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email,
    password: teacherPassword,
    email_confirm: true,
    user_metadata: { full_name: name },
  });

  if (error || !authUser.user) {
    throw new AppError(500, error?.message || 'Failed to create auth user');
  }

  try {
    await prisma.user.create({
      data: {
        supabaseId: authUser.user.id,
        email,
        name,
        emailVerified: true,
        role: UserRole.INSTRUCTOR,
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        supabaseId: authUser.user.id,
        name,
        email,
        phone,
        address,
        qualification,
        experience: experience ? parseInt(experience) : null,
        specialization,
        bio,
        profileImage,
        joiningDate: joiningDate ? new Date(joiningDate) : null,
      },
    });

    res.status(201).json({
      success: true,
      data: { teacher, temporaryPassword: teacherPassword },
      message: 'Teacher created successfully',
    });
  } catch (dbError) {
    await supabase.auth.admin.deleteUser(authUser.user.id);
    throw dbError;
  }
});

export const updateTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    address,
    qualification,
    experience,
    specialization,
    bio,
    profileImage,
    joiningDate,
    password,
  } = req.body;

  const teacher = await prisma.teacher.findUnique({ where: { id } });

  if (!teacher) {
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

    await prisma.user.updateMany({
      where: { supabaseId: teacher.supabaseId },
      data: { email, name },
    });
  } else if (name !== teacher.name) {
    await prisma.user.updateMany({
      where: { supabaseId: teacher.supabaseId },
      data: { name },
    });
  }

  if (password) {
    const { error } = await supabase.auth.admin.updateUserById(teacher.supabaseId, {
      password,
    });

    if (error) {
      throw new AppError(500, 'Failed to update password');
    }
  }

  const updated = await prisma.teacher.update({
    where: { id },
    data: {
      name,
      email,
      phone,
      address,
      qualification,
      experience: experience ? parseInt(experience) : null,
      specialization,
      bio,
      profileImage,
      joiningDate: joiningDate ? new Date(joiningDate) : null,
    },
  });

  res.json({
    success: true,
    data: updated,
    message: 'Teacher updated successfully',
  });
});

export const resetTeacherPassword = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const teacher = await prisma.teacher.findUnique({
    where: { id },
  });

  if (!teacher) {
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

  const teacher = await prisma.teacher.findUnique({ where: { id } });

  if (!teacher) {
    throw new AppError(404, 'Teacher not found');
  }

  await supabase.auth.admin.deleteUser(teacher.supabaseId);
  await prisma.teacher.delete({ where: { id } });
  await prisma.user.deleteMany({ where: { supabaseId: teacher.supabaseId } });

  res.json({
    success: true,
    message: 'Teacher deleted successfully',
  });
});

export const getCurrentTeacher = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as { user?: { supabaseId: string } }).user;

  if (!user) {
    throw new AppError(401, 'Not authenticated');
  }

  const teacher = await prisma.teacher.findUnique({
    where: { supabaseId: user.supabaseId },
  });

  if (!teacher) {
    throw new AppError(404, 'Teacher profile not found');
  }

  res.json({
    success: true,
    data: teacher,
  });
});

export const updateCurrentTeacher = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as { user?: { supabaseId: string } }).user;

  if (!user) {
    throw new AppError(401, 'Not authenticated');
  }

  const {
    name,
    phone,
    address,
    qualification,
    experience,
    specialization,
    bio,
    profileImage,
    joiningDate,
  } = req.body;

  const teacher = await prisma.teacher.findUnique({
    where: { supabaseId: user.supabaseId },
  });

  if (!teacher) {
    throw new AppError(404, 'Teacher profile not found');
  }

  if (name && name !== teacher.name) {
    await prisma.user.updateMany({
      where: { supabaseId: teacher.supabaseId },
      data: { name },
    });
  }

  const updated = await prisma.teacher.update({
    where: { supabaseId: user.supabaseId },
    data: {
      name,
      phone,
      address,
      qualification,
      experience: experience ? parseInt(experience) : null,
      specialization,
      bio,
      profileImage,
      joiningDate: joiningDate ? new Date(joiningDate) : null,
    },
  });

  res.json({
    success: true,
    data: updated,
    message: 'Profile updated successfully',
  });
});
