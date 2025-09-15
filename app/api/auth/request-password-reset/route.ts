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
      from: "reset@surfphotosjapan.com",
      to: email,
      subject: "Reset your password",
      html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
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
