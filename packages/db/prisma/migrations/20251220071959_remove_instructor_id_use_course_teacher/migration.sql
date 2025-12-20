/*
  Warnings:

  - You are about to drop the column `instructorId` on the `courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_instructorId_fkey";

-- DropIndex
DROP INDEX "courses_instructorId_idx";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "instructorId";
