/*
  Warnings:

  - A unique constraint covering the columns `[supabaseId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supabaseId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');

-- AlterTable - Add columns with nullable first
ALTER TABLE "users" ADD COLUMN "avatarUrl" TEXT,
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "lastLoginAt" TIMESTAMP(3),
ADD COLUMN "provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
ADD COLUMN "supabaseId" TEXT;

-- Update existing users with temporary supabaseId (using their existing id)
UPDATE "users" SET "supabaseId" = "id" WHERE "supabaseId" IS NULL;

-- Make supabaseId required
ALTER TABLE "users" ALTER COLUMN "supabaseId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_supabaseId_key" ON "users"("supabaseId");

-- CreateIndex
CREATE INDEX "users_supabaseId_idx" ON "users"("supabaseId");
