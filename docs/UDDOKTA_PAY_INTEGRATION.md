# Uddokta Pay Payment Integration Setup

## Environment Variables Required

Add these to your `.env` file:

```bash
# Uddokta Pay Configuration
# For sandbox testing
UDDOKTA_PAY_API_URL=https://sandbox.uddoktapay.com/api
UDDOKTA_PAY_API_KEY=your_sandbox_api_key_here
UDDOKTA_PAY_API_SECRET=your_sandbox_api_secret_here

# For production
# UDDOKTA_PAY_API_URL=https://uddoktapay.com/api
# UDDOKTA_PAY_API_KEY=your_production_api_key_here
# UDDOKTA_PAY_API_SECRET=your_production_api_secret_here

# URLs for callbacks
BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_URL=http://localhost:3000
```

## Getting Uddokta Pay Credentials

1. Go to [Uddokta Pay](https://uddoktapay.com) and create an account
2. Navigate to Settings > API Keys
3. Generate API Key and API Secret for sandbox/production
4. Copy the credentials and add them to your `.env` file

## Payment Flow

### 1. User Initiates Payment

- User clicks "পেমেন্ট সম্পন্ন করুন" button on payment page
- Frontend calls `POST /api/payment/init` with:
  - `itemType`: 'course' or 'webinar'
  - `itemId`: course/webinar ID
  - `amount`: final price after discount
  - `couponCode`: selected coupon code (optional)

### 2. Backend Creates Transaction

- Validates user authentication
- Checks if item (course/webinar) exists
- Checks if user already enrolled/registered
- Creates transaction record in database
- Calls Uddokta Pay API to get payment URL
- Returns payment URL to frontend

### 3. User Redirected to Uddokta Pay

- User is redirected to Uddokta Pay checkout page
- User completes payment using available methods:
  - bKash
  - Nagad
  - Rocket
  - Bank transfer
  - Card payment

### 4. Payment Callback

- After payment, Uddokta Pay redirects to `GET /api/payment/callback`
- Backend verifies payment with Uddokta Pay API
- Updates transaction status
- Creates enrollment (course) or registration (webinar)
- Redirects user to course/webinar page with success message

### 5. Webhook Notification (Server-to-Server)

- Uddokta Pay sends webhook to `POST /api/payment/webhook`
- Backend processes webhook and creates enrollment/registration if not already done
- This ensures enrollment even if user closes browser before callback

## Testing with Sandbox

1. Use sandbox credentials in `.env`
2. Uddokta Pay sandbox provides test payment methods
3. No real money is charged in sandbox mode
4. You can test success/failure scenarios

## API Endpoints

### POST /api/payment/init

Initialize payment (requires authentication)

**Request:**

```json
{
  "itemType": "course",
  "itemId": "clx123abc",
  "amount": 3500,
  "couponCode": "WINTER_OFF"
}
```

**Response:**

```json
{
  "success": true,
  "transactionId": "tx_123abc",
  "paymentUrl": "https://sandbox.uddoktapay.com/checkout/abc123"
}
```

### GET /api/payment/callback

Payment callback (public endpoint)

**Query Params:**

- `invoice_id`: Uddokta Pay invoice ID
- `transaction_id`: Uddokta Pay transaction ID
- `status`: success/failed/canceled

**Response:**
Redirects to frontend with status

### POST /api/payment/webhook

Payment webhook (public endpoint)

**Request:**

```json
{
  "invoice_id": "inv_123",
  "transaction_id": "tx_123",
  "status": "COMPLETED",
  "metadata": {}
}
```

**Response:**

```json
{
  "success": true
}
```

### GET /api/payment/status/:transactionId

Get payment status (requires authentication)

**Response:**

```json
{
  "success": true,
  "transaction": {
    "id": "tx_123",
    "status": "completed",
    "amount": 3500,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## Frontend Components

### Payment Page (`/payment`)

- Fetches course/webinar data
- Shows pricing summary with discount calculation
- Manual coupon code input
- List of available coupons
- Auto-applies maximum discount coupon
- Payment button that calls backend API

## Database Schema Updates Required

Add to `schema.prisma`:

```prisma
model Transaction {
  id                    String   @id @default(cuid())
  userId                String
  user                  User     @relation(fields: [userId], references: [id])
  amount                Float
  status                String   @default("pending") // pending, completed, failed, cancelled
  paymentMethod         String   @default("uddoktapay")
  gatewayTransactionId  String?
  courseId              String?
  course                Course?  @relation(fields: [courseId], references: [id])
  webinarId             String?
  webinar               Webinar? @relation(fields: [webinarId], references: [id])
  couponCode            String?
  metadata              Json?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([userId])
  @@index([gatewayTransactionId])
}
```

Remember to run migrations after updating schema:

```bash
cd packages/db
npx prisma migrate dev --name add_transactions
```

## Troubleshooting

1. **Payment URL not generated**: Check API credentials and sandbox URL
2. **Callback not working**: Ensure BACKEND_URL is accessible from Uddokta Pay servers (use ngrok for local testing)
3. **Enrollment not created**: Check webhook endpoint and database constraints
4. **CORS errors**: Ensure backend allows frontend origin

## Production Checklist

- [ ] Change to production Uddokta Pay URL
- [ ] Use production API credentials
- [ ] Configure production callback URLs
- [ ] Test full payment flow
- [ ] Monitor webhook logs
- [ ] Set up error alerting
- [ ] Add payment retry mechanism
- [ ] Implement refund functionality
