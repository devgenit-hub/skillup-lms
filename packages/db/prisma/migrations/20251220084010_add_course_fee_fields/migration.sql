-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('FREE', 'PAID');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "feeType" "FeeType" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "price" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "courses_feeType_idx" ON "courses"("feeType");
