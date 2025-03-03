import prisma from "./db"; // ✅ Use Prisma instance

// ✅ Fetch all galleries (with first photo as cover image)
export async function getAllGalleries() {
  return await prisma.gallery.findMany({
    include: { photos: { take: 1 } }, // Fetch first photo for cover image
  });
}

// ✅ Fetch a single gallery by ID (with all photos)
export async function getGalleryById(galleryId: string) {
  return await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: { photos: true },
  });
}
