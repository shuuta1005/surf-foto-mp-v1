//api/auth/sign-up/route.ts

import { NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validations/validation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     //body is the data that comes from the client (the form on your sign-up page).
//     const body = await req.json();

//     const { name, email, password } = signUpSchema.parse(body);

//     const existingUser = await prisma.user.findUnique({ where: { email } });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "Email is already in use" },
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
//       { message: "User created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { message: "Validation error", errors: error.flatten().fieldErrors },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

import { isStrongPassword } from "@/lib/validations/auth/sign-up";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = signUpSchema.parse(body);

    // 🔐 Enforce password rules again on the server
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters and include both letters and numbers.",
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
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
