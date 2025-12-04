// app/api/admin/galleries/pending/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    // Check if user is admin
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all pending galleries with photographer info
    const galleries = await prisma.gallery.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        photographer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        photos: {
          select: {
            id: true,
            photoUrl: true,
          },
        },
        pricingTiers: true,
      },
      orderBy: {
        createdAt: "desc", // Newest first
      },
    });

    return NextResponse.json({ galleries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}
