-- CreateEnum
CREATE TYPE "GadgetStatus" AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decommissioned');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'agent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gadgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "codename" TEXT NOT NULL,
    "status" "GadgetStatus" NOT NULL DEFAULT 'Available',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "decommissionedAt" TIMESTAMP(3),
    "selfDestructAt" TIMESTAMP(3),
    "selfDestructCode" TEXT,
    "missionSuccessProbability" INTEGER,

    CONSTRAINT "gadgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "gadgets_codename_key" ON "gadgets"("codename");
