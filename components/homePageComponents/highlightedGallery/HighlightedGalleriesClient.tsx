"use client";

import { useState } from "react";
import GalleryList from "./GalleryList";
import GalleryPagination from "./GalleryPagination";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface HighlightedGalleriesProps {
  galleries: {
    id: string;
    coverPhoto?: string | null;
    surfSpot: string;
    prefecture: string;
    area: string;
    sessionTime?: string | null;
    date?: string | Date | null; // ✅ Add this
  }[];
}

const galleriesPerPage = 3;

export default function HighlightedGalleriesClient({
  galleries,
}: HighlightedGalleriesProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const isMobile = useIsMobile();
  const totalPages = Math.ceil(galleries.length / galleriesPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const getCurrentGalleries = () => {
    const start = currentPage * galleriesPerPage;
    return galleries.slice(start, start + galleriesPerPage);
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Recent Scores🔥最近のいい波
          </h2>

          {!isMobile && (
            <GalleryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={nextPage}
              onPrev={prevPage}
            />
          )}
        </div>

        {/* ✅ Pass correct props to GalleryList */}
        <GalleryList galleries={isMobile ? galleries : getCurrentGalleries()} />
      </div>
    </div>
  );
}
