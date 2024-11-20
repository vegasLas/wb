/*
  Warnings:

  - You are about to drop the column `coefficientThreshold` on the `SupplyTrigger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SupplyTrigger" DROP COLUMN "coefficientThreshold",
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "TriggerNotification" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TriggerNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TriggerNotification_triggerId_idx" ON "TriggerNotification"("triggerId");

-- CreateIndex
CREATE INDEX "TriggerNotification_sentAt_idx" ON "TriggerNotification"("sentAt");

-- AddForeignKey
ALTER TABLE "TriggerNotification" ADD CONSTRAINT "TriggerNotification_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "SupplyTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
