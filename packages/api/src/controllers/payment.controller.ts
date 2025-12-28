import { Response, Request } from 'express';
import { prisma, Prisma } from '@repo/db';
import axios from 'axios';
import { z } from 'zod';

interface AuthRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface PaymentMetadata {
  itemType: 'course' | 'webinar';
  itemId: string;
  uddokta_response?: Record<string, unknown>;
  verification?: Record<string, unknown>;
  webhook?: Record<string, unknown>;
}

// Environment variables
const UDDOKTA_PAY_API_KEY = process.env.UDDOKTA_PAY_API_KEY || '';
const UDDOKTA_PAY_API_URL = process.env.UDDOKTA_PAY_API_URL || 'https://sandbox.uddoktapay.com/api';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Validation schema
const initiatePaymentSchema = z.object({
  itemType: z.enum(['course', 'webinar']),
  itemId: z.string(),
  amount: z.number().positive(),
  couponCode: z.string().optional(),
});

export const initiatePayment = async (req: Request & AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validation = initiatePaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error });
    }

    const { itemType, itemId, amount, couponCode } = validation.data;

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if item exists
    if (itemType === 'course') {
      const course = await prisma.course.findUnique({ where: { id: itemId } });
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: { userId, courseId: itemId },
      });

      if (existingEnrollment) {
        return res.status(400).json({ error: 'Already enrolled in this course' });
      }
    } else {
      const webinar = await prisma.webinar.findUnique({ where: { id: itemId } });
      if (!webinar) {
        return res.status(404).json({ error: 'Webinar not found' });
      }

      // Check if already registered
      const existingRegistration = await prisma.webinarRegistration.findFirst({
        where: { userId, webinarId: itemId },
      });

      if (existingRegistration) {
        return res.status(400).json({ error: 'Already registered for this webinar' });
      }
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        status: 'PENDING',
        paymentMethod: 'uddoktapay',
        courseId: itemType === 'course' ? itemId : undefined,
        webinarId: itemType === 'webinar' ? itemId : undefined,
        couponCode: couponCode || undefined,
        metadata: {
          itemType,
          itemId,
        },
      },
    });

    // Prepare Uddokta Pay payment request
    const paymentData = {
      full_name: user.name || 'User',
      email: user.email,
      amount: amount,
      metadata: {
        payment_id: payment.id,
        item_type: itemType,
        item_id: itemId,
        user_id: userId,
      },
      redirect_url: `${BACKEND_URL}/api/payment/callback`,
      return_type: 'GET',
      cancel_url: `${FRONTEND_URL}/payment/failed?itemType=${itemType}&itemId=${itemId}&message=Payment cancelled&reason=cancelled`,
      webhook_url: `${BACKEND_URL}/api/payment/webhook`,
    };

    // Call Uddokta Pay API
    const uddoktaResponse = await axios.post(`${UDDOKTA_PAY_API_URL}/checkout-v2`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'RT-UDDOKTAPAY-API-KEY': UDDOKTA_PAY_API_KEY,
      },
    });

    if (uddoktaResponse.data && uddoktaResponse.data.payment_url) {
      // Update payment with gateway response
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          gatewayTransactionId:
            uddoktaResponse.data.invoice_id || uddoktaResponse.data.transaction_id,
          metadata: {
            ...(payment.metadata as unknown as PaymentMetadata),
            uddokta_response: uddoktaResponse.data,
          } as unknown as Prisma.InputJsonValue,
        },
      });

      return res.json({
        success: true,
        paymentId: payment.id,
        paymentUrl: uddoktaResponse.data.payment_url,
      });
    } else {
      throw new Error('Invalid response from payment gateway');
    }
  } catch (error) {
    const err = error as Error;
    console.error('Payment initiation error:', err);
    return res.status(500).json({
      error: 'Failed to initiate payment',
      message: err.message,
    });
  }
};

export const handlePaymentCallback = async (req: Request, res: Response) => {
  try {
    const { invoice_id, status } = req.query;

    if (!invoice_id || !status) {
      return res.redirect(
        `${FRONTEND_URL}/payment/failed?message=Invalid payment callback&reason=failed`
      );
    }

    // Find payment by gateway transaction ID
    const payment = await prisma.payment.findFirst({
      where: {
        gatewayTransactionId: invoice_id as string,
      },
      include: {
        user: true,
      },
    });

    if (!payment) {
      return res.redirect(`${FRONTEND_URL}/payment/failed?message=Payment not found&reason=failed`);
    }

    const metadata = payment.metadata as unknown as PaymentMetadata;

    if (status === 'success') {
      // Verify payment with Uddokta Pay API
      const verifyResponse = await axios.post(
        `${UDDOKTA_PAY_API_URL}/verify-payment`,
        { invoice_id },
        {
          headers: {
            'Content-Type': 'application/json',
            'RT-UDDOKTAPAY-API-KEY': UDDOKTA_PAY_API_KEY,
          },
        }
      );

      if (verifyResponse.data && verifyResponse.data.status === 'COMPLETED') {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            metadata: {
              ...metadata,
              verification: verifyResponse.data,
            } as unknown as Prisma.InputJsonValue,
          },
        });

        // Create enrollment or registration
        if (metadata.itemType === 'course') {
          await prisma.enrollment.create({
            data: {
              userId: payment.userId,
              courseId: metadata.itemId,
              status: 'ACTIVE',
            },
          });

          return res.redirect(
            `${FRONTEND_URL}/payment/success?itemType=course&itemId=${metadata.itemId}&message=Enrollment successful`
          );
        } else if (metadata.itemType === 'webinar') {
          await prisma.webinarRegistration.create({
            data: {
              userId: payment.userId,
              webinarId: metadata.itemId,
            },
          });

          return res.redirect(
            `${FRONTEND_URL}/payment/success?itemType=webinar&itemId=${metadata.itemId}&message=Registration successful`
          );
        }
      } else {
        // Payment verification failed
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED' },
        });

        return res.redirect(
          `${FRONTEND_URL}/payment/failed?itemType=${metadata.itemType}&itemId=${metadata.itemId}&message=Payment verification failed&reason=failed`
        );
      }
    } else {
      // Payment was not successful
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: status === 'canceled' ? 'CANCELLED' : 'FAILED' },
      });

      return res.redirect(
        `${FRONTEND_URL}/payment/failed?itemType=${metadata.itemType}&itemId=${metadata.itemId}&message=Payment ${status === 'canceled' ? 'cancelled' : 'failed'}&reason=${status === 'canceled' ? 'cancelled' : 'failed'}`
      );
    }
  } catch (error) {
    const err = error as Error;
    console.error('Payment callback error:', err);
    return res.redirect(
      `${FRONTEND_URL}/payment/failed?message=${encodeURIComponent(err.message)}&reason=failed`
    );
  }
};

export const handlePaymentWebhook = async (req: Request, res: Response) => {
  try {
    const { invoice_id, status } = req.body;

    if (!invoice_id || !status) {
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    // Find payment
    const payment = await prisma.payment.findFirst({
      where: {
        gatewayTransactionId: invoice_id,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const paymentMetadata = payment.metadata as unknown as PaymentMetadata;

    // Update payment based on webhook status
    if (status === 'COMPLETED') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          metadata: {
            ...paymentMetadata,
            webhook: req.body,
          } as unknown as Prisma.InputJsonValue,
        },
      });

      // Create enrollment or registration if not already created
      if (paymentMetadata.itemType === 'course') {
        const existingEnrollment = await prisma.enrollment.findFirst({
          where: {
            userId: payment.userId,
            courseId: paymentMetadata.itemId,
          },
        });

        if (!existingEnrollment) {
          await prisma.enrollment.create({
            data: {
              userId: payment.userId,
              courseId: paymentMetadata.itemId,
              status: 'ACTIVE',
            },
          });
        }
      } else if (paymentMetadata.itemType === 'webinar') {
        const existingRegistration = await prisma.webinarRegistration.findFirst({
          where: {
            userId: payment.userId,
            webinarId: paymentMetadata.itemId,
          },
        });

        if (!existingRegistration) {
          await prisma.webinarRegistration.create({
            data: {
              userId: payment.userId,
              webinarId: paymentMetadata.itemId,
            },
          });
        }
      }
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: status === 'CANCELLED' ? 'CANCELLED' : 'FAILED',
          metadata: {
            ...paymentMetadata,
            webhook: req.body,
          } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    return res.json({ success: true });
  } catch (error) {
    const err = error as Error;
    console.error('Webhook error:', err);
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
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    return res.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error('Get payment status error:', err);
    return res.status(500).json({ error: 'Failed to get payment status' });
  }
};
