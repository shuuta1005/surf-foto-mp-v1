import { NextResponse } from "next/server";
import prisma from "@/db/db";
import { hashSync } from "bcrypt-ts-edge";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the password before storing it
    const hashedPassword = hashSync(password, 10);

    // Create user in database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
