import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all galleries including their photos
    const galleries = await prisma.gallery.findMany({
      include: { photos: true },
    });

    // Ensure first photo in the gallery is selected as the cover image
    const formattedGalleries = galleries.map((gallery) => {
      const coverPhoto =
        gallery.photos.length > 0
          ? gallery.photos[0].photoUrl
          : "/images/default.jpg";

      return {
        id: gallery.id,
        name: gallery.name,
        location: gallery.location,
        coverImage: coverPhoto,
      };
    });

    return NextResponse.json(formattedGalleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}
