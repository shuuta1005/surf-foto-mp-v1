// app/api/pricing-tiers/[tierId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ tierId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tierId } = await params;

    const tier = await prisma.pricingTier.findUnique({
      where: { id: tierId },
      include: {
        gallery: {
          select: { photographerId: true },
        },
      },
    });

    if (!tier) {
      return NextResponse.json({ error: "Tier not found" }, { status: 404 });
    }

    if (
      session.user.role !== "ADMIN" &&
      tier.gallery.photographerId !== session.user.id
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

    await prisma.pricingTier.update({
      where: { id: tierId },
      data: { quantity, price },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating pricing tier:", error);
    return NextResponse.json(
      { error: "Failed to update pricing tier" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ tierId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tierId } = await params;

    const tier = await prisma.pricingTier.findUnique({
      where: { id: tierId },
      include: {
        gallery: {
          select: { photographerId: true },
        },
      },
    });

    if (!tier) {
      return NextResponse.json({ error: "Tier not found" }, { status: 404 });
    }

    if (
      session.user.role !== "ADMIN" &&
      tier.gallery.photographerId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.pricingTier.delete({
      where: { id: tierId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pricing tier:", error);
    return NextResponse.json(
      { error: "Failed to delete pricing tier" },
      { status: 500 }
    );
  }
}
