// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const { name, email, password } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { message: "All fields are required." },
//         { status: 400 }
//       );
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "Email is already registered." },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//     });

//     return NextResponse.json(
//       { message: "User created successfully." },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Sign-up error:", error);
//     return NextResponse.json(
//       { message: "Server error. Please try again later." },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validation";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = signUpSchema.parse(body);

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
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
