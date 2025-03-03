import { Gallery } from "@/app/types/gallery";

export function formatGalleries(galleries: Gallery[]) {
  return galleries.map((gallery) => ({
    id: gallery.id,
    name: gallery.name,
    location: gallery.location,
    coverImage:
      gallery.photos.length > 0
        ? gallery.photos[0].photoUrl
        : "/images/default.jpg",
  }));
}
