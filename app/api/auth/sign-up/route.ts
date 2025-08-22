// /app/api/auth/sign-up/route.ts

import { NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validations/validation";
import { validatePassword } from "@/lib/validations/auth/sign-up";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = signUpSchema.parse(body);

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return NextResponse.json(
        {
          message: "Password does not meet the required criteria.",
          errors: { password: passwordErrors },
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
      },
    });

    const token = randomBytes(32).toString("hex");
    const expires = addMinutes(new Date(), 15);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const verifyUrl = `https://surfphotosjapan.com/verify-email?token=${token}`;

    await resend.emails.send({
      from: "verify@surfphotosjapan.com",
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click to verify your account: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    return NextResponse.json(
      { message: "User created successfully. Verification email sent." },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("SIGN-UP ERROR:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          message: "Something went wrong during sign-up",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unexpected error during sign-up" },
      { status: 500 }
    );
  }
}
