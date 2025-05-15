import { getAllGalleries } from "@/lib/queries/gallery";
import HighlightedGalleriesClient from "./HighlightedGalleriesClient";

export default async function HighlightedGalleries() {
  const galleries = await getAllGalleries();

  const formattedGalleries = galleries.map((gallery) => ({
    id: gallery.id,
    coverPhoto: gallery.coverPhoto, // ✅ use the proper one!
    surfSpot: gallery.surfSpot,
    prefecture: gallery.prefecture,
    area: gallery.area,
    sessionTime: gallery.sessionTime,
  }));

  return <HighlightedGalleriesClient galleries={formattedGalleries} />;
}
