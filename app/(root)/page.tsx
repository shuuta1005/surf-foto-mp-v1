import HighlightedGalleries from "@/components/shared/highlightedGallery/HighlightedGalleries";
import UploadPhoto from "@/components/admin/photoUpload";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Homepage = async () => {
  await delay(1000);
  return (
    <>
      <HighlightedGalleries />
      <UploadPhoto />
    </>
  );
};

export default Homepage;
