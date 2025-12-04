// lib/queries/gallery.ts

import { prisma } from "@/lib/db";
import { Gallery } from "@/types/gallery";

// ✅ FULL gallery data (use only when viewing a single gallery)
export async function getAllGalleries(): Promise<Gallery[]> {
  const galleries = await prisma.gallery.findMany({
    where: {
      status: "APPROVED",
    },
    orderBy: { date: "desc" },
    include: {
      photographer: {
        select: {
          id: true,
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

// ✅ NEW: Lightweight data for homepage grid (MUCH FASTER!)
export async function getGalleriesForGrid() {
  return await prisma.gallery.findMany({
    where: {
      status: "APPROVED",
    },
    select: {
      id: true,
      area: true,
      coverPhoto: true,
    },
  });
}

// ✅ NEW: Data for highlighted galleries section
export async function getHighlightedGalleries() {
  return await prisma.gallery.findMany({
    where: {
      status: "APPROVED",
    },
    take: 6, // Only get 6 most recent
    orderBy: { date: "desc" },
    select: {
      id: true,
      coverPhoto: true,
      surfSpot: true,
      prefecture: true,
      area: true,
      sessionTime: true,
      date: true,
    },
  });
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
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (gallery && gallery.status !== "APPROVED") {
    return null;
  }

  return gallery;
}
