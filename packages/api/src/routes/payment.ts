import { Router, type Router as RouterType } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  initiatePayment,
  handlePaymentCallback,
  handlePaymentWebhook,
  getPaymentStatus,
} from '../controllers/payment.controller';

const router: RouterType = Router();

// Initiate payment (protected)
router.post('/init', authenticate, initiatePayment);

// Payment callback (after user redirected from payment gateway)
router.get('/callback', handlePaymentCallback);

// Payment webhook (server-to-server notification from payment gateway)
router.post('/webhook', handlePaymentWebhook);

// Get payment status (protected)
router.get('/status/:transactionId', authenticate, getPaymentStatus);

export default router;
