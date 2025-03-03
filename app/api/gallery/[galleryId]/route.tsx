import { NextRequest, NextResponse } from "next/server";
import { Gallery } from "@/app/types/gallery"; // ✅ Use TypeScript types
import { getGalleryById } from "@/db/gallery";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ galleryId: string }> } // ✅ context.params is now a Promise in Next.js 15
) {
  try {
    // ✅ Extract galleryId properly
    const { galleryId } = await context.params; // Must await the params

    // ✅ Validate that galleryId exists
    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch the gallery and include all its photos
    const gallery: Gallery | null = await getGalleryById(galleryId);

    // ✅ Handle case where the gallery does not exist
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    return NextResponse.json(gallery); // ✅ Send the formatted gallery
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
