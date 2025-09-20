// /app/api/auth/resend-verification/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addMinutes } from "date-fns";
import { Resend } from "resend";

const CODE_TTL_MIN = 15;
const RATE_LIMIT_SECONDS = 60;
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

  try {
    // Check if there's a pending user for this email
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!pendingUser) {
      return NextResponse.json(
        { error: "No pending registration found for this email." },
        { status: 404 }
      );
    }

    // Check rate limiting
    if (pendingUser.lastSentAt) {
      const timeSinceLastSent = Date.now() - pendingUser.lastSentAt.getTime();
      const rateLimitMs = RATE_LIMIT_SECONDS * 1000;

      if (timeSinceLastSent < rateLimitMs) {
        const secondsLeft = Math.ceil((rateLimitMs - timeSinceLastSent) / 1000);
        return NextResponse.json(
          {
            error: `Please wait ${secondsLeft} seconds before requesting another code.`,
            timeLeft: secondsLeft,
            canResendAt: new Date(
              pendingUser.lastSentAt.getTime() + rateLimitMs
            ).toISOString(),
          },
          { status: 429 }
        );
      }
    }

    // Generate new code and update pending user
    const code = generateVerificationCode();
    const expires = addMinutes(new Date(), CODE_TTL_MIN);
    const now = new Date();

    await prisma.pendingUser.update({
      where: { email: email.toLowerCase() },
      data: {
        token: code,
        expires,
        lastSentAt: now,
      },
    });

    // Send new verification code
    try {
      await resend.emails.send({
        from: "BrahFotos Support <verify@surfphotosjapan.com>",
        to: email,
        subject: "Your new BrahFotos verification code",
        text: `G'day ${pendingUser.name},

Here's your new verification code for BrahFotos:

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
            <h2>G'day ${pendingUser.name},</h2>
            <p>Here's your new verification code for BrahFotos:</p>
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
          message: "New verification code sent. Please check your inbox.",
          email: email.toLowerCase(),
          canResendAt: new Date(
            now.getTime() + RATE_LIMIT_SECONDS * 1000
          ).toISOString(),
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Failed to send verification code:", error);
      return NextResponse.json(
        { error: "Failed to send verification code. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Resend verification code failed:", error);
    return NextResponse.json(
      { error: "Failed to resend code. Please try again." },
      { status: 500 }
    );
  }
}
