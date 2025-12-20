-- CreateTable
CREATE TABLE "curriculum_modules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_classes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT,
    "duration" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_materials" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_materials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "curriculum_modules_courseId_idx" ON "curriculum_modules"("courseId");

-- CreateIndex
CREATE INDEX "curriculum_modules_order_idx" ON "curriculum_modules"("order");

-- CreateIndex
CREATE INDEX "curriculum_classes_moduleId_idx" ON "curriculum_classes"("moduleId");

-- CreateIndex
CREATE INDEX "curriculum_classes_order_idx" ON "curriculum_classes"("order");

-- CreateIndex
CREATE INDEX "curriculum_materials_moduleId_idx" ON "curriculum_materials"("moduleId");

-- CreateIndex
CREATE INDEX "curriculum_materials_order_idx" ON "curriculum_materials"("order");

-- AddForeignKey
ALTER TABLE "curriculum_modules" ADD CONSTRAINT "curriculum_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_classes" ADD CONSTRAINT "curriculum_classes_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "curriculum_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_materials" ADD CONSTRAINT "curriculum_materials_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "curriculum_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
