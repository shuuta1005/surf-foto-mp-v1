import { Gallery } from "@/app/types/gallery";

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
    name: gallery.name,
    location: gallery.location || null,
    coverImage: gallery.coverImage ?? "", // Ensure coverImage is never null
    createdAt: gallery.createdAt, // ✅ Include createdAt
    photos: gallery.photos, // ✅ Ensure photos are included
  }));
}
