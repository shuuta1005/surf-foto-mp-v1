// // db/gallery.ts

// import { prisma } from "@/lib/db";
// import { Gallery } from "@/types/gallery"; // ✅ your custom Gallery type

// // ✅ Fetch all galleries with photos and photographer info
// export async function getAllGalleries(): Promise<Gallery[]> {
//   const galleries = await prisma.gallery.findMany({
//     orderBy: { date: "desc" },
//     select: {
//       id: true,
//       prefecture: true,
//       area: true,
//       surfSpot: true,
//       date: true,
//       sessionTime: true, // ✅ include this
//       coverPhoto: true, // ✅ include this
//       isPublic: true,
//       photographerId: true,
//       createdAt: true,
//       photographer: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//       photos: {
//         select: {
//           id: true,
//           galleryId: true,
//           photoUrl: true,
//           createdAt: true,
//         },
//       },
//     },
//   });

//   return galleries as Gallery[];
// }

// // ✅ Fetch a single gallery by ID (with all photos)
// export async function getGalleryById(
//   galleryId: string
// ): Promise<Gallery | null> {
//   const gallery = await prisma.gallery.findUnique({
//     where: { id: galleryId },
//     include: {
//       photos: true, // includes isCover, uploadedAt, etc.
//       photographer: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });

//   return gallery as Gallery | null; // ✅ Same here
// }

// db/gallery.ts

import { prisma } from "@/lib/db";
import { Gallery } from "@/types/gallery"; // ✅ your custom Gallery type

// ✅ Fetch all galleries with photos, pricing tiers, and photographer info
export async function getAllGalleries(): Promise<Gallery[]> {
  const galleries = await prisma.gallery.findMany({
    orderBy: { date: "desc" },
    include: {
      photographer: {
        select: {
          name: true,
          email: true,
        },
      },
      photos: true, // full Photo objects
      pricingTiers: true, // full PricingTier objects
    },
  });

  return galleries; // ✅ typed as Gallery[] automatically
}

// ✅ Fetch a single gallery by ID (with all photos + pricing tiers)
export async function getGalleryById(
  galleryId: string
): Promise<Gallery | null> {
  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: {
      photos: true, // full Photo objects
      pricingTiers: true, // full PricingTier objects
      photographer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return gallery; // ✅ typed as Gallery | null automatically
}
