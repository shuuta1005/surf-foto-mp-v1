//page.tsx defines the homepage content and gets inserted into layout.tsx.

import DestinationsGrid from "@/components/destinationGrid/DestinationsGrid";
import HighlightedGalleries from "@/components/highlightedGallery/HighlightedGalleries";
import HighlightedPhotos from "@/components/highlightedPhotos/HighlightedPhotos";

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Homepage = () => {
  //await delay(1000);

  return (
    <>
      <HighlightedPhotos />
      <HighlightedGalleries />
      <DestinationsGrid />
    </>
  );
};

export default Homepage;
