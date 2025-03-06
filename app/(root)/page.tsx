//page.tsx defines the homepage content and gets inserted into layout.tsx.

import HighlightedGalleries from "@/components/shared/highlightedGallery/HighlightedGalleries";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Homepage = async () => {
  await delay(1000);

  return (
    <>
      <HighlightedGalleries />
    </>
  );
};

export default Homepage;
