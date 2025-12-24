// app/api/photographer-application/[userId]/reject/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { sendApplicationRejectedEmail } from "@/lib/email/photographer-emails";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();

    // Only admins can reject
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        photographerStatus: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if pending
    if (user.photographerStatus !== "PENDING") {
      return NextResponse.json(
        { error: "No pending application" },
        { status: 400 }
      );
    }

    // Update status to REJECTED
    await prisma.user.update({
      where: { id: userId },
      data: {
        photographerStatus: "REJECTED",
      },
    });

    // Send rejection email
    if (user.email) {
      try {
        await sendApplicationRejectedEmail(user.email, user.name || "there");
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error rejecting photographer application:", error);
    return NextResponse.json(
      { error: "Failed to reject application" },
      { status: 500 }
    );
  }
}
