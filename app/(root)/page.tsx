// page.tsx

import DestinationsGrid from "@/components/homePageComponents/destinationGrid/DestinationsGrid";
import HighlightedGalleries from "@/components/homePageComponents/highlightedGallery/HighlightedGalleries";
import HighlightedPhotos from "@/components/homePageComponents/highlightedPhotos/HighlightedPhotos";
import PhotographerCTA from "@/components/homePageComponents/photographerCTA/PhotographerCTA";
import {
  getGalleriesForGrid,
  getHighlightedGalleries,
} from "@/lib/queries/gallery";

const Homepage = async () => {
  // ✅ Fetch both in parallel (FAST!)
  const [gridGalleries, highlightedGalleries] = await Promise.all([
    getGalleriesForGrid(), // Only gets: id, area, coverPhoto
    getHighlightedGalleries(), // Only gets 6 galleries with minimal data
  ]);

  return (
    <>
      <HighlightedPhotos />
      <HighlightedGalleries galleries={highlightedGalleries} />

      {/* 📸 Photographer CTA - Positioned strategically between sections */}
      <PhotographerCTA />

      <DestinationsGrid galleries={gridGalleries} />
    </>
  );
};

export default Homepage;
