//page.tsx defines the homepage content and gets inserted into layout.tsx.

import DestinationsGrid from "@/components/destinationGrid/DestinationsGrid";
import HighlightedGalleries from "@/components/highlightedGallery/HighlightedGalleries";
import HighlightedPhotos from "@/components/highlightedPhotos/HighlightedPhotos";
// import { getFilterOptions } from "@/lib/actions/gallery";
import { getAllGalleries } from "@/db/gallery";

const Homepage = async () => {
  // const { areas } = await getFilterOptions();
  const galleries = await getAllGalleries();

  // const destinations = areas.map((area) => ({
  //   area,
  // }));

  return (
    <>
      <HighlightedPhotos />
      <HighlightedGalleries />
      <DestinationsGrid galleries={galleries} />
    </>
  );
};

export default Homepage;
