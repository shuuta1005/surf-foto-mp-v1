"use client";

import { useState } from "react";
import { useGalleries } from "@/app/hooks/useGalleries"; // Import the new fetching hook
import GalleryList from "./GalleryList"; // Import the new reusable list
import GalleryPagination from "../GalleryPagination";

const galleriesPerPage = 3;

const HighlightedGalleries: React.FC = () => {
  const { galleries, loading, error } = useGalleries();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(galleries.length / galleriesPerPage);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const getCurrentGalleries = () => {
    const start = currentPage * galleriesPerPage;
    return galleries.slice(start, start + galleriesPerPage);
  };

  if (loading) return <p className="text-center">Loading galleries...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Pagination */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Scores🔥最近の1173</h2>
          <GalleryPagination
            currentPage={currentPage}
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
};

export default HighlightedGalleries;
