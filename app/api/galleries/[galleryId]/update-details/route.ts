// app/api/galleries/[galleryId]/update-details/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { galleryId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gallery = await prisma.gallery.findUnique({
      where: { id: params.galleryId },
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
    const { prefecture, area, surfSpot, date, sessionTime, coverPhoto } = body;

    // Validate required fields
    if (!prefecture || !area || !surfSpot || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update gallery
    await prisma.gallery.update({
      where: { id: params.galleryId },
      data: {
        prefecture,
        area,
        surfSpot,
        date: new Date(date),
        sessionTime: sessionTime || null,
        coverPhoto: coverPhoto || null,
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
