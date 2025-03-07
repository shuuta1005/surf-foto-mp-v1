"use client"; // ✅ Client component to manage pagination

import { useState } from "react";
import GalleryList from "./GalleryList";
import GalleryPagination from "./GalleryPagination";

interface HighlightedGalleriesProps {
  galleries: {
    id: string;
    coverImage?: string | null;
    name: string;
    location?: string;
  }[];
}

const galleriesPerPage = 3;

export default function HighlightedGalleriesClient({
  galleries,
}: HighlightedGalleriesProps) {
  const [currentPage, setCurrentPage] = useState(0);
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
        {/* Header and Pagination */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Scores🔥最近の1173</h2>
          <GalleryPagination
            currentPage={currentPage} // ✅ Fix: Now properly passed
            totalPages={totalPages}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </div>

        {/* Render Gallery List */}
        <GalleryList galleries={getCurrentGalleries()} />
      </div>
    </div>
  );
}
