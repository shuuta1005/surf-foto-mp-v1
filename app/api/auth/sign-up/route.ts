// /app/api/auth/sign-up/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addMinutes } from "date-fns";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { signUpSchema } from "@/lib/validations/validation";
import { validatePassword } from "@/lib/validations/auth/sign-up";
import { BASE_URL } from "@/lib/constants";

const TOKEN_TTL_MIN = 15;
const RESEND_COOLDOWN_SEC = 60;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = signUpSchema.parse(body);

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length) {
      return NextResponse.json(
        { error: "Weak password", details: passwordErrors },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser?.emailVerified) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = randomBytes(32).toString("hex");
    const expires = addMinutes(new Date(), TOKEN_TTL_MIN);

    const pending = await prisma.pendingUser.findUnique({ where: { email } });

    if (pending) {
      const now = new Date();
      if (
        pending.lastSentAt &&
        now.getTime() - pending.lastSentAt.getTime() <
          RESEND_COOLDOWN_SEC * 1000
      ) {
        return NextResponse.json(
          {
            message:
              "Verification email recently sent. Please check your inbox or try again shortly.",
          },
          { status: 202 }
        );
      }

      await prisma.pendingUser.update({
        where: { email },
        data: {
          name,
          hashedPassword,
          token,
          expires,
          lastSentAt: now,
        },
      });
    } else {
      await prisma.pendingUser.create({
        data: {
          email,
          name,
          hashedPassword,
          token,
          expires,
          lastSentAt: new Date(),
        },
      });
    }

    //const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
    const verifyUrl = `${BASE_URL}/verify-email?token=${token}`;

    try {
      await resend.emails.send({
        from: "verify@surfphotosjapan.com",
        to: email,
        subject: "Verify your email",
        html: `<p>Click to verify your account: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Check your email to verify your account." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
  }
}

// TODO: Track email usage to monitor Resend quota
// Consider logging each email send event to a database or in-memory store
// Example: increment dailyEmailCount and check against threshold (e.g., 80% of free limit)

// TODO: Add fallback logic if Resend quota is exceeded
// If Resend fails due to quota, retry later or switch to backup provider (e.g., SendGrid, Postmark)
// Use try/catch around resend.emails.send and handle gracefully

// TODO: Optional — notify admin when usage is high
// Send alert (email, Slack, dashboard widget) when nearing daily/monthly limit
