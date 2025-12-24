// app/api/galleries/[galleryId]/pricing-tiers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { validatePricingTier, isAllowedBundleSize } from "@/lib/pricing-rules";

/**
 * POST - Create a new pricing tier for a gallery
 */
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

    // Get gallery with existing tiers
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: {
        pricingTiers: true,
      },
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

    const { quantity, price } = await req.json();

    // Validate bundle size is allowed
    if (!isAllowedBundleSize(quantity)) {
      return NextResponse.json(
        { error: "Invalid bundle size. Must be 2, 3, 4, or 5 photos" },
        { status: 400 }
      );
    }

    // Check for duplicate quantity
    if (gallery.pricingTiers.some((t) => t.quantity === quantity)) {
      return NextResponse.json(
        { error: `A bundle for ${quantity} photos already exists` },
        { status: 400 }
      );
    }

    // Validate pricing tier
    const validationError = validatePricingTier({
      quantity,
      price,
      basePrice: gallery.price,
      existingTiers: gallery.pricingTiers.map((t) => ({
        quantity: t.quantity,
        price: t.price,
      })),
    });

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Create the tier
    const tier = await prisma.pricingTier.create({
      data: {
        quantity,
        price,
        galleryId,
      },
    });

    return NextResponse.json(tier, { status: 201 });
  } catch (error) {
    console.error("Error creating pricing tier:", error);
    return NextResponse.json(
      { error: "Failed to create pricing tier" },
      { status: 500 }
    );
  }
}
