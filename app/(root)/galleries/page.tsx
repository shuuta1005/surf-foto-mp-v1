import { getFilterOptions } from "@/lib/actions/gallery";
import { getAllGalleries } from "@/db/gallery";
import GalleryList from "@/components/GalleryList";

// Update the interface to match what Next.js expects in version 15
interface GalleriesPageProps {
  searchParams: Promise<{ area?: string }>;
}

export default async function GalleriesPage({
  searchParams,
}: GalleriesPageProps) {
  const galleries = await getAllGalleries();
  const { areas } = await getFilterOptions();

  // Await searchParams before accessing its properties
  const params = await searchParams;
  const selectedArea = params?.area || "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-5xl sm:text-5xl font-extrabold text-gray-700 tracking-tight mb-12 text-center">
        All Galleries 🤙🏽
      </h1>

      <GalleryList
        galleries={galleries}
        areas={areas}
        initialSelectedArea={selectedArea}
      />
    </div>
  );
}
