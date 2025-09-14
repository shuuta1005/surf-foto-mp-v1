// /app/api/auth/verify-email/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token)
    return NextResponse.json({ error: "No token provided" }, { status: 400 });

  try {
    const pending = await prisma.pendingUser.findUnique({ where: { token } });
    if (!pending)
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );

    if (pending.expires < new Date()) {
      return NextResponse.json(
        { error: "Token expired. Please request a new verification email." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: pending.email },
      });

      const user = existingUser
        ? await tx.user.update({
            where: { email: pending.email },
            data: {
              name: pending.name,
              password: pending.hashedPassword,
              emailVerified: new Date(),
            },
          })
        : await tx.user.create({
            data: {
              email: pending.email,
              name: pending.name,
              password: pending.hashedPassword,
              emailVerified: new Date(),
            },
          });

      await tx.pendingUser.delete({ where: { email: pending.email } });
      return user;
    });

    return NextResponse.json({ success: true, email: result.email });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
