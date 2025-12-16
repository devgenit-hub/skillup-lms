/*
  Warnings:

  - You are about to drop the column `userId` on the `teachers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supabaseId]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supabaseId` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."teachers" DROP CONSTRAINT "teachers_userId_fkey";

-- DropIndex
DROP INDEX "public"."teachers_userId_idx";

-- DropIndex
DROP INDEX "public"."teachers_userId_key";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "userId",
ADD COLUMN     "supabaseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teachers_supabaseId_key" ON "teachers"("supabaseId");

-- CreateIndex
CREATE INDEX "teachers_supabaseId_idx" ON "teachers"("supabaseId");
