// app/api/auth/send-reset-code/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addMinutes } from "date-fns";
import { Resend } from "resend";

const CODE_TTL_MIN = 15;
const RATE_LIMIT_SECONDS = 60; // 1 minute rate limiting
const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "No account found with that email." },
      { status: 404 }
    );
  }

  // Check for existing code and rate limiting
  const existingCode = await prisma.passwordResetCode.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingCode && existingCode.lastSentAt) {
    const timeSinceLastSent = Date.now() - existingCode.lastSentAt.getTime();
    const rateLimitMs = RATE_LIMIT_SECONDS * 1000;

    if (timeSinceLastSent < rateLimitMs) {
      const secondsLeft = Math.ceil((rateLimitMs - timeSinceLastSent) / 1000);
      return NextResponse.json(
        {
          error: `Please wait ${secondsLeft} seconds before requesting another code.`,
          timeLeft: secondsLeft, // Pass exact seconds to frontend
          canResendAt: new Date(
            existingCode.lastSentAt.getTime() + rateLimitMs
          ).toISOString(),
        },
        { status: 429 }
      );
    }
  }

  const code = generateVerificationCode();
  const expires = addMinutes(new Date(), CODE_TTL_MIN);
  const now = new Date();

  await prisma.passwordResetCode.upsert({
    where: { email: email.toLowerCase() },
    update: { code, expires, attempts: 0, lastSentAt: now },
    create: {
      email: email.toLowerCase(),
      code,
      expires,
      attempts: 0,
      lastSentAt: now,
    },
  });

  try {
    await resend.emails.send({
      from: "BrahFotos Support <reset@surfphotosjapan.com>",
      to: email,
      subject: "Your BrahFotos password reset code",
      text: `G'day ${user.name || "there"},

Your verification code for resetting your BrahFotos password is:

${code}

This code will expire in 15 minutes.

If you didn't request this, you can safely ignore this email.

Cheers,
The BrahFotos Team`,
      html: `
        <div style="max-width:600px; margin:0 auto; padding:20px; font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://surfphotosjapan.com/logo.png" alt="BrahFotos Logo" style="width: 120px; height: auto;" />
          </div>
          <h2>G'day ${user.name || "there"},</h2>
          <p>Your verification code for resetting your BrahFotos password is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #007BFF; letter-spacing: 8px; background: #f8f9fa; padding: 20px; border-radius: 8px; display: inline-block;">
              ${code}
            </span>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send reset code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please try again later." },
      { status: 500 }
    );
  }
}
