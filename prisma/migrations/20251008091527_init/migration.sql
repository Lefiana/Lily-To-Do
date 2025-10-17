-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'dailyquest',
ADD COLUMN     "repeatDaily" BOOLEAN NOT NULL DEFAULT false;
