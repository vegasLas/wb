-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegramId" BIGINT NOT NULL,
    "chatId" TEXT,
    "username" TEXT,
    "languageCode" TEXT,
    "name" TEXT NOT NULL,
    "wbApiKey" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyTrigger" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "warehouseIds" INTEGER[],
    "boxTypes" TEXT[],
    "coefficientThreshold" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "checkPeriodStart" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplyTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "User_chatId_key" ON "User"("chatId");

-- CreateIndex
CREATE INDEX "SupplyTrigger_userId_idx" ON "SupplyTrigger"("userId");

-- AddForeignKey
ALTER TABLE "SupplyTrigger" ADD CONSTRAINT "SupplyTrigger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
