// lib/queries/gallery.ts

import { prisma } from "@/lib/db";
import { Gallery } from "@/types/gallery";

// ✅ Fetch all APPROVED galleries with photos, pricing tiers, and photographer info
export async function getAllGalleries(): Promise<Gallery[]> {
  const galleries = await prisma.gallery.findMany({
    where: {
      status: "APPROVED", // ✅ Only show approved galleries
    },
    orderBy: { date: "desc" },
    include: {
      photographer: {
        select: {
          id: true, // ✅ Added id
          name: true,
          email: true,
        },
      },
      photos: true,
      pricingTiers: true,
    },
  });

  return galleries;
}

// ✅ Fetch a single gallery by ID (only if APPROVED)
export async function getGalleryById(
  galleryId: string
): Promise<Gallery | null> {
  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: {
      photos: true,
      pricingTiers: true,
      photographer: {
        select: {
          id: true, // ✅ Added id
          name: true,
          email: true,
        },
      },
    },
  });

  // ✅ Return null if gallery is not approved (privacy protection)
  if (gallery && gallery.status !== "APPROVED") {
    return null;
  }

  return gallery;
}
