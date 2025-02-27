import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Context {
  params?: { galleryId?: string }; // Optional params to prevent type errors
}

// GET - Fetch all photos for a specific gallery
export async function GET(req: NextRequest, context: Context) {
  try {
    const galleryId = context.params?.galleryId; // Safely access params

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    const photos = await prisma.photo.findMany({
      where: { galleryId },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
