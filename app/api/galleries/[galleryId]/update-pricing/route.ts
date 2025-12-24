// app/api/galleries/[galleryId]/update-pricing/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { validateBasePrice } from "@/lib/pricing-rules";

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

    const { basePrice } = await req.json();

    // Validate base price using shared validation logic
    const validationError = validateBasePrice(basePrice);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await prisma.gallery.update({
      where: { id: galleryId },
      data: { price: basePrice },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating base price:", error);
    return NextResponse.json(
      { error: "Failed to update base price" },
      { status: 500 }
    );
  }
}
