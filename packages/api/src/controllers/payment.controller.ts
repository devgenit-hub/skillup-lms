import { Response, Request } from 'express';
import { prisma, Prisma } from '@repo/db';
import axios from 'axios';
import { z } from 'zod';

interface AuthRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string | null;
  };
}

interface PaymentMetadata {
  itemType: 'course' | 'webinar';
  itemId: string;
  userId: string;
  originalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  uddoktaCheckoutResponse?: Record<string, unknown>;
  uddoktaVerifyResponse?: Record<string, unknown>;
  uddoktaWebhookData?: Record<string, unknown>;
  refundResponse?: Record<string, unknown>;
}

interface UddoktaVerifyResponse {
  full_name: string;
  email: string;
  amount: string;
  fee: string;
  charged_amount: string;
  invoice_id: string;
  metadata: Record<string, unknown>;
  payment_method: string;
  sender_number: string;
  transaction_id: string;
  date: string;
  status?: string;
}

const UDDOKTA_PAY_API_KEY = (process.env.UDDOKTA_PAY_API_KEY || '').trim();
const UDDOKTA_PAY_API_URL = (
  process.env.UDDOKTA_PAY_API_URL || 'https://sandbox.uddoktapay.com/api'
).trim();
const FRONTEND_URL = (process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000').trim();
const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000').trim();
const PAYMENT_CALLBACK_PROXY_URL = (process.env.PAYMENT_CALLBACK_PROXY_URL || '').trim();

const initiatePaymentSchema = z.object({
  itemType: z.enum(['course', 'webinar']),
  itemId: z.string().min(1),
  amount: z.number().positive(),
  couponCode: z.string().nullable().optional(),
});

const refundPaymentSchema = z.object({
  paymentId: z.string().min(1),
  amount: z.number().positive(),
  reason: z.string().min(1),
});

const adminRefundSchema = z.object({
  paymentId: z.string().min(1),
  reason: z.string().min(1),
  adminPassword: z.string().min(1),
  refundAmount: z.number().positive().optional(),
});

const adminDeletePaymentSchema = z.object({
  paymentId: z.string().min(1),
  reason: z.string().min(1),
  adminPassword: z.string().min(1),
  isPseudoPayment: z.boolean().optional(),
});

const adminPaymentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['all', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'FREE']).default('all'),
  courseId: z.string().optional(),
  webinarId: z.string().optional(),
});

function getCallbackUrl(): string {
  if (PAYMENT_CALLBACK_PROXY_URL) {
    return `${PAYMENT_CALLBACK_PROXY_URL}/api/payment/callback`;
  }
  return `${BACKEND_URL}/api/payment/callback`;
}

function getUddoktaHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'RT-UDDOKTAPAY-API-KEY': UDDOKTA_PAY_API_KEY,
  };
}

export const initiatePayment = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const validation = initiatePaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }

    const { itemType, itemId, amount, couponCode } = validation.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (itemType === 'course') {
      const course = await prisma.course.findUnique({ where: { id: itemId } });
      if (!course) return res.status(404).json({ error: 'Course not found' });
      if (!course.published)
        return res.status(400).json({ error: 'Course is not available for enrollment' });

      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: itemId } },
      });
      if (existingEnrollment)
        return res.status(400).json({ error: 'Already enrolled in this course' });
    } else {
      const webinar = await prisma.webinar.findUnique({ where: { id: itemId } });
      if (!webinar) return res.status(404).json({ error: 'Webinar not found' });

      const existingRegistration = await prisma.webinarRegistration.findUnique({
        where: { webinarId_userId: { webinarId: itemId, userId } },
      });
      if (existingRegistration)
        return res.status(400).json({ error: 'Already registered for this webinar' });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        status: { in: ['PENDING', 'FAILED', 'CANCELLED'] },
        ...(itemType === 'course' ? { courseId: itemId } : { webinarId: itemId }),
        createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
    });

    let payment;
    const metadata: PaymentMetadata = {
      itemType,
      itemId,
      userId,
      originalAmount: amount,
      couponCode: couponCode || undefined,
    };

    if (existingPayment) {
      if (existingPayment.status === 'COMPLETED') {
        return res
          .status(400)
          .json({ error: 'You already have a completed payment for this item' });
      }

      payment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          amount,
          status: 'PENDING',
          paymentMethod: 'uddoktapay',
          couponCode: couponCode || undefined,
          metadata: metadata as unknown as Prisma.InputJsonValue,
          invoiceId: null,
          gatewayTransactionId: null,
          updatedAt: new Date(),
        },
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          userId,
          amount,
          status: 'PENDING',
          paymentMethod: 'uddoktapay',
          courseId: itemType === 'course' ? itemId : undefined,
          webinarId: itemType === 'webinar' ? itemId : undefined,
          couponCode: couponCode || undefined,
          metadata: metadata as unknown as Prisma.InputJsonValue,
        },
      });
    }

    const uddoktaPayload = {
      full_name: user.name || 'User',
      email: user.email,
      amount: amount.toString(),
      metadata: {
        payment_id: payment.id,
        item_type: itemType,
        item_id: itemId,
        user_id: userId,
      },
      redirect_url: getCallbackUrl(),
      return_type: 'GET',
      cancel_url: `${FRONTEND_URL}/payment/failed?itemType=${itemType}&itemId=${itemId}&reason=cancelled`,
      webhook_url: `${BACKEND_URL}/api/payment/webhook`,
    };

    const uddoktaResponse = await axios.post(`${UDDOKTA_PAY_API_URL}/checkout-v2`, uddoktaPayload, {
      headers: getUddoktaHeaders(),
    });

    if (!uddoktaResponse.data?.status || !uddoktaResponse.data?.payment_url) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });
      return res.status(500).json({ error: 'Failed to create payment session' });
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        metadata: {
          ...metadata,
          uddoktaCheckoutResponse: uddoktaResponse.data,
        } as unknown as Prisma.InputJsonValue,
      },
    });

    return res.json({
      success: true,
      paymentId: payment.id,
      paymentUrl: uddoktaResponse.data.payment_url,
    });
  } catch (error) {
    const err = error as Error & { response?: { data?: unknown } };
    return res.status(500).json({ error: 'Failed to initiate payment', message: err.message });
  }
};

export const handlePaymentCallback = async (req: Request, res: Response) => {
  try {
    const invoice_id = req.query.invoice_id as string;
    if (!invoice_id) {
      return res.redirect(`${FRONTEND_URL}/payment/failed?reason=invalid&message=No invoice ID`);
    }

    let verifyResponse: UddoktaVerifyResponse;
    try {
      const response = await axios.post(
        `${UDDOKTA_PAY_API_URL}/verify-payment`,
        { invoice_id },
        { headers: getUddoktaHeaders() }
      );
      verifyResponse = response.data;
    } catch {
      return res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=verification_failed&message=Could not verify payment`
      );
    }

    if (!verifyResponse.transaction_id) {
      return res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=invalid_response&message=Payment not completed`
      );
    }

    const uddoktaMetadata = verifyResponse.metadata as {
      payment_id?: string;
      item_type?: string;
      item_id?: string;
    };

    if (verifyResponse.status !== 'COMPLETED') {
      const paymentId = uddoktaMetadata?.payment_id;
      const itemType = uddoktaMetadata?.item_type || 'course';
      const itemId = uddoktaMetadata?.item_id || '';

      if (paymentId) {
        const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
        if (payment) {
          const metadata = payment.metadata as unknown as PaymentMetadata;

          let dbStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED' = 'FAILED';
          if (verifyResponse.status === 'PENDING') dbStatus = 'PENDING';
          else if (verifyResponse.status === 'REFUNDED') dbStatus = 'REFUNDED';
          else if (verifyResponse.status === 'CANCELLED') dbStatus = 'CANCELLED';

          await prisma.payment.update({
            where: { id: paymentId },
            data: {
              status: dbStatus,
              invoiceId: invoice_id,
              gatewayTransactionId: verifyResponse.transaction_id,
              metadata: {
                ...metadata,
                uddoktaVerifyResponse: verifyResponse,
              } as unknown as Prisma.InputJsonValue,
            },
          });
        }
      }

      return res.redirect(
        `${FRONTEND_URL}/payment/failed?itemType=${itemType}&itemId=${itemId}&reason=payment_${verifyResponse.status?.toLowerCase()}&message=Payment is ${verifyResponse.status}`
      );
    }

    const paymentId = uddoktaMetadata?.payment_id;
    const payment = paymentId
      ? await prisma.payment.findUnique({ where: { id: paymentId } })
      : await prisma.payment.findFirst({ where: { invoiceId: invoice_id } });

    if (!payment) {
      return res.redirect(
        `${FRONTEND_URL}/payment/failed?reason=not_found&message=Payment record not found`
      );
    }

    if (payment.status === 'COMPLETED') {
      const metadata = payment.metadata as unknown as PaymentMetadata;
      return res.redirect(
        `${FRONTEND_URL}/payment/success?itemType=${metadata.itemType}&itemId=${metadata.itemId}&message=Already enrolled`
      );
    }

    const metadata = payment.metadata as unknown as PaymentMetadata;
    const expectedAmount = payment.amount;
    const paidAmount = parseFloat(verifyResponse.amount);

    if (Math.abs(expectedAmount - paidAmount) > 0.01) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          invoiceId: invoice_id,
          metadata: {
            ...metadata,
            uddoktaVerifyResponse: verifyResponse,
            failureReason: 'Amount mismatch',
          } as unknown as Prisma.InputJsonValue,
        },
      });
      return res.redirect(
        `${FRONTEND_URL}/payment/failed?itemType=${metadata.itemType}&itemId=${metadata.itemId}&reason=amount_mismatch&message=Payment amount mismatch`
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          invoiceId: invoice_id,
          gatewayTransactionId: verifyResponse.transaction_id,
          paymentMethod: verifyResponse.payment_method,
          senderNumber: verifyResponse.sender_number,
          chargedAmount: parseFloat(verifyResponse.charged_amount),
          fee: parseFloat(verifyResponse.fee),
          paidAt: new Date(verifyResponse.date),
          metadata: {
            ...metadata,
            uddoktaVerifyResponse: verifyResponse,
          } as unknown as Prisma.InputJsonValue,
        },
      });

      if (metadata.itemType === 'course') {
        const existing = await tx.enrollment.findUnique({
          where: { userId_courseId: { userId: payment.userId, courseId: metadata.itemId } },
        });
        if (!existing) {
          await tx.enrollment.create({
            data: { userId: payment.userId, courseId: metadata.itemId, status: 'ACTIVE' },
          });
        }
      } else if (metadata.itemType === 'webinar') {
        const existing = await tx.webinarRegistration.findUnique({
          where: { webinarId_userId: { webinarId: metadata.itemId, userId: payment.userId } },
        });
        if (!existing) {
          await tx.webinarRegistration.create({
            data: { userId: payment.userId, webinarId: metadata.itemId },
          });
        }
      }

      return updatedPayment;
    });

    return res.redirect(
      `${FRONTEND_URL}/payment/success?itemType=${metadata.itemType}&itemId=${metadata.itemId}&paymentId=${result.id}`
    );
  } catch (error) {
    const err = error as Error;
    return res.redirect(
      `${FRONTEND_URL}/payment/failed?reason=error&message=${encodeURIComponent(err.message)}`
    );
  }
};

export const handlePaymentWebhook = async (req: Request, res: Response) => {
  try {
    const webhookData = req.body;
    const invoice_id = webhookData.invoice_id;

    if (!invoice_id) {
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    let verifyResponse: UddoktaVerifyResponse;
    try {
      const response = await axios.post(
        `${UDDOKTA_PAY_API_URL}/verify-payment`,
        { invoice_id },
        { headers: getUddoktaHeaders() }
      );
      verifyResponse = response.data;
    } catch {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    if (!verifyResponse.transaction_id) {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const uddoktaMetadata = verifyResponse.metadata as { payment_id?: string };
    const paymentId = uddoktaMetadata?.payment_id;

    const payment = paymentId
      ? await prisma.payment.findUnique({ where: { id: paymentId } })
      : await prisma.payment.findFirst({ where: { invoiceId: invoice_id } });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'COMPLETED') {
      return res.json({ success: true, message: 'Already processed' });
    }

    const metadata = payment.metadata as unknown as PaymentMetadata;

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          invoiceId: invoice_id,
          gatewayTransactionId: verifyResponse.transaction_id,
          paymentMethod: verifyResponse.payment_method,
          senderNumber: verifyResponse.sender_number,
          chargedAmount: parseFloat(verifyResponse.charged_amount),
          fee: parseFloat(verifyResponse.fee),
          paidAt: new Date(verifyResponse.date),
          metadata: {
            ...metadata,
            uddoktaVerifyResponse: verifyResponse,
            uddoktaWebhookData: webhookData,
          } as unknown as Prisma.InputJsonValue,
        },
      });

      if (metadata.itemType === 'course') {
        const existing = await tx.enrollment.findUnique({
          where: { userId_courseId: { userId: payment.userId, courseId: metadata.itemId } },
        });
        if (!existing) {
          await tx.enrollment.create({
            data: { userId: payment.userId, courseId: metadata.itemId, status: 'ACTIVE' },
          });
        }
      } else if (metadata.itemType === 'webinar') {
        const existing = await tx.webinarRegistration.findUnique({
          where: { webinarId_userId: { webinarId: metadata.itemId, userId: payment.userId } },
        });
        if (!existing) {
          await tx.webinarRegistration.create({
            data: { userId: payment.userId, webinarId: metadata.itemId },
          });
        }
      }
    });

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const getPaymentStatus = async (req: Request & AuthRequest, res: Response) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payment = await prisma.payment.findFirst({
      where: { id: transactionId, userId },
      select: {
        id: true,
        status: true,
        amount: true,
        chargedAmount: true,
        paymentMethod: true,
        paidAt: true,
        createdAt: true,
        courseId: true,
        webinarId: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    return res.json({ success: true, payment });
  } catch {
    return res.status(500).json({ error: 'Failed to get payment status' });
  }
};

export const refundPayment = async (req: Request & AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const validation = refundPaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }

    const { paymentId, amount, reason } = validation.data;

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only refund completed payments' });
    }

    if (!payment.gatewayTransactionId || !payment.paymentMethod) {
      return res.status(400).json({ error: 'Payment missing required refund data' });
    }

    if (amount > payment.amount) {
      return res.status(400).json({ error: 'Refund amount cannot exceed payment amount' });
    }

    const metadata = payment.metadata as unknown as PaymentMetadata;

    const refundPayload = {
      transaction_id: payment.gatewayTransactionId,
      payment_method: payment.paymentMethod,
      amount: amount.toString(),
      product_name: metadata.itemType === 'course' ? 'Course Enrollment' : 'Webinar Registration',
      reason: reason,
    };

    try {
      const refundResponse = await axios.post(
        `${UDDOKTA_PAY_API_URL}/refund-payment`,
        refundPayload,
        { headers: getUddoktaHeaders() }
      );

      if (!refundResponse.data?.status) {
        return res.status(400).json({
          error: 'Refund failed',
          message: refundResponse.data?.message || 'Unknown error',
        });
      }

      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          refundedAt: new Date(),
          refundAmount: amount,
          refundReason: reason,
          metadata: {
            ...metadata,
            refundResponse: refundResponse.data,
          } as unknown as Prisma.InputJsonValue,
        },
      });

      return res.json({ success: true, message: 'Refund processed successfully' });
    } catch (refundError) {
      const err = refundError as Error;
      return res.status(500).json({ error: 'Refund failed', message: err.message });
    }
  } catch {
    return res.status(500).json({ error: 'Failed to process refund' });
  }
};

export const enrollFree = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { itemType, itemId } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({ error: 'itemType and itemId are required' });
    }

    if (itemType === 'course') {
      const course = await prisma.course.findUnique({ where: { id: itemId } });
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      if (!course.published) {
        return res.status(400).json({ error: 'Course is not available' });
      }
      if (course.feeType !== 'FREE') {
        return res.status(400).json({ error: 'This course requires payment' });
      }

      const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: itemId } },
      });
      if (existing) {
        return res.json({ success: true, message: 'Already enrolled', enrollment: existing });
      }

      const enrollment = await prisma.enrollment.create({
        data: { userId, courseId: itemId, status: 'ACTIVE' },
      });

      return res.json({ success: true, message: 'Enrolled successfully', enrollment });
    } else if (itemType === 'webinar') {
      const webinar = await prisma.webinar.findUnique({ where: { id: itemId } });
      if (!webinar) {
        return res.status(404).json({ error: 'Webinar not found' });
      }
      if (webinar.feeType !== 'free') {
        return res.status(400).json({ error: 'This webinar requires payment' });
      }

      const existing = await prisma.webinarRegistration.findUnique({
        where: { webinarId_userId: { webinarId: itemId, userId } },
      });
      if (existing) {
        return res.json({ success: true, message: 'Already registered', registration: existing });
      }

      const registration = await prisma.webinarRegistration.create({
        data: { userId, webinarId: itemId },
      });

      return res.json({ success: true, message: 'Registered successfully', registration });
    }

    return res.status(400).json({ error: 'Invalid itemType' });
  } catch {
    return res.status(500).json({ error: 'Failed to enroll' });
  }
};

export const checkEnrollmentStatus = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { itemType, itemId } = req.query;

    if (!itemType || !itemId) {
      return res.status(400).json({ error: 'itemType and itemId are required' });
    }

    if (itemType === 'course') {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: itemId as string } },
      });
      return res.json({ enrolled: !!enrollment, enrollment });
    } else if (itemType === 'webinar') {
      const registration = await prisma.webinarRegistration.findUnique({
        where: { webinarId_userId: { webinarId: itemId as string, userId } },
      });
      return res.json({ enrolled: !!registration, registration });
    }

    return res.status(400).json({ error: 'Invalid itemType' });
  } catch {
    return res.status(500).json({ error: 'Failed to check enrollment status' });
  }
};

export const getAdminPayments = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

    const validation = adminPaymentsQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid query params', details: validation.error });
    }

    const { page, limit, search, status, courseId, webinarId } = validation.data;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (status !== 'all') {
      if (status === 'FREE') {
        where.amount = 0;
        where.status = 'COMPLETED';
      } else {
        where.status = status;
      }
    }

    if (courseId && courseId !== 'all') where.courseId = courseId;
    if (webinarId && webinarId !== 'all') where.webinarId = webinarId;

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { transactionId: { contains: search, mode: 'insensitive' } },
        { invoiceId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [payments, totalPayments, stats, freePaymentsCount] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          webinar: { select: { id: true, title: true } },
        },
      }),
      prisma.payment.count({ where }),
      prisma.payment.groupBy({ by: ['status'], _count: true, _sum: { amount: true } }),
      prisma.payment.count({ where: { amount: 0, status: 'COMPLETED' } }),
    ]);

    const shouldIncludeFreeEnrollments =
      (status === 'all' || status === 'FREE') && (!webinarId || webinarId === 'all');

    interface EnrollmentRecord {
      id: string;
      userId: string;
      courseId: string;
      enrolledAt: Date;
      user: { id: string; name: string | null; email: string; avatarUrl: string | null };
      course: { id: string; title: string; feeType: string; price: number | null };
    }

    let enrollmentsWithoutPayment: EnrollmentRecord[] = [];

    if (shouldIncludeFreeEnrollments) {
      const enrollmentWhere: Record<string, unknown> = { course: { feeType: 'FREE' } };
      if (courseId && courseId !== 'all') enrollmentWhere.courseId = courseId;
      if (search) {
        enrollmentWhere.OR = [
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
        ];
      }

      const freeEnrollments = await prisma.enrollment.findMany({
        where: enrollmentWhere,
        orderBy: { enrolledAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          course: { select: { id: true, title: true, feeType: true, price: true } },
        },
      });

      if (freeEnrollments.length > 0) {
        const existingPayments = await prisma.payment.findMany({
          where: {
            userId: { in: freeEnrollments.map((e) => e.userId) },
            courseId: { in: freeEnrollments.map((e) => e.courseId) },
          },
          select: { userId: true, courseId: true },
        });

        const paymentKeys = new Set(existingPayments.map((p) => `${p.userId}-${p.courseId}`));
        enrollmentsWithoutPayment = freeEnrollments.filter(
          (e) => !paymentKeys.has(`${e.userId}-${e.courseId}`)
        );
      }
    }

    const enrollmentAsPseudoPayments = enrollmentsWithoutPayment.map((e) => ({
      id: e.id,
      isPseudoPayment: true,
      enrollmentId: e.id,
      userId: e.userId,
      courseId: e.courseId,
      webinarId: null,
      amount: 0,
      chargedAmount: null,
      fee: null,
      status: 'COMPLETED' as const,
      transactionId: null,
      invoiceId: null,
      gatewayTransactionId: null,
      paymentMethod: 'free',
      senderNumber: null,
      couponCode: null,
      paidAt: null,
      refundedAt: null,
      refundAmount: null,
      refundReason: null,
      metadata: null,
      createdAt: e.enrolledAt,
      updatedAt: e.enrolledAt,
      user: e.user,
      webinar: null,
      course: e.course,
    }));

    const allRecords = [...payments, ...enrollmentAsPseudoPayments]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    const courseIds = [
      ...new Set(
        allRecords
          .filter((p) => p.courseId && !('course' in p && p.course))
          .map((p) => p.courseId as string)
      ),
    ];

    if (courseIds.length > 0) {
      const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true },
      });
      const courseMap = new Map(courses.map((c) => [c.id, c]));

      allRecords.forEach((record) => {
        if (record.courseId && !('course' in record && record.course)) {
          (record as typeof record & { course?: { id: string; title: string } | null }).course =
            courseMap.get(record.courseId) || null;
        }
      });
    }

    return res.json({
      success: true,
      data: allRecords,
      stats: {
        total: totalPayments + enrollmentsWithoutPayment.length,
        pending: stats.find((s) => s.status === 'PENDING')?._count || 0,
        completed: stats.find((s) => s.status === 'COMPLETED')?._count || 0,
        failed: stats.find((s) => s.status === 'FAILED')?._count || 0,
        refunded: stats.find((s) => s.status === 'REFUNDED')?._count || 0,
        freeEnrollments: freePaymentsCount + enrollmentsWithoutPayment.length,
        totalRevenue: stats.find((s) => s.status === 'COMPLETED')?._sum?.amount || 0,
      },
      pagination: {
        page,
        limit,
        total: totalPayments + enrollmentsWithoutPayment.length,
        totalPages: Math.ceil((totalPayments + enrollmentsWithoutPayment.length) / limit),
      },
    });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const getAdminEnrollments = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const validation = adminPaymentsQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid query params', details: validation.error });
    }

    const { page, limit, search, courseId } = validation.data;
    const skip = (page - 1) * limit;

    const enrollmentWhere: Record<string, unknown> = {};
    const webinarWhere: Record<string, unknown> = {};

    if (courseId && courseId !== 'all') {
      enrollmentWhere.courseId = courseId;
    }

    if (search) {
      enrollmentWhere.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
      webinarWhere.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [enrollments, webinarRegistrations, totalEnrollments, totalWebinarRegs] =
      await Promise.all([
        prisma.enrollment.findMany({
          where: enrollmentWhere,
          skip,
          take: limit,
          orderBy: { enrolledAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
            course: { select: { id: true, title: true, feeType: true, price: true } },
          },
        }),
        prisma.webinarRegistration.findMany({
          where: webinarWhere,
          skip,
          take: limit,
          orderBy: { registeredAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
            webinar: { select: { id: true, title: true, feeType: true, price: true } },
          },
        }),
        prisma.enrollment.count({ where: enrollmentWhere }),
        prisma.webinarRegistration.count({ where: webinarWhere }),
      ]);

    const combinedData = [
      ...enrollments.map((e) => ({
        id: e.id,
        type: 'course' as const,
        user: e.user,
        item: e.course,
        status: e.status,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        isFree: e.course.feeType === 'FREE',
      })),
      ...webinarRegistrations.map((r) => ({
        id: r.id,
        type: 'webinar' as const,
        user: r.user,
        item: r.webinar,
        status: 'REGISTERED',
        enrolledAt: r.registeredAt,
        completedAt: null,
        isFree: r.webinar.feeType === 'free',
      })),
    ].sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime());

    const total = totalEnrollments + totalWebinarRegs;

    return res.json({
      success: true,
      data: combinedData.slice(0, limit),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
};

export const adminRefundPayment = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } });
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const validation = adminRefundSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }

    const { paymentId, reason, adminPassword, refundAmount } = validation.data;

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
    const adminPasswords = (process.env.ADMIN_PASSWORDS || '').split(',');
    const adminIndex = adminEmails.findIndex((e) => e.trim() === admin.email);

    if (adminIndex === -1 || adminPasswords[adminIndex]?.trim() !== adminPassword) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        webinar: { select: { id: true, title: true } },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'REFUNDED') {
      return res.status(400).json({ error: 'Payment already refunded' });
    }

    if (payment.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Only completed payments can be refunded' });
    }

    if (payment.amount === 0) {
      return res.status(400).json({ error: 'Free enrollments cannot be refunded' });
    }

    // Determine the actual refund amount (default to full payment amount)
    const actualRefundAmount =
      refundAmount && refundAmount <= payment.amount ? refundAmount : payment.amount;

    if (refundAmount && refundAmount > payment.amount) {
      return res.status(400).json({
        error: 'Refund amount cannot exceed payment amount',
        maxAmount: payment.amount,
      });
    }

    if (!payment.gatewayTransactionId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          refundedAt: new Date(),
          refundAmount: actualRefundAmount,
          refundReason: reason,
        },
      });

      return res.json({
        success: true,
        message: 'Payment marked as refunded (no gateway transaction)',
        refundAmount: actualRefundAmount,
      });
    }

    const refundPayload = {
      transaction_id: payment.gatewayTransactionId,
      payment_method: payment.paymentMethod,
      amount: actualRefundAmount.toString(),
      product_name: payment.courseId ? 'Course Enrollment' : 'Webinar Registration',
      reason: reason,
    };

    try {
      const refundResponse = await axios.post(
        `${UDDOKTA_PAY_API_URL}/refund-payment`,
        refundPayload,
        { headers: getUddoktaHeaders() }
      );

      if (!refundResponse.data?.status) {
        return res.status(400).json({
          error: 'Refund failed',
          message: refundResponse.data?.message || 'Unknown error from gateway',
        });
      }

      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          refundedAt: new Date(),
          refundAmount: actualRefundAmount,
          refundReason: reason,
          metadata: {
            ...(payment.metadata as Record<string, unknown>),
            refundResponse: refundResponse.data,
            refundedBy: userId,
          } as unknown as Prisma.InputJsonValue,
        },
      });

      return res.json({
        success: true,
        message: 'Refund processed successfully',
        refundAmount: actualRefundAmount,
      });
    } catch (refundError) {
      const err = refundError as { response?: { data?: { message?: string } } };
      return res.status(500).json({
        error: 'Refund gateway error',
        message: err.response?.data?.message || 'Failed to process refund',
      });
    }
  } catch {
    return res.status(500).json({ error: 'Failed to process refund' });
  }
};

export const adminDeletePayment = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } });
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const validation = adminDeletePaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }

    const { paymentId, adminPassword, isPseudoPayment } = validation.data;

    // Validate admin password
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
    const adminPasswords = (process.env.ADMIN_PASSWORDS || '').split(',');
    const adminIndex = adminEmails.findIndex((e) => e.trim() === admin.email);

    if (adminIndex === -1 || adminPasswords[adminIndex]?.trim() !== adminPassword) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    // Handle pseudo payments (free enrollments without payment record)
    // For free enrollments, delete the enrollment since there's no payment record
    if (isPseudoPayment) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: paymentId },
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true } },
        },
      });

      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      // Delete the free enrollment
      await prisma.enrollment.delete({
        where: { id: paymentId },
      });

      return res.json({
        success: true,
        message: 'Free enrollment deleted successfully',
        deletedPayment: {
          id: enrollment.id,
          amount: 0,
          user: enrollment.user.name || enrollment.user.email,
          item: enrollment.course.title,
        },
      });
    }

    // Handle real payment records
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        webinar: { select: { id: true, title: true } },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Fetch course title if payment is for a course
    let courseTitle: string | null = null;
    if (payment.courseId) {
      const course = await prisma.course.findUnique({
        where: { id: payment.courseId },
        select: { title: true },
      });
      courseTitle = course?.title || null;
    }

    // Only delete enrollment/registration if payment was COMPLETED
    // For other statuses (PENDING, FAILED, etc.), only delete the payment record
    if (payment.status === 'COMPLETED') {
      if (payment.courseId) {
        await prisma.enrollment.deleteMany({
          where: { userId: payment.userId, courseId: payment.courseId },
        });
      }
      if (payment.webinarId) {
        await prisma.webinarRegistration.deleteMany({
          where: { userId: payment.userId, webinarId: payment.webinarId },
        });
      }
    }

    // Delete the payment record
    await prisma.payment.delete({
      where: { id: paymentId },
    });

    return res.json({
      success: true,
      message: 'Payment record deleted successfully',
      deletedPayment: {
        id: payment.id,
        amount: payment.amount,
        user: payment.user.name || payment.user.email,
        item: courseTitle || payment.webinar?.title,
      },
    });
  } catch {
    return res.status(500).json({ error: 'Failed to delete payment record' });
  }
};

export const getPaymentStats = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const [paymentStats, enrollmentCount, webinarRegCount, monthlyPayments] = await Promise.all([
      prisma.payment.groupBy({
        by: ['status'],
        _count: true,
        _sum: { amount: true },
      }),
      prisma.enrollment.count(),
      prisma.webinarRegistration.count(),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: new Date(new Date().setDate(1)) },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalRevenue = paymentStats.find((s) => s.status === 'COMPLETED')?._sum?.amount || 0;
    const refundedAmount = paymentStats.find((s) => s.status === 'REFUNDED')?._sum?.amount || 0;

    return res.json({
      success: true,
      data: {
        totalPayments: paymentStats.reduce((sum, s) => sum + s._count, 0),
        completedPayments: paymentStats.find((s) => s.status === 'COMPLETED')?._count || 0,
        pendingPayments: paymentStats.find((s) => s.status === 'PENDING')?._count || 0,
        failedPayments: paymentStats.find((s) => s.status === 'FAILED')?._count || 0,
        refundedPayments: paymentStats.find((s) => s.status === 'REFUNDED')?._count || 0,
        totalRevenue,
        refundedAmount,
        netRevenue: totalRevenue - refundedAmount,
        totalEnrollments: enrollmentCount,
        totalWebinarRegistrations: webinarRegCount,
        monthlyRevenue: monthlyPayments._sum?.amount || 0,
        monthlyTransactions: monthlyPayments._count || 0,
      },
    });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch payment stats' });
  }
};
