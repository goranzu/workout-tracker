/*
  Warnings:

  - Added the required column `userInputDate` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "userInputDate" TIMESTAMP(3) NOT NULL;
