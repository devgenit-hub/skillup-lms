import { Router, type Router as RouterType } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  initiatePayment,
  handlePaymentCallback,
  handlePaymentWebhook,
  getPaymentStatus,
  refundPayment,
  enrollFree,
  checkEnrollmentStatus,
  checkExistingPayment,
  getAdminPayments,
  getAdminEnrollments,
  adminRefundPayment,
  adminDeletePayment,
  getPaymentStats,
} from '../controllers/payment.controller';

const router: RouterType = Router();

router.post('/init', authenticate, initiatePayment);
router.get('/callback', handlePaymentCallback);
router.post('/webhook', handlePaymentWebhook);
router.get('/status/:transactionId', authenticate, getPaymentStatus);
router.post('/refund', authenticate, refundPayment);
router.post('/enroll-free', authenticate, enrollFree);
router.get('/enrollment-status', authenticate, checkEnrollmentStatus);
router.get('/check-existing', authenticate, checkExistingPayment);

router.get('/admin/payments', authenticate, getAdminPayments);
router.get('/admin/enrollments', authenticate, getAdminEnrollments);
router.post('/admin/refund', authenticate, adminRefundPayment);
router.delete('/admin/payment', authenticate, adminDeletePayment);
router.get('/admin/stats', authenticate, getPaymentStats);

export default router;
