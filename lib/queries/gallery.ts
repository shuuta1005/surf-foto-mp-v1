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

// ✅ UPDATED: Get epic galleries ONLY (no fallback)
export async function getHighlightedGalleries() {
  const galleries = await prisma.gallery.findMany({
    where: {
      status: "APPROVED",
      isEpic: true, // ✅ Only epic galleries
    },
    take: 6,
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

  // ❌ REMOVED: Fallback logic
  // If you want to add it back later, uncomment below:
  /*
  if (galleries.length === 0) {
    galleries = await prisma.gallery.findMany({
      where: { status: "APPROVED" },
      take: 6,
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
  */

  return galleries;
}

// ✅ NEW: Get all approved galleries for admin (to manage epic status)
export async function getAllApprovedGalleriesForAdmin() {
  return await prisma.gallery.findMany({
    where: {
      status: "APPROVED",
    },
    orderBy: [
      { isEpic: "desc" }, // Epic ones first
      { date: "desc" },
    ],
    select: {
      id: true,
      coverPhoto: true,
      surfSpot: true,
      prefecture: true,
      area: true,
      date: true,
      isEpic: true,
      photographer: {
        select: {
          name: true,
        },
      },
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
