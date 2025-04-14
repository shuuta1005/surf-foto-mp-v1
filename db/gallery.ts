import { prisma } from "@/lib/db";

import { Gallery } from "@/app/types/gallery";

// ✅ Fetch all galleries (with first photo as cover image)

export async function getAllGalleries(): Promise<Gallery[]> {
  return await prisma.gallery.findMany({
    include: {
      photos: {
        select: {
          id: true,
          photoUrl: true,
          title: true,
          uploadedAt: true,
          galleryId: true,
        },
      },
    },
  });
}

// ✅ Fetch a single gallery by ID (with all photos)
export async function getGalleryById(
  galleryId: string
): Promise<Gallery | null> {
  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: { photos: true },
  });

  if (!gallery) return null;

  return {
    ...gallery,
    coverImage: gallery.coverImage ?? "", // Ensure coverImage is never null
  };
}
