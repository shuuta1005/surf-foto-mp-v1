"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface Gallery {
  id: string;
  area: string;
  coverPhoto?: string | null; // ✅ added this
}

interface DestinationsGridProps {
  galleries: Gallery[];
}

const DestinationsGrid = ({ galleries }: DestinationsGridProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const destinationsPerPage = 12;
  const router = useRouter();
  const isMobile = useIsMobile();

  const uniqueAreas = Array.from(
    new Map(galleries.map((g) => [g.area, g])).values()
  );

  const totalPages = Math.ceil(uniqueAreas.length / destinationsPerPage);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  const getCurrentDestinations = () => {
    const start = currentPage * destinationsPerPage;
    return uniqueAreas.slice(start, start + destinationsPerPage);
  };

  const handleAreaClick = (area: string) => {
    router.push(`/galleries?area=${encodeURIComponent(area)}`);
  };

  const destinationsToDisplay = isMobile
    ? uniqueAreas
    : getCurrentDestinations();

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Pagination */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            All Destinations
          </h2>
          {!isMobile && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </p>
              <button
                onClick={prevPage}
                className="p-2 rounded-full hover:bg-gray-100 border"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPage}
                className="p-2 rounded-full hover:bg-gray-100 border"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Grid or Scroll View */}
        {isMobile ? (
          <div className="flex overflow-x-auto gap-4">
            {destinationsToDisplay.map((gallery, index) => (
              <div
                key={index}
                onClick={() => handleAreaClick(gallery.area)}
                className="flex-shrink-0 w-40 sm:w-44 p-2 bg-white rounded-lg hover:bg-gray-100 cursor-pointer border border-stone-100"
              >
                <div className="w-full h-28 sm:h-32 relative mb-2">
                  {gallery.coverPhoto ? (
                    <Image
                      src={gallery.coverPhoto}
                      alt={gallery.area}
                      fill
                      className="object-cover rounded-lg"
                      sizes="100vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-center">
                  {gallery.area}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {destinationsToDisplay.map((gallery, index) => (
              <div
                key={index}
                onClick={() => handleAreaClick(gallery.area)}
                className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-100 cursor-pointer border border-stone-100"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative">
                  {gallery.coverPhoto ? (
                    <Image
                      src={gallery.coverPhoto}
                      alt={gallery.area}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="ml-3 sm:ml-4 flex-grow">
                  <h3 className="font-semibold text-sm sm:text-base">
                    {gallery.area}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsGrid;
