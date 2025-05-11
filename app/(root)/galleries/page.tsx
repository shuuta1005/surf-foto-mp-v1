//app/(root)/galleries/page.tsx

import { getAllGalleries } from "@/lib/queries/gallery";
import GalleryList from "@/components/GalleryList";

interface GalleriesPageProps {
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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-5xl sm:text-5xl font-extrabold text-gray-700 tracking-tight mb-12 text-center">
        All Galleries 🤙🏽
      </h1>

      <GalleryList
        galleries={galleries}
        initialSelectedArea={selectedArea}
        initialSearchQuery={searchQuery}
      />
    </div>
  );
}
