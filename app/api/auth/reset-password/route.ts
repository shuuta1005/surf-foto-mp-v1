//app/api/auth/reset-password/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { resetToken, newPassword, email } = await req.json();

  if (!resetToken || !newPassword || !email) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  //TODO We have to apply the zod validations here.
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters long." },
      { status: 400 }
    );
  }

  const resetRecord = await prisma.passwordResetCode.findFirst({
    where: {
      email: email.toLowerCase(),
      resetToken,
      verified: true,
    },
  });

  if (!resetRecord) {
    return NextResponse.json(
      { error: "Invalid or expired reset token." },
      { status: 400 }
    );
  }

  if (!resetRecord.tokenExpires || resetRecord.tokenExpires < new Date()) {
    await prisma.passwordResetCode.delete({
      where: { email: email.toLowerCase() },
    });
    return NextResponse.json(
      { error: "Reset token has expired. Please start the process again." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { password: hashedPassword },
  });

  // Clean up the reset record
  await prisma.passwordResetCode.delete({
    where: { email: email.toLowerCase() },
  });

  return NextResponse.json({
    message: "Password has been reset successfully.",
  });
}
