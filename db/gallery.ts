import { prisma } from "@/lib/db";

import { Gallery } from "@/app/types/gallery";

// ✅ Fetch all galleries (with first photo as cover image)

// ✅ Fetch all galleries with photos and photographer info
export async function getAllGalleries() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { date: "desc" }, // latest first
    include: {
      photos: {
        select: {
          id: true,
          galleryId: true,
          photoUrl: true,
          uploadedAt: true,
          isCover: true,
        },
      },
      photographer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return galleries;
}

// ✅ Fetch a single gallery by ID (with all photos)
export async function getGalleryById(
  galleryId: string
): Promise<Gallery | null> {
  return await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: {
      photos: true, // includes isCover, uploadedAt, etc.
    },
  });
}
