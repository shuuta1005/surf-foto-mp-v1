// app/api/admin/watermark/route.ts
// ═══════════════════════════════════════════════════════════════
// WATERMARKING ENDPOINT
// Purpose: Watermark photos after they're uploaded to Blob
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { config as authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { watermarkPhotos } from "@/lib/blob-watermark";

type WatermarkRequest = {
  galleryId: string;
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
    const { galleryId } = (await request.json()) as WatermarkRequest;

    if (!galleryId) {
      return NextResponse.json({ error: "Missing galleryId" }, { status: 400 });
    }

    // ─────────────────────────────────────────────────────────
    // FETCH GALLERY WITH PHOTOS
    // ─────────────────────────────────────────────────────────
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: { photos: true },
    });

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    console.log(`🎨 Starting watermarking for gallery: ${galleryId}`);
    console.log(`📸 Processing ${gallery.photos.length} photos...`);

    // ─────────────────────────────────────────────────────────
    // WATERMARK ALL PHOTOS
    // ─────────────────────────────────────────────────────────
    const photosToWatermark = gallery.photos.map((photo) => ({
      url: photo.originalUrl,
      mediaType: photo.mediaType,
      filename: `photo-${photo.id}.jpg`,
    }));

    const watermarked = await watermarkPhotos(photosToWatermark);

    // ─────────────────────────────────────────────────────────
    // UPDATE DATABASE WITH WATERMARKED URLS
    // ─────────────────────────────────────────────────────────
    await Promise.all(
      gallery.photos.map((photo, index) =>
        prisma.photo.update({
          where: { id: photo.id },
          data: {
            photoUrl: watermarked[index].watermarkedUrl,
          },
        })
      )
    );

    console.log(`✅ Watermarking complete for gallery: ${galleryId}`);

    return NextResponse.json({
      success: true,
      processedPhotos: watermarked.length,
    });
  } catch (error) {
    console.error("❌ Watermarking failed:", error);
    return NextResponse.json(
      {
        error: "Watermarking failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
