// app/api/galleries/[galleryId]/update-details/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ galleryId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { galleryId } = await params;

    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      select: { photographerId: true },
    });

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // Check permissions
    if (
      session.user.role !== "ADMIN" &&
      gallery.photographerId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { prefecture, area, surfSpot, date, sessionTime } = body;

    // Validate required fields
    if (!prefecture || !area || !surfSpot || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Update gallery (no coverPhoto field)
    await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        prefecture,
        area,
        surfSpot,
        date: new Date(date),
        sessionTime: sessionTime || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    );
  }
}
