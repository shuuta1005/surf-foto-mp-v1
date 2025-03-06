//page.tsx defines the homepage content and gets inserted into layout.tsx.

import HighlightedGalleries from "@/components/shared/highlightedGallery/HighlightedGalleries";
import HighlightedPhotos from "@/components/highlightedPhotos/HighlightedPhotos";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Homepage = async () => {
  await delay(1000);

  return (
    <>
      <HighlightedPhotos />
      <HighlightedGalleries />
    </>
  );
};

export default Homepage;
