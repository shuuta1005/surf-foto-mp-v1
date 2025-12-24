// app/api/galleries/[galleryId]/set-cover/route.ts

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

    if (
      session.user.role !== "ADMIN" &&
      gallery.photographerId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { coverPhoto } = await req.json();

    if (!coverPhoto) {
      return NextResponse.json(
        { error: "Cover photo URL required" },
        { status: 400 }
      );
    }

    // ✅ Only update coverPhoto field
    await prisma.gallery.update({
      where: { id: galleryId },
      data: { coverPhoto },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting cover photo:", error);
    return NextResponse.json(
      { error: "Failed to set cover photo" },
      { status: 500 }
    );
  }
}
