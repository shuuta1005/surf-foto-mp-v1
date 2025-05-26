//app/(root)/galleries/page.tsx

import { getAllGalleries } from "@/lib/queries/gallery";
import GalleryList from "@/components/shared/GalleryList";

interface GalleriesPageProps {
  //Maybe move this?
  searchParams: Promise<{ area?: string; search?: string }>;
}

export default async function GalleriesPage({
  searchParams,
}: GalleriesPageProps) {
  const galleries = await getAllGalleries();

  const params = await searchParams;
  const selectedArea = params?.area || "";
  const searchQuery = params?.search || "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-700 tracking-tight mb-2">
        {selectedArea && searchQuery
          ? `"${searchQuery}" in ${selectedArea}`
          : selectedArea
          ? `Galleries in ${selectedArea}`
          : searchQuery
          ? `Search results for "${searchQuery}"`
          : "BraH サーフ Fotos"}
      </h1>

      <GalleryList
        galleries={galleries}
        initialSelectedArea={selectedArea}
        initialSearchQuery={searchQuery}
      />
    </div>
  );
}
