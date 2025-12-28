-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "gatewayTransactionId" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'uddoktapay';

-- CreateIndex
CREATE INDEX "payments_gatewayTransactionId_idx" ON "payments"("gatewayTransactionId");
