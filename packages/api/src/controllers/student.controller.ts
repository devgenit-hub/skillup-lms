import { type Request, type Response } from 'express';
import { prisma, UserRole } from '@repo/db';
import { supabaseAdmin } from '../config/supabase.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ConflictError, AppError } from '../utils/errors.js';
import {
  createStudentSchema,
  updateStudentSchema,
  suspendStudentSchema,
  deleteStudentSchema,
  studentQuerySchema,
} from '../schemas/student.schema.js';
import { idParamSchema } from '../schemas/index.js';

export class StudentController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const query = studentQuerySchema.parse(req.query);

    const where: Record<string, unknown> = {
      role: UserRole.STUDENT,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { email: { contains: query.search, mode: 'insensitive' as const } },
      ];
    }

    if (query.status && query.status !== 'all') {
      where.suspended = query.status === 'suspended';
    }

    if (query.courseId) {
      where.enrollments = {
        some: {
          courseId: query.courseId,
        },
      };
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatarUrl: true,
          suspended: true,
          suspendedAt: true,
          suspendedBy: true,
          suspensionReason: true,
          createdAt: true,
          _count: {
            select: { enrollments: true, payments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    ApiResponse.paginated(res, students, {
      page: query.page,
      limit: query.limit,
      total,
    });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const student = await prisma.user.findUnique({
      where: { id, role: UserRole.STUDENT },
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
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!student) {
      throw new NotFoundError('Student');
    }

    ApiResponse.success(res, student);
  });

  static getByTeacher = asyncHandler(async (req: Request, res: Response) => {
    const query = studentQuerySchema.parse(req.query);
    const supabaseId = req.user?.supabaseId;

    if (!supabaseId) {
      throw new NotFoundError('User not authenticated');
    }

    const where: Record<string, unknown> = {
      role: UserRole.STUDENT,
      enrollments: {
        some: {
          course: {
            courseTeachers: {
              some: {
                teacher: {
                  supabaseId,
                },
              },
            },
            ...(query.courseId && { id: query.courseId }),
          },
        },
      },
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' as const } },
        { email: { contains: query.search, mode: 'insensitive' as const } },
      ];
    }

    if (query.status && query.status !== 'all') {
      where.suspended = query.status === 'suspended';
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatarUrl: true,
          suspended: true,
          suspendedAt: true,
          suspendedBy: true,
          suspensionReason: true,
          createdAt: true,
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    ApiResponse.paginated(res, students, {
      page: query.page,
      limit: query.limit,
      total,
    });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const data = createStudentSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        name: data.name,
      },
    });

    if (authError || !authData.user) {
      throw new AppError(400, authError?.message || 'Failed to create auth user');
    }

    const student = await prisma.user.create({
      data: {
        supabaseId: authData.user.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        role: UserRole.STUDENT,
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    ApiResponse.created(res, student, 'Student created successfully');
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateStudentSchema.parse(req.body);

    const existingStudent = await prisma.user.findUnique({
      where: { id, role: UserRole.STUDENT },
    });

    if (!existingStudent) {
      throw new NotFoundError('Student');
    }

    if (data.email && data.email !== existingStudent.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new ConflictError('Email already in use');
      }
    }

    const student = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });

    ApiResponse.success(res, student, 'Student updated successfully');
  });

  static suspend = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const { reason } = suspendStudentSchema.parse(req.body);
    const adminId = req.user!.id;

    const student = await prisma.user.findUnique({
      where: { id, role: UserRole.STUDENT },
    });

    if (!student) {
      throw new NotFoundError('Student');
    }

    if (student.suspended) {
      throw new AppError(400, 'Student is already suspended');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        suspended: true,
        suspendedAt: new Date(),
        suspendedBy: adminId,
        suspensionReason: reason,
      },
    });

    ApiResponse.success(res, updated, 'Student suspended successfully');
  });

  static unsuspend = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);

    const student = await prisma.user.findUnique({
      where: { id, role: UserRole.STUDENT },
    });

    if (!student) {
      throw new NotFoundError('Student');
    }

    if (!student.suspended) {
      throw new AppError(400, 'Student is not suspended');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        suspended: false,
        suspendedAt: null,
        suspendedBy: null,
        suspensionReason: null,
      },
    });

    ApiResponse.success(res, updated, 'Student unsuspended successfully');
  });
  static suspendByTeacher = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const { reason } = suspendStudentSchema.parse(req.body);
    const supabaseId = req.user?.supabaseId;
    const suspendedByUserId = req.user?.id;

    if (!supabaseId || !suspendedByUserId) {
      throw new NotFoundError('User not authenticated');
    }

    const student = await prisma.user.findFirst({
      where: {
        id,
        role: UserRole.STUDENT,
        suspended: false,
        enrollments: {
          some: {
            course: {
              courseTeachers: {
                some: {
                  teacher: {
                    supabaseId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundError(
        'Student not found, already suspended, or not enrolled in your courses'
      );
    }

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        suspended: true,
        suspendedAt: new Date(),
        suspendedBy: suspendedByUserId,
        suspensionReason: reason,
      },
    });

    ApiResponse.success(res, updatedStudent, 'Student suspended successfully');
  });

  static unsuspendByTeacher = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const supabaseId = req.user?.supabaseId;

    if (!supabaseId) {
      throw new NotFoundError('User not authenticated');
    }

    const student = await prisma.user.findFirst({
      where: {
        id,
        role: UserRole.STUDENT,
        suspended: true,
        enrollments: {
          some: {
            course: {
              courseTeachers: {
                some: {
                  teacher: {
                    supabaseId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundError('Student not found, not suspended, or not enrolled in your courses');
    }

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        suspended: false,
        suspendedAt: null,
        suspendedBy: null,
        suspensionReason: null,
      },
    });

    ApiResponse.success(res, updatedStudent, 'Student unsuspended successfully');
  });
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const { confirmId } = deleteStudentSchema.parse(req.body);

    if (id !== confirmId) {
      throw new AppError(400, 'Student ID confirmation does not match');
    }

    const student = await prisma.user.findUnique({
      where: { id, role: UserRole.STUDENT },
    });

    if (!student) {
      throw new NotFoundError('Student');
    }

    await supabaseAdmin.auth.admin.deleteUser(student.supabaseId);

    await prisma.user.delete({
      where: { id },
    });

    ApiResponse.noContent(res);
  });
}
