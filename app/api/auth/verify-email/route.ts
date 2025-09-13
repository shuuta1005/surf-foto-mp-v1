// /app/api/auth/verify-email/route.ts

// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   console.log("🔍 API Route called:", req.url);

//   const { searchParams } = new URL(req.url);
//   const token = searchParams.get("token");

//   console.log("🎫 Token received:", token);

//   if (!token) {
//     console.log("❌ No token provided");
//     return NextResponse.json({ error: "No token provided" }, { status: 400 });
//   }

//   try {
//     console.log("🔍 Looking for token in database...");
//     const storedToken = await prisma.verificationToken.findFirst({
//       where: { token },
//     });

//     console.log("🎫 Stored token found:", storedToken ? "Yes" : "No");
//     console.log("🎫 Stored token details:", storedToken);

//     if (!storedToken) {
//       console.log("❌ Token not found in database");
//       return NextResponse.json({ error: "Token not found" }, { status: 400 });
//     }

//     if (storedToken.expires < new Date()) {
//       console.log(
//         "❌ Token expired. Expires:",
//         storedToken.expires,
//         "Current:",
//         new Date()
//       );
//       return NextResponse.json({ error: "Token expired" }, { status: 400 });
//     }

//     console.log("✅ Token is valid, updating user...");

//     const updatedUser = await prisma.user.update({
//       where: { email: storedToken.identifier },
//       data: { emailVerified: new Date() },
//     });

//     console.log("✅ User updated:", updatedUser.email);

//     console.log("🗑️ Deleting verification token...");
//     await prisma.verificationToken.delete({
//       where: {
//         identifier_token: {
//           identifier: storedToken.identifier,
//           token: storedToken.token,
//         },
//       },
//     });

//     console.log("✅ Verification complete!");
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("💥 Email verification error:", error);
//     return NextResponse.json({ error: "Verification failed" }, { status: 500 });
//   }
// }

// /app/api/auth/verify-email/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token)
    return NextResponse.json({ error: "No token provided" }, { status: 400 });

  try {
    const pending = await prisma.pendingUser.findUnique({ where: { token } });
    if (!pending)
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );

    if (pending.expires < new Date()) {
      return NextResponse.json(
        { error: "Token expired. Please request a new verification email." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: pending.email },
      });

      const user = existingUser
        ? await tx.user.update({
            where: { email: pending.email },
            data: {
              name: pending.name,
              password: pending.hashedPassword,
              emailVerified: new Date(),
            },
          })
        : await tx.user.create({
            data: {
              email: pending.email,
              name: pending.name,
              password: pending.hashedPassword,
              emailVerified: new Date(),
            },
          });

      await tx.pendingUser.delete({ where: { email: pending.email } });
      return user;
    });

    return NextResponse.json({ success: true, email: result.email });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
