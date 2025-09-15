//app/api/auth/request-password-reset/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import { Resend } from "resend";
import { BASE_URL } from "@/lib/constants";

const TOKEN_TTL_MIN = 15;
const resend = new Resend(process.env.RESEND_API_KEY);

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

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { email },
  });

  if (existingToken && existingToken.expires > new Date()) {
    return NextResponse.json(
      {
        error:
          "A reset link was already sent recently. Please wait before requesting another.",
      },
      { status: 429 }
    );
  }

  const token = randomBytes(32).toString("hex");
  const expires = addMinutes(new Date(), TOKEN_TTL_MIN);

  await prisma.passwordResetToken.upsert({
    where: { email },
    update: { token, expires },
    create: { email, token, expires },
  });

  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "BrahFotos Support <reset@surfphotosjapan.com>",
      to: email,
      subject: "Reset your BrahFotos account password",
      text: `G'day ${user.name || "there"},

You requested a password reset for your BrahFotos account. Click the link below to set a new password:

${resetUrl}

This link will expire in 15 minutes.

If you didn’t request this, you can safely ignore this email.

Cheers,
The BrahFotos Team`,
      html: `
        <div style="max-width:600px; margin:0 auto; padding:20px; font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://surfphotosjapan.com/brafotos-logo-1.png" alt="BrahFotos Logo" style="width: 240px; height: auto;" />
          </div>
          <h2>G'day ${user.name || "there"},</h2>
          <p>You recently requested to reset your password for your BrahFotos account.</p>
          <p>Click the button below to set a new password. This link will expire in 15 minutes.</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #007BFF; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; display: inline-block; font-weight: bold;">
              Reset My Password
            </a>
          </p>
          <p>If you didn’t request this, you can safely ignore this email.</p>
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
      { message: "Password reset link sent. Please check your inbox." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to send reset email. Please try again later." },
      { status: 500 }
    );
  }
}
