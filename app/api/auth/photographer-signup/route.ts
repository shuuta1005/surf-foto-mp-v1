// app/api/auth/photographer-signup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addMinutes } from "date-fns";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { z } from "zod";
import { validatePassword } from "@/lib/validations/auth/sign-up";

const CODE_TTL_MIN = 15;
const RATE_LIMIT_SECONDS = 60;
const resend = new Resend(process.env.RESEND_API_KEY);

// Bio is now optional
const photographerSignUpSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    bio: z.string().optional(), // ✨ Optional
    portfolioLink: z.string().url().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, bio, portfolioLink } =
      photographerSignUpSchema.parse(body);

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length) {
      return NextResponse.json(
        { error: "Weak password", details: passwordErrors },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser?.emailVerified) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

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

    await prisma.pendingUser.upsert({
      where: { email: email.toLowerCase() },
      update: {
        name,
        hashedPassword,
        token: code,
        expires,
        lastSentAt: now,
        bio: bio || null, // ✨ Handle empty string
        portfolioLink: portfolioLink || null,
      },
      create: {
        email: email.toLowerCase(),
        name,
        hashedPassword,
        token: code,
        expires,
        lastSentAt: now,
        bio: bio || null, // ✨ Handle empty string
        portfolioLink: portfolioLink || null,
      },
    });

    try {
      await resend.emails.send({
        from: "BrahFotos Support <verify@surfphotosjapan.com>",
        to: email,
        subject: "Verify your BrahFotos Photographer Account",
        html: `
          <div style="max-width:600px; margin:0 auto; padding:20px; font-family: Arial, sans-serif; color: #333;">
            <h2>G'day ${name},</h2>
            <p>Welcome to BrahFotos! We're excited to have you join our community of surf photographers. 📸</p>
            <p>Your verification code is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #007BFF; letter-spacing: 8px; background: #f8f9fa; padding: 20px; border-radius: 8px; display: inline-block;">
                ${code}
              </span>
            </div>
            <p>This code will expire in 15 minutes.</p>
            <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>What happens next:</strong></p>
              <ul style="margin: 10px 0;">
                <li>Verify your email with the code above</li>
                <li>Our team will review your photographer application within 2-3 business days</li>
                <li>Once approved, you can start uploading galleries and earning 90% on every sale!</li>
              </ul>
            </div>
            <p>If you didn't create this account, you can safely ignore this email.</p>
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
    console.error("Photographer sign-up failed:", error);
    return NextResponse.json({ error: "Sign-up failed" }, { status: 500 });
  }
}
