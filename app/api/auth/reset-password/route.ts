import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json(
      { error: "Missing token or password." },
      { status: 400 }
    );
  }

  const resetRecord = await prisma.passwordResetToken.findFirst({
    where: { token },
  });

  if (!resetRecord) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 400 }
    );
  }

  if (resetRecord.expires < new Date()) {
    return NextResponse.json(
      { error: "Token has expired. Please request a new reset link." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: resetRecord.email },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { email: resetRecord.email },
  });

  return NextResponse.json({ message: "Password has been reset." });
}
