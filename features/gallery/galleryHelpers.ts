import { Gallery } from "@/types/gallery";

export function formatGalleries(galleries: Gallery[]): Array<{
  id: string;
  name: string;
  location?: string | null;
  coverImage: string;
  createdAt: Date; // ✅ Ensure it includes createdAt
  photos: Gallery["photos"]; // ✅ Ensure it includes photos
}> {
  return galleries.map((gallery) => ({
    id: gallery.id,
    name: `${gallery.surfSpot}- ${gallery.area}`,
    location: gallery.surfSpot || null,
    coverImage: gallery.photos.find((p) => p.isCover)?.photoUrl || "", // Ensure coverImage is never null
    createdAt: gallery.createdAt, // ✅ Include createdAt
    photos: gallery.photos, // ✅ Ensure photos are included
  }));
}
