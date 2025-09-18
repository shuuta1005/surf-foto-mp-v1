//app/api/auth/verify-reset-code/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const MAX_ATTEMPTS = 3;

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required." },
      { status: 400 }
    );
  }

  const resetRecord = await prisma.passwordResetCode.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!resetRecord) {
    return NextResponse.json(
      { error: "Invalid verification code." },
      { status: 400 }
    );
  }

  if (resetRecord.expires < new Date()) {
    await prisma.passwordResetCode.delete({
      where: { email: email.toLowerCase() },
    });
    return NextResponse.json(
      { error: "Verification code has expired. Please request a new one." },
      { status: 400 }
    );
  }

  if (resetRecord.attempts >= MAX_ATTEMPTS) {
    await prisma.passwordResetCode.delete({
      where: { email: email.toLowerCase() },
    });
    return NextResponse.json(
      {
        error:
          "Too many failed attempts. Please request a new verification code.",
      },
      { status: 429 }
    );
  }

  if (resetRecord.code !== code) {
    await prisma.passwordResetCode.update({
      where: { email: email.toLowerCase() },
      data: { attempts: resetRecord.attempts + 1 },
    });

    const remainingAttempts = MAX_ATTEMPTS - (resetRecord.attempts + 1);
    return NextResponse.json(
      {
        error: `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`,
        remainingAttempts,
      },
      { status: 400 }
    );
  }

  // Code is valid - generate a temporary reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.passwordResetCode.update({
    where: { email: email.toLowerCase() },
    data: {
      resetToken,
      tokenExpires,
      verified: true,
    },
  });

  return NextResponse.json({
    message: "Code verified successfully.",
    resetToken,
    email: email.toLowerCase(),
  });
}
