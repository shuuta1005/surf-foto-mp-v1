// lib/actions/gallery.ts

"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 🏄‍♂️ Fetch unique Prefectures, Areas, Surf Spots from galleries
export async function getFilterOptions() {
  const galleries = await prisma.gallery.findMany({
    where: {
      status: "APPROVED",
    },
    select: {
      prefecture: true,
      area: true,
      surfSpot: true,
    },
  });

  // Create sets to remove duplicates
  const prefectures = new Set<string>();
  const areas = new Set<string>();
  const surfSpots = new Set<string>();

  for (const gallery of galleries) {
    prefectures.add(gallery.prefecture);
    areas.add(gallery.area);
    surfSpots.add(gallery.surfSpot);
  }

  return {
    prefectures: Array.from(prefectures).sort(),
    areas: Array.from(areas).sort(),
    surfSpots: Array.from(surfSpots).sort(),
  };
}

// ✅ NEW: Toggle epic status for a gallery
export async function toggleEpicGallery(galleryId: string) {
  const session = await auth();

  // Only ADMIN can mark galleries as epic
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized - Admin only");
  }

  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    select: { isEpic: true },
  });

  if (!gallery) {
    throw new Error("Gallery not found");
  }

  await prisma.gallery.update({
    where: { id: galleryId },
    data: { isEpic: !gallery.isEpic },
  });

  revalidatePath("/admin/galleries/epic");
  revalidatePath("/");

  return { success: true, isEpic: !gallery.isEpic };
}
