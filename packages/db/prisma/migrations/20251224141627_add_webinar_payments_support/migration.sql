-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "webinarId" TEXT,
ALTER COLUMN "courseId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "payments_webinarId_idx" ON "payments"("webinarId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
