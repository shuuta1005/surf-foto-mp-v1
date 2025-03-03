import prisma from "./db";

// ✅ Fetch all photos for a gallery
export async function getPhotosByGalleryId(galleryId: string) {
  return await prisma.photo.findMany({
    where: { galleryId },
  });
}

// ✅ Create a new photo
export async function createPhoto(
  galleryId: string,
  photoUrl: string,
  title?: string
) {
  return await prisma.photo.create({
    data: { galleryId, photoUrl, title },
  });
}
