import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST - Add a new photo to a gallery
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("✅ Received Data:", body); // Debugging Log

    const { galleryId, photoUrl, title } = body;

    // Validate input
    if (!galleryId || !photoUrl) {
      console.error("❌ Missing required fields:", { galleryId, photoUrl });
      return NextResponse.json(
        { error: "Gallery ID and Photo URL are required" },
        { status: 400 }
      );
    }

    // Check if gallery exists
    const gallery = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });
    if (!gallery) {
      console.error("❌ Gallery not found:", galleryId);
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // Create the photo entry in the database
    const newPhoto = await prisma.photo.create({
      data: { galleryId, photoUrl, title },
    });

    console.log("✅ Photo successfully saved:", newPhoto); // Debugging Log
    return NextResponse.json(newPhoto);
  } catch (error) {
    console.error("❌ Error uploading photo:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
