-- CreateTable
CREATE TABLE "public"."PendingUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "lastSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_email_key" ON "public"."PendingUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_token_key" ON "public"."PendingUser"("token");

-- CreateIndex
CREATE INDEX "PendingUser_email_idx" ON "public"."PendingUser"("email");

-- CreateIndex
CREATE INDEX "PendingUser_token_idx" ON "public"."PendingUser"("token");

-- CreateIndex
CREATE INDEX "PendingUser_expires_idx" ON "public"."PendingUser"("expires");
