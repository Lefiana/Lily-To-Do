-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeThemeItemId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeThemeItemId_fkey" FOREIGN KEY ("activeThemeItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
