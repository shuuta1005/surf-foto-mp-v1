import { getAllGalleries } from "@/db/gallery";
import HighlightedGalleriesClient from "./HighlightedGalleriesClient"; // ✅ Import new client component

export default async function HighlightedGalleries() {
  const galleries = await getAllGalleries(); // ✅ Fetch directly from DB

  // ✅ Ensure location is always a string (replace null with "Unknown")
  const formattedGalleries = galleries.map((gallery) => ({
    ...gallery,
    location: gallery.location ?? "Unknown", // ✅ Fix: Ensure it's always a string
  }));

  return <HighlightedGalleriesClient galleries={formattedGalleries} />;
}
