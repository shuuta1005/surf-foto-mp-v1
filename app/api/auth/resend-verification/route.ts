// /app/api/auth/resend-verification/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addMinutes } from "date-fns";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { BASE_URL } from "@/lib/constants";

const TOKEN_TTL_MIN = 15;
const RESEND_COOLDOWN_SEC = 60;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user?.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified. Please sign in." },
        { status: 200 }
      );
    }

    const pending = await prisma.pendingUser.findUnique({ where: { email } });
    if (!pending) {
      return NextResponse.json(
        {
          message:
            "A verification email was just sent. Please check your inbox.",
        },
        { status: 202 }
      );
    }

    const now = new Date();
    if (
      pending.lastSentAt &&
      now.getTime() - pending.lastSentAt.getTime() < RESEND_COOLDOWN_SEC * 1000
    ) {
      return NextResponse.json(
        {
          message:
            "A verification email was just sent. Please check your inbox.",
        },
        { status: 202 }
      );
    }

    const token = randomBytes(32).toString("hex");
    const expires = addMinutes(now, TOKEN_TTL_MIN);

    await prisma.pendingUser.update({
      where: { email },
      data: { token, expires, lastSentAt: now },
    });

    // const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
    const verifyUrl = `${BASE_URL}/verify-email?token=${token}`;

    await resend.emails.send({
      from: "verify@surfphotosjapan.com",
      to: email,
      subject: "Verify your email",
      html: `<p>Click to verify your account: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    return NextResponse.json(
      { message: "Verification email sent." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Could not resend verification email" },
      { status: 500 }
    );
  }
}
