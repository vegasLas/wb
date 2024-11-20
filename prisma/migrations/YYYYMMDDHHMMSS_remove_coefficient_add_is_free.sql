-- AlterTable
ALTER TABLE "SupplyTrigger" DROP COLUMN "coefficientThreshold",
ADD COLUMN "isFree" BOOLEAN NOT NULL DEFAULT true; 