// /app/api/auth/sign-up/route.ts

// TODO: Track email usage to monitor Resend quota
// Consider logging each email send event to a database or in-memory store
// Example: increment dailyEmailCount and check against threshold (e.g., 80% of free limit)

// TODO: Add fallback logic if Resend quota is exceeded
// If Resend fails due to quota, retry later or switch to backup provider (e.g., SendGrid, Postmark)
// Use try/catch around resend.emails.send and handle gracefully

// TODO: Optional — notify admin when usage is high
// Send alert (email, Slack, dashboard widget) when nearing daily/monthly limit

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addMinutes } from "date-fns";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { signUpSchema } from "@/lib/validations/validation";
import { validatePassword } from "@/lib/validations/auth/sign-up";

const CODE_TTL_MIN = 15;
const RATE_LIMIT_SECONDS = 60; // 1 minute rate limiting
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = signUpSchema.parse(body);

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length) {
      return NextResponse.json(
        { error: "Weak password", details: passwordErrors },
        { status: 400 }
      );
    }

    // Check if user already exists and is verified
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser?.emailVerified) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Check for existing pending user and rate limiting
    const existingPending = await prisma.pendingUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingPending && existingPending.lastSentAt) {
      const timeSinceLastSent =
        Date.now() - existingPending.lastSentAt.getTime();
      const rateLimitMs = RATE_LIMIT_SECONDS * 1000;

      if (timeSinceLastSent < rateLimitMs) {
        const secondsLeft = Math.ceil((rateLimitMs - timeSinceLastSent) / 1000);
        return NextResponse.json(
          {
            error: `Please wait ${secondsLeft} seconds before requesting another code.`,
            timeLeft: secondsLeft,
            canResendAt: new Date(
              existingPending.lastSentAt.getTime() + rateLimitMs
            ).toISOString(),
          },
          { status: 429 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const code = generateVerificationCode();
    const expires = addMinutes(new Date(), CODE_TTL_MIN);
    const now = new Date();

    // Store pending user with verification code
    await prisma.pendingUser.upsert({
      where: { email: email.toLowerCase() },
      update: {
        name,
        hashedPassword,
        token: code, // Reusing token field for verification code
        expires,
        lastSentAt: now,
      },
      create: {
        email: email.toLowerCase(),
        name,
        hashedPassword,
        token: code,
        expires,
        lastSentAt: now,
      },
    });

    // Send verification code via email
    try {
      await resend.emails.send({
        from: "BrahFotos Support <verify@surfphotosjapan.com>",
        to: email,
        subject: "Verify your BrahFotos account",
        text: `G'day ${name},

Welcome to BrahFotos! Your verification code is:

${code}

This code will expire in 15 minutes.

If you didn't create this account, you can safely ignore this email.

Cheers,
The BrahFotos Team`,
        html: `
          <div style="max-width:600px; margin:0 auto; padding:20px; font-family: Arial, sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://surfphotosjapan.com/logo.png" alt="BrahFotos Logo" style="width: 120px; height: auto;" />
            </div>
            <h2>G'day ${name},</h2>
            <p>Welcome to BrahFotos! Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007BFF; letter-spacing: 8px; background: #f8f9fa; padding: 20px; border-radius: 8px; display: inline-block;">
                ${code}
              </span>
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't create this account, you can safely ignore this email.</p>
            <hr style="margin: 30px 0;" />
            <p style="font-size: 12px; color: #888; text-align: center;">
              Sent by BrahFotos • Chiba, Japan<br/>
              <a href="mailto:support@surfphotosjapan.com" style="color: #007BFF;">Contact Support</a> |
              <a href="https://surfphotosjapan.com" style="color: #007BFF;">Visit Website</a>
            </p>
          </div>
        `,
      });

      return NextResponse.json(
        {
          message: "Verification code sent. Please check your inbox.",
          email: email.toLowerCase(),
          canResendAt: new Date(
            now.getTime() + RATE_LIMIT_SECONDS * 1000
          ).toISOString(),
        },
        { status: 202 }
      );
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return NextResponse.json(
        { error: "Failed to send verification code. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Sign-up failed:", error);
    return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
  }
}
