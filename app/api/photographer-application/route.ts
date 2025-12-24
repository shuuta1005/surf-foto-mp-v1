// app/api/photographer-application/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { sendApplicationSubmittedEmail } from "@/lib/email/photographer-emails";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, portfolioLink, bio } = await req.json();

    // Verify user matches session
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate bio
    if (!bio || bio.trim().length < 50) {
      return NextResponse.json(
        { error: "Bio must be at least 50 characters" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        photographerStatus: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Already a photographer
    if (user.role === "PHOTOGRAPHER") {
      return NextResponse.json(
        { error: "You are already a photographer" },
        { status: 400 }
      );
    }

    // Already applied and pending
    if (user.photographerStatus === "PENDING") {
      return NextResponse.json(
        { error: "You already have a pending application" },
        { status: 400 }
      );
    }

    // Update user with application
    await prisma.user.update({
      where: { id: userId },
      data: {
        photographerStatus: "PENDING",
        applicationSubmittedAt: new Date(),
        portfolioLink: portfolioLink || null,
        bio: bio.trim(),
      },
    });

    // Send confirmation email
    if (user.email) {
      try {
        await sendApplicationSubmittedEmail(user.email, user.name || "there");
      } catch (emailError) {
        console.error("Failed to send application email:", emailError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error submitting photographer application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
