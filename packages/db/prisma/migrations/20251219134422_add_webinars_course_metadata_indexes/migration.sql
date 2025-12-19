-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "metadata" JSONB;

-- CreateTable
CREATE TABLE "webinars" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "scheduleDateTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "feeType" TEXT NOT NULL DEFAULT 'free',
    "price" DOUBLE PRECISION,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sessionHighlights" TEXT,
    "aboutWebinar" TEXT,
    "speakers" JSONB,
    "sessionAgenda" JSONB,
    "resources" JSONB,
    "liveLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webinars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webinar_registrations" (
    "id" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinar_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_teachers" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "webinars_status_idx" ON "webinars"("status");

-- CreateIndex
CREATE INDEX "webinars_scheduleDateTime_idx" ON "webinars"("scheduleDateTime");

-- CreateIndex
CREATE INDEX "webinar_registrations_webinarId_idx" ON "webinar_registrations"("webinarId");

-- CreateIndex
CREATE INDEX "webinar_registrations_userId_idx" ON "webinar_registrations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "webinar_registrations_webinarId_userId_key" ON "webinar_registrations"("webinarId", "userId");

-- CreateIndex
CREATE INDEX "course_teachers_courseId_idx" ON "course_teachers"("courseId");

-- CreateIndex
CREATE INDEX "course_teachers_teacherId_idx" ON "course_teachers"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "course_teachers_courseId_teacherId_key" ON "course_teachers"("courseId", "teacherId");

-- CreateIndex
CREATE INDEX "courses_published_idx" ON "courses"("published");

-- CreateIndex
CREATE INDEX "users_suspended_idx" ON "users"("suspended");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "webinar_registrations" ADD CONSTRAINT "webinar_registrations_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
