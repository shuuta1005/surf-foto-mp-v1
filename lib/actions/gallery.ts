// lib/actions/gallery.ts

import { prisma } from "@/lib/db";

// 🏄‍♂️ Fetch unique Prefectures, Areas, Surf Spots from galleries
export async function getFilterOptions() {
  const galleries = await prisma.gallery.findMany({
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
