-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "webinarId" TEXT;

-- CreateIndex
CREATE INDEX "coupons_webinarId_idx" ON "coupons"("webinarId");

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
