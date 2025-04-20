import { getAllGalleries } from "@/db/gallery";
import HighlightedGalleriesClient from "./HighlightedGalleriesClient";

export default async function HighlightedGalleries() {
  const galleries = await getAllGalleries();

  const formattedGalleries = galleries.map((gallery) => ({
    id: gallery.id,
    name: gallery.surfSpot, // surfSpot becomes title/name
    location: gallery.area, // e.g., 千葉北
    coverImage:
      gallery.photos.find((p) => p.isCover)?.photoUrl ||
      gallery.photos[0]?.photoUrl || // fallback if no cover
      "/placeholder.jpg",
  }));

  return <HighlightedGalleriesClient galleries={formattedGalleries} />;
}
