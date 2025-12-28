// app/api/admin/upload-gallery/route.ts
// ═══════════════════════════════════════════════════════════════
// GALLERY CREATION ENDPOINT (NEW BLOB-BASED SYSTEM)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { config as authOptions } from "@/auth";
import { prisma } from "@/lib/db";

type UploadedFile = {
  url: string;
  mediaType: "image" | "video";
};

type CreateGalleryRequest = {
  prefecture: string;
  area: string;
  surfSpot: string;
  date: string;
  sessionTime: string;
  uploadedFiles: UploadedFile[];
  coverPhotoUrl?: string;
  basePrice?: number;
  pricingTiers?: Array<{ quantity: number; price: number }>;
  isEpic?: boolean;
};

export async function POST(request: Request) {
  try {
    // ─────────────────────────────────────────────────────────
    // SECURITY CHECK
    // ─────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ─────────────────────────────────────────────────────────
    // PARSE REQUEST
    // ─────────────────────────────────────────────────────────
    const body = (await request.json()) as CreateGalleryRequest;

    const {
      prefecture,
      area,
      surfSpot,
      date,
      sessionTime,
      uploadedFiles,
      coverPhotoUrl,
      basePrice = 1000,
      pricingTiers = [],
      isEpic = false,
    } = body;

    // ─────────────────────────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────────────────────────
    if (!prefecture || !area || !surfSpot || !date || !sessionTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // ─────────────────────────────────────────────────────────
    // DETERMINE COVER PHOTO
    // ─────────────────────────────────────────────────────────
    const firstImage = uploadedFiles.find((f) => f.mediaType === "image");
    const finalCoverPhoto =
      coverPhotoUrl || firstImage?.url || uploadedFiles[0].url;

    // ─────────────────────────────────────────────────────────
    // CHECK IF HAS VIDEO
    // ─────────────────────────────────────────────────────────
    const hasVideo = uploadedFiles.some((f) => f.mediaType === "video");

    // ─────────────────────────────────────────────────────────
    // CREATE GALLERY IN DATABASE
    // ─────────────────────────────────────────────────────────
    const gallery = await prisma.gallery.create({
      data: {
        prefecture,
        area,
        surfSpot,
        date: new Date(date),
        sessionTime,
        coverPhoto: finalCoverPhoto,
        hasVideo,
        price: basePrice,
        isEpic,
        photographerId: session.user.id,

        // Create photos
        photos: {
          create: uploadedFiles.map((file) => ({
            photoUrl: file.url, // For now, same as original (no watermark yet)
            originalUrl: file.url,
            mediaType: file.mediaType,
          })),
        },

        // Create pricing tiers
        ...(pricingTiers.length > 0
          ? {
              pricingTiers: {
                create: pricingTiers.map((tier) => ({
                  quantity: tier.quantity,
                  price: tier.price,
                })),
              },
            }
          : {}),
      },
      include: {
        photos: true,
        pricingTiers: true,
      },
    });

    console.log(`✅ Gallery created: ${gallery.id}`);
    console.log(`📸 Photos: ${gallery.photos.length}`);
    console.log(`🎥 Has video: ${hasVideo}`);

    return NextResponse.json(
      {
        success: true,
        gallery: {
          id: gallery.id,
          surfSpot: gallery.surfSpot,
          photoCount: gallery.photos.length,
          hasVideo: gallery.hasVideo,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Gallery creation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create gallery",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
