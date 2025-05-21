// db/gallery.ts

import { prisma } from "@/lib/db";
import { Gallery } from "@/types/gallery"; // ✅ your custom Gallery type

// ✅ Fetch all galleries with photos and photographer info
export async function getAllGalleries(): Promise<Gallery[]> {
  const galleries = await prisma.gallery.findMany({
    orderBy: { date: "desc" },
    select: {
      id: true,
      prefecture: true,
      area: true,
      surfSpot: true,
      date: true,
      sessionTime: true, // ✅ include this
      coverPhoto: true, // ✅ include this
      isPublic: true,
      photographerId: true,
      createdAt: true,
      photographer: {
        select: {
          name: true,
          email: true,
        },
      },
      photos: {
        select: {
          id: true,
          galleryId: true,
          photoUrl: true,
          uploadedAt: true,
          isCover: true,
        },
      },
    },
  });

  return galleries as Gallery[];
}

// ✅ Fetch a single gallery by ID (with all photos)
export async function getGalleryById(
  galleryId: string
): Promise<Gallery | null> {
  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: {
      photos: true, // includes isCover, uploadedAt, etc.
      photographer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return gallery as Gallery | null; // ✅ Same here
}
