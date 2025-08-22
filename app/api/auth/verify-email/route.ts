// /app/api/auth/verify-email/route.ts

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("🔍 API Route called:", req.url);

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  console.log("🎫 Token received:", token);

  if (!token) {
    console.log("❌ No token provided");
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  try {
    console.log("🔍 Looking for token in database...");
    const storedToken = await prisma.verificationToken.findFirst({
      where: { token },
    });

    console.log("🎫 Stored token found:", storedToken ? "Yes" : "No");
    console.log("🎫 Stored token details:", storedToken);

    if (!storedToken) {
      console.log("❌ Token not found in database");
      return NextResponse.json({ error: "Token not found" }, { status: 400 });
    }

    if (storedToken.expires < new Date()) {
      console.log(
        "❌ Token expired. Expires:",
        storedToken.expires,
        "Current:",
        new Date()
      );
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    console.log("✅ Token is valid, updating user...");

    const updatedUser = await prisma.user.update({
      where: { email: storedToken.identifier },
      data: { emailVerified: new Date() },
    });

    console.log("✅ User updated:", updatedUser.email);

    console.log("🗑️ Deleting verification token...");
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: storedToken.identifier,
          token: storedToken.token,
        },
      },
    });

    console.log("✅ Verification complete!");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("💥 Email verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
