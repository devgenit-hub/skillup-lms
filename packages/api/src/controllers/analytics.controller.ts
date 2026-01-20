import type { Request, Response } from 'express';
import { prisma, UserRole } from '@repo/db';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export class AnalyticsController {
  static getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalStudents,
      activeStudents,
      suspendedStudents,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      monthlyEnrollments,
      lastMonthEnrollments,
      monthlyStudents,
      lastMonthStudents,
      totalWebinars,
      upcomingWebinars,
      totalWebinarRegistrations,
    ] = await Promise.all([
      prisma.user.count({ where: { role: UserRole.STUDENT } }),
      prisma.user.count({ where: { role: UserRole.STUDENT, suspended: false } }),
      prisma.user.count({ where: { role: UserRole.STUDENT, suspended: true } }),
      prisma.course.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.enrollment.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: firstDayOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: firstDayOfLastMonth,
            lt: firstDayOfThisMonth,
          },
        },
        _sum: { amount: true },
      }),
      prisma.enrollment.count({
        where: { enrolledAt: { gte: firstDayOfMonth } },
      }),
      prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: firstDayOfLastMonth,
            lt: firstDayOfThisMonth,
          },
        },
      }),
      prisma.user.count({
        where: {
          role: UserRole.STUDENT,
          createdAt: { gte: firstDayOfMonth },
        },
      }),
      prisma.user.count({
        where: {
          role: UserRole.STUDENT,
          createdAt: {
            gte: firstDayOfLastMonth,
            lt: firstDayOfThisMonth,
          },
        },
      }),
      prisma.webinar.count(),
      prisma.webinar.count({
        where: {
          status: 'upcoming',
        },
      }),
      prisma.webinarRegistration.count(),
    ]);

    const currentMonthRevenue = monthlyRevenue._sum.amount || 0;
    const lastMonthRevenueAmount = lastMonthRevenue._sum.amount || 0;
    const revenueGrowth =
      lastMonthRevenueAmount > 0
        ? ((currentMonthRevenue - lastMonthRevenueAmount) / lastMonthRevenueAmount) * 100
        : 0;

    const enrollmentGrowth =
      lastMonthEnrollments > 0
        ? ((monthlyEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100
        : 0;

    const studentGrowth =
      lastMonthStudents > 0 ? ((monthlyStudents - lastMonthStudents) / lastMonthStudents) * 100 : 0;

    const data = {
      students: {
        total: totalStudents,
        active: activeStudents,
        suspended: suspendedStudents,
        monthlyNew: monthlyStudents,
        growth: studentGrowth,
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        draft: totalCourses - publishedCourses,
      },
      enrollments: {
        total: totalEnrollments,
        monthly: monthlyEnrollments,
        growth: enrollmentGrowth,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        monthly: currentMonthRevenue,
        monthlyGrowth: revenueGrowth,
      },
      webinars: {
        total: totalWebinars,
        upcoming: upcomingWebinars,
        registrations: totalWebinarRegistrations,
      },
    };

    return ApiResponse.success(res, data, 'Dashboard statistics retrieved successfully');
  });

  static getRevenueAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { period = 'monthly', year } = req.query;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);

    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const revenueByPeriod: Record<string, number> = {};

    if (period === 'yearly') {
      payments.forEach((payment) => {
        const year = payment.createdAt.getFullYear();
        revenueByPeriod[year] = (revenueByPeriod[year] || 0) + payment.amount;
      });
    } else {
      for (let month = 0; month < 12; month++) {
        const key = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
        revenueByPeriod[key] = 0;
      }

      payments.forEach((payment) => {
        const year = payment.createdAt.getFullYear();
        const month = payment.createdAt.getMonth() + 1;
        const key = `${year}-${String(month).padStart(2, '0')}`;
        revenueByPeriod[key] = (revenueByPeriod[key] || 0) + payment.amount;
      });
    }

    const data = Object.entries(revenueByPeriod).map(([period, revenue]) => ({
      period,
      revenue,
    }));

    return ApiResponse.success(res, data, 'Revenue analytics retrieved successfully');
  });

  static getStudentAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { period = 'monthly', year } = req.query;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);

    const students = await prisma.user.findMany({
      where: {
        role: UserRole.STUDENT,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        createdAt: true,
        suspended: true,
      },
    });

    const studentsByPeriod: Record<string, { total: number; active: number; suspended: number }> =
      {};

    if (period === 'yearly') {
      students.forEach((student) => {
        const year = student.createdAt.getFullYear().toString();
        if (!studentsByPeriod[year]) {
          studentsByPeriod[year] = { total: 0, active: 0, suspended: 0 };
        }
        studentsByPeriod[year].total++;
        if (student.suspended) {
          studentsByPeriod[year].suspended++;
        } else {
          studentsByPeriod[year].active++;
        }
      });
    } else {
      for (let month = 0; month < 12; month++) {
        const key = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
        studentsByPeriod[key] = { total: 0, active: 0, suspended: 0 };
      }

      students.forEach((student) => {
        const year = student.createdAt.getFullYear();
        const month = student.createdAt.getMonth() + 1;
        const key = `${year}-${String(month).padStart(2, '0')}`;
        if (!studentsByPeriod[key]) {
          studentsByPeriod[key] = { total: 0, active: 0, suspended: 0 };
        }
        studentsByPeriod[key].total++;
        if (student.suspended) {
          studentsByPeriod[key].suspended++;
        } else {
          studentsByPeriod[key].active++;
        }
      });
    }

    const data = Object.entries(studentsByPeriod).map(([period, stats]) => ({
      period,
      ...stats,
    }));

    return ApiResponse.success(res, data, 'Student analytics retrieved successfully');
  });

  static getCourseAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit as string);

    const [popularCourses, completionRates] = await Promise.all([
      prisma.course.findMany({
        take: limitNum,
        include: {
          _count: {
            select: { enrollments: true },
          },
          courseTeachers: {
            take: 1,
            include: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          enrollments: {
            _count: 'desc',
          },
        },
      }),
      prisma.enrollment.groupBy({
        by: ['courseId', 'status'],
        _count: {
          id: true,
        },
      }),
    ]);

    const completionByCourse: Record<string, { total: number; completed: number }> = {};
    completionRates.forEach((item) => {
      if (!completionByCourse[item.courseId]) {
        completionByCourse[item.courseId] = { total: 0, completed: 0 };
      }
      const course = completionByCourse[item.courseId]!;
      course.total += item._count.id;
      if (item.status === 'COMPLETED') {
        course.completed += item._count.id;
      }
    });

    const popularCoursesData = popularCourses.map((course) => {
      const completion = completionByCourse[course.id] || { total: 0, completed: 0 };
      const completionRate =
        completion.total > 0 ? (completion.completed / completion.total) * 100 : 0;

      const teacherName = course.courseTeachers[0]?.teacher?.name || 'No teacher assigned';

      return {
        id: course.id,
        title: course.title,
        instructor: teacherName,
        enrollments: course._count.enrollments,
        completionRate: Math.round(completionRate * 100) / 100,
      };
    });

    const data = {
      popularCourses: popularCoursesData,
      totalPublished: await prisma.course.count({ where: { published: true } }),
      totalDraft: await prisma.course.count({ where: { published: false } }),
    };

    return ApiResponse.success(res, data, 'Course analytics retrieved successfully');
  });

  // Get monthly purchase data for last 12 months (courses and webinars)
  static getPurchaseAnalytics = asyncHandler(async (_req: Request, res: Response) => {
    const now = new Date();
    const months: string[] = [];
    const monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear().toString().slice(-2);
      months.push(`${monthLabels[date.getMonth()]} ${year}`);
    }

    // Get purchase data for last 12 months
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [coursePayments, webinarPayments, courseEnrollments, webinarRegistrations] =
      await Promise.all([
        // Paid course purchases
        prisma.payment.findMany({
          where: {
            status: 'COMPLETED',
            courseId: { not: null },
            amount: { gt: 0 },
            createdAt: { gte: startDate },
          },
          select: { createdAt: true },
        }),
        // Paid webinar purchases
        prisma.payment.findMany({
          where: {
            status: 'COMPLETED',
            webinarId: { not: null },
            amount: { gt: 0 },
            createdAt: { gte: startDate },
          },
          select: { createdAt: true },
        }),
        // Free course enrollments (courses with feeType='FREE')
        prisma.enrollment.findMany({
          where: {
            course: { feeType: 'FREE' },
            enrolledAt: { gte: startDate },
          },
          select: { enrolledAt: true },
        }),
        // Free webinar registrations
        prisma.webinarRegistration.findMany({
          where: {
            webinar: { feeType: 'free' },
            registeredAt: { gte: startDate },
          },
          select: { registeredAt: true },
        }),
      ]);

    // Initialize monthly data
    const coursePurchaseData: { month: string; count: number }[] = months.map((month) => ({
      month,
      count: 0,
    }));
    const webinarPurchaseData: { month: string; count: number }[] = months.map((month) => ({
      month,
      count: 0,
    }));

    // Count course purchases per month
    [...coursePayments, ...courseEnrollments].forEach((item) => {
      const date = 'createdAt' in item ? item.createdAt : item.enrolledAt;
      const monthIndex =
        now.getMonth() - date.getMonth() + (now.getFullYear() - date.getFullYear()) * 12;
      const adjustedIndex = 11 - monthIndex;
      if (adjustedIndex >= 0 && adjustedIndex < 12) {
        coursePurchaseData[adjustedIndex]!.count++;
      }
    });

    // Count webinar purchases per month
    [...webinarPayments, ...webinarRegistrations].forEach((item) => {
      const date = 'createdAt' in item ? item.createdAt : item.registeredAt;
      const monthIndex =
        now.getMonth() - date.getMonth() + (now.getFullYear() - date.getFullYear()) * 12;
      const adjustedIndex = 11 - monthIndex;
      if (adjustedIndex >= 0 && adjustedIndex < 12) {
        webinarPurchaseData[adjustedIndex]!.count++;
      }
    });

    return ApiResponse.success(
      res,
      {
        coursePurchases: coursePurchaseData,
        webinarPurchases: webinarPurchaseData,
      },
      'Purchase analytics retrieved successfully'
    );
  });

  // Get enrollment data for a specific course/webinar over last 12 months
  static getEnrollmentAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { type, id } = req.query;

    const now = new Date();
    const months: string[] = [];
    const monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear().toString().slice(-2);
      months.push(`${monthLabels[date.getMonth()]} ${year}`);
    }

    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const enrollmentData: { month: string; count: number }[] = months.map((month) => ({
      month,
      count: 0,
    }));

    if (type === 'course' && id) {
      const enrollments = await prisma.enrollment.findMany({
        where: {
          courseId: id as string,
          enrolledAt: { gte: startDate },
        },
        select: { enrolledAt: true },
      });

      enrollments.forEach((enrollment) => {
        const monthIndex =
          now.getMonth() -
          enrollment.enrolledAt.getMonth() +
          (now.getFullYear() - enrollment.enrolledAt.getFullYear()) * 12;
        const adjustedIndex = 11 - monthIndex;
        if (adjustedIndex >= 0 && adjustedIndex < 12) {
          enrollmentData[adjustedIndex]!.count++;
        }
      });
    } else if (type === 'webinar' && id) {
      const registrations = await prisma.webinarRegistration.findMany({
        where: {
          webinarId: id as string,
          registeredAt: { gte: startDate },
        },
        select: { registeredAt: true },
      });

      registrations.forEach((registration) => {
        const monthIndex =
          now.getMonth() -
          registration.registeredAt.getMonth() +
          (now.getFullYear() - registration.registeredAt.getFullYear()) * 12;
        const adjustedIndex = 11 - monthIndex;
        if (adjustedIndex >= 0 && adjustedIndex < 12) {
          enrollmentData[adjustedIndex]!.count++;
        }
      });
    }

    return ApiResponse.success(
      res,
      { enrollmentData },
      'Enrollment analytics retrieved successfully'
    );
  });

  // Get list of courses/webinars for enrollment graph dropdown
  static getItemsForAnalytics = asyncHandler(async (_req: Request, res: Response) => {
    const [courses, webinars] = await Promise.all([
      prisma.course.findMany({
        where: { published: true },
        select: { id: true, title: true },
        orderBy: { title: 'asc' },
      }),
      prisma.webinar.findMany({
        select: { id: true, title: true },
        orderBy: { title: 'asc' },
      }),
    ]);

    return ApiResponse.success(
      res,
      {
        courses: courses.map((c) => ({ id: c.id, name: c.title })),
        webinars: webinars.map((w) => ({ id: w.id, name: w.title })),
      },
      'Items for analytics retrieved successfully'
    );
  });
}
