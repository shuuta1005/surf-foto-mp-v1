// app/api/purchase/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { photoIds } = await req.json();

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json({ error: "No photo IDs provided" }, { status: 400 });
    }

    // Prevent duplicate purchases
    const existingPurchases = await prisma.purchase.findMany({
      where: {
        userId,
        photoId: { in: photoIds },
      },
      select: { photoId: true },
    });

    const alreadyPurchasedIds = new Set(existingPurchases.map((p) => p.photoId));
    const newPhotoIds = photoIds.filter((id) => !alreadyPurchasedIds.has(id));

    if (newPhotoIds.length === 0) {
      return NextResponse.json({ error: "Photos already purchased" }, { status: 400 });
    }

    // Create purchase records
    await prisma.purchase.createMany({
      data: newPhotoIds.map((photoId) => ({
        userId,
        photoId,
      })),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Purchase failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
