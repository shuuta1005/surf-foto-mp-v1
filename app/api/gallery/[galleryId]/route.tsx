import { NextResponse } from "next/server";
import { Gallery } from "@/app/types/gallery"; // ✅ Use TypeScript types
import { getGalleryById } from "@/db/gallery";

export async function GET(
  req: Request,
  { params }: { params: { galleryId: string } }
) {
  try {
    // ✅ Validate that galleryId exists
    if (!params.galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      );
    }

    const gallery: Gallery | null = await getGalleryById(params.galleryId);

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
