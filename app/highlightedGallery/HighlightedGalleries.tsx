"use client";

import { useState, useEffect } from "react";
import GalleryCard from "../../components/shared/GalleryCard";
import GalleryPagination from "../../components/shared/GalleryPagination";
//import { useRouter } from "next/navigation";

// Define Type for Gallery
type Gallery = {
  id: string;
  name: string;
  location?: string;
  coverImage?: string;
};

const galleriesPerPage = 3;

const HighlightedGalleries: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  //const router = useRouter();

  useEffect(() => {
    async function fetchGalleries() {
      try {
        const response = await fetch("/api/gallery");
        const data: Gallery[] = await response.json();
        setGalleries(data);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGalleries();
  }, []);

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
          <h2 className="text-2xl font-bold">Score in February🔥</h2>
          <GalleryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </div>

        {/* Show Loading Indicator */}
        {loading && (
          <p className="text-center text-gray-500">Loading galleries...</p>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getCurrentGalleries().map((gallery) => (
            <GalleryCard
              key={gallery.id}
              id={gallery.id}
              image={gallery.coverImage || "/images/default.jpg"} // Default fallback image
              title={gallery.name}
              location={gallery.location || "Unknown"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightedGalleries;
