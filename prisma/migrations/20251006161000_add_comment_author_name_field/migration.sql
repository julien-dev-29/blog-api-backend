/*
  Warnings:

  - Added the required column `authorName` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "authorName" TEXT NOT NULL;
