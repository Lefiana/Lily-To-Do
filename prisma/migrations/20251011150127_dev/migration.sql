/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Currency` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Currency_userId_key" ON "Currency"("userId");
