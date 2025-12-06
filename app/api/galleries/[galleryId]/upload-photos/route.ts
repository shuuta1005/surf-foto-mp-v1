// app/api/galleries/[galleryId]/upload-photos/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { put } from "@vercel/blob";

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

    // Check gallery ownership
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

    // Get uploaded files
    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Upload each photo
    const uploadedPhotos = [];

    for (const file of files) {
      // Upload to Vercel Blob (or your storage)
      const blob = await put(file.name, file, {
        access: "public",
      });

      // Create photo record
      const photo = await prisma.photo.create({
        data: {
          galleryId: galleryId,
          photoUrl: blob.url, // Watermarked version (you can add watermarking logic)
          originalUrl: blob.url, // Original (for now, same as photoUrl)
        },
      });

      uploadedPhotos.push(photo);
    }

    return NextResponse.json({
      success: true,
      count: uploadedPhotos.length,
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error("Error uploading photos:", error);
    return NextResponse.json(
      { error: "Failed to upload photos" },
      { status: 500 }
    );
  }
}
