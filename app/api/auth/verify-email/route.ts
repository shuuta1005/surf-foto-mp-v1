// // /app/api/auth/verify-email/route.ts
// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const token = searchParams.get("token");
//   if (!token)
//     return NextResponse.json({ error: "No token provided" }, { status: 400 });

//   try {
//     const pending = await prisma.pendingUser.findUnique({ where: { token } });
//     if (!pending)
//       return NextResponse.json(
//         { error: "Invalid or expired token" },
//         { status: 400 }
//       );

//     if (pending.expires < new Date()) {
//       return NextResponse.json(
//         { error: "Token expired. Please request a new verification email." },
//         { status: 400 }
//       );
//     }

//     const result = await prisma.$transaction(async (tx) => {
//       const existingUser = await tx.user.findUnique({
//         where: { email: pending.email },
//       });

//       const user = existingUser
//         ? await tx.user.update({
//             where: { email: pending.email },
//             data: {
//               name: pending.name,
//               password: pending.hashedPassword,
//               emailVerified: new Date(),
//             },
//           })
//         : await tx.user.create({
//             data: {
//               email: pending.email,
//               name: pending.name,
//               password: pending.hashedPassword,
//               emailVerified: new Date(),
//             },
//           });

//       await tx.pendingUser.delete({ where: { email: pending.email } });
//       return user;
//     });

//     return NextResponse.json({ success: true, email: result.email });
//   } catch {
//     return NextResponse.json({ error: "Verification failed" }, { status: 500 });
//   }
// }

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required." },
      { status: 400 }
    );
  }

  try {
    const pendingUser = await prisma.pendingUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!pendingUser) {
      return NextResponse.json(
        { error: "Invalid verification code or registration not found." },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (pendingUser.expires < new Date()) {
      await prisma.pendingUser.delete({
        where: { email: email.toLowerCase() },
      });
      return NextResponse.json(
        { error: "Verification code has expired. Please sign up again." },
        { status: 400 }
      );
    }

    // Check if code is correct
    if (pendingUser.token !== code) {
      return NextResponse.json(
        {
          error: "Invalid verification code. Please check and try again.",
        },
        { status: 400 }
      );
    }

    // Code is valid - create the user account
    const result = await prisma.$transaction(async (tx) => {
      // Check if user already exists (edge case)
      const existingUser = await tx.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      const user = existingUser
        ? await tx.user.update({
            where: { email: email.toLowerCase() },
            data: {
              name: pendingUser.name,
              password: pendingUser.hashedPassword,
              emailVerified: new Date(),
            },
          })
        : await tx.user.create({
            data: {
              email: email.toLowerCase(),
              name: pendingUser.name,
              password: pendingUser.hashedPassword,
              emailVerified: new Date(),
            },
          });

      // Clean up pending user record
      await tx.pendingUser.delete({
        where: { email: email.toLowerCase() },
      });

      return user;
    });

    return NextResponse.json({
      message: "Email verified successfully. Your account has been created.",
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
      },
    });
  } catch (error) {
    console.error("Email verification failed:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
