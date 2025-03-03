//NextResponse → Used to send JSON responses in Next.js API routes.
import { NextResponse } from "next/server";
import { formatGalleries } from "@/lib/galleryHelpers";
import { Gallery } from "@/app/types/gallery";
import { getAllGalleries } from "@/db/gallery";

//This function runs when /api/gallery is requested with a GET request.
//The frontend calls this function when it needs all galleries.
export async function GET() {
  try {
    const galleries: Gallery[] = await getAllGalleries();

    const formattedGalleries = formatGalleries(galleries);

    return NextResponse.json(formattedGalleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}
