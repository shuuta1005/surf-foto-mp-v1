// app/api/admin/galleries/route.ts
// ═══════════════════════════════════════════════════════════════
// GALLERY CREATION ENDPOINT
// Purpose: Create gallery with pre-uploaded media files
// Security: Admin-only
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { config as authOptions } from "@/auth";
import { prisma } from "@/lib/db";

// ─────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────
type UploadedFile = {
  url: string;
  mediaType: "image" | "video";
};

type CreateGalleryRequest = {
  // Location & Session
  prefecture: string;
  area: string;
  surfSpot: string;
  date: string; // ISO date string
  sessionTime: string; // e.g., "08:00 - 11:00"

  // Media
  uploadedFiles: UploadedFile[];
  coverPhotoUrl?: string; // Optional: user can select cover, or we use first image

  // Pricing (optional, can use defaults)
  basePrice?: number;
  pricingTiers?: Array<{ quantity: number; price: number }>;

  // Epic flag
  isEpic?: boolean;
};

export async function POST(request: Request) {
  try {
    // ─────────────────────────────────────────────────────────
    // SECURITY: Check admin authentication
    // ─────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized: No session found" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // ─────────────────────────────────────────────────────────
    // PARSE REQUEST BODY
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
      pricingTiers,
      isEpic = false,
    } = body;

    // ─────────────────────────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────────────────────────
    if (!prefecture || !area || !surfSpot || !date || !sessionTime) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: prefecture, area, surfSpot, date, sessionTime",
        },
        { status: 400 }
      );
    }

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // ─────────────────────────────────────────────────────────
    // DETERMINE COVER PHOTO
    // ─────────────────────────────────────────────────────────
    // Use provided cover, or fallback to first image (not video)
    const firstImage = uploadedFiles.find((f) => f.mediaType === "image");
    const finalCoverPhoto =
      coverPhotoUrl || firstImage?.url || uploadedFiles[0].url;

    // ─────────────────────────────────────────────────────────
    // CHECK IF GALLERY HAS VIDEO
    // ─────────────────────────────────────────────────────────
    const hasVideo = uploadedFiles.some((f) => f.mediaType === "video");

    // ─────────────────────────────────────────────────────────
    // CREATE GALLERY + PHOTOS IN DATABASE (Transaction)
    // ─────────────────────────────────────────────────────────
    const gallery = await prisma.gallery.create({
      data: {
        // Location & Session
        prefecture,
        area,
        surfSpot,
        date: new Date(date),
        sessionTime,

        // Media
        coverPhoto: finalCoverPhoto,
        hasVideo,

        // Pricing
        price: basePrice,

        // Flags
        isEpic,

        // Ownership
        photographerId: session.user.id,

        // Status (defaults to PENDING in schema)
        // status: 'PENDING', // Already default

        // Create photos
        photos: {
          create: uploadedFiles.map((file) => ({
            photoUrl: file.url, // Watermarked version (for now, same as original)
            originalUrl: file.url, // High-res original
            mediaType: file.mediaType, // NEW: Track if image or video
          })),
        },

        // Optional: Create pricing tiers
        ...(pricingTiers && pricingTiers.length > 0
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
    console.log(`📸 Photos created: ${gallery.photos.length}`);
    console.log(`🎥 Has video: ${hasVideo}`);

    // ─────────────────────────────────────────────────────────
    // RETURN SUCCESS
    // ─────────────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        gallery: {
          id: gallery.id,
          surfSpot: gallery.surfSpot,
          date: gallery.date,
          photoCount: gallery.photos.length,
          hasVideo: gallery.hasVideo,
          status: gallery.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gallery creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create gallery",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
