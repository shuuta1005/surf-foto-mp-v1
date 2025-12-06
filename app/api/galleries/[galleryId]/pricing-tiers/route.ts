// app/api/galleries/[galleryId]/pricing-tiers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(
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

    const { quantity, price } = await req.json();

    if (!quantity || !price || quantity < 1 || price < 1) {
      return NextResponse.json(
        { error: "Invalid quantity or price" },
        { status: 400 }
      );
    }

    const tier = await prisma.pricingTier.create({
      data: {
        galleryId,
        quantity,
        price,
      },
    });

    return NextResponse.json({ success: true, tier });
  } catch (error) {
    console.error("Error creating pricing tier:", error);
    return NextResponse.json(
      { error: "Failed to create pricing tier" },
      { status: 500 }
    );
  }
}
