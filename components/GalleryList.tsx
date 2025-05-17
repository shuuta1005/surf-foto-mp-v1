// //app/components/GalleryList.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Gallery } from "@/app/types/gallery";

interface GalleryListProps {
  galleries: Gallery[];
  initialSelectedArea?: string;
  initialSearchQuery?: string;
  initialDateRange?: string;
}

export default function GalleryList({
  galleries,
  initialSearchQuery = "",
  initialDateRange = "",
}: GalleryListProps) {
  const searchParams = useSearchParams();

  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState(initialDateRange);
  const searchQuery = initialSearchQuery;

  useEffect(() => {
    const areaFromURL = searchParams?.get("area") || "";
    setSelectedArea(areaFromURL);
  }, [searchParams]);

  const filteredGalleries = galleries.filter((gallery) => {
    const matchArea = selectedArea ? gallery.area === selectedArea : true;

    const matchDate = selectedDateRange
      ? (() => {
          const days = parseInt(selectedDateRange, 10);
          const galleryDate = new Date(gallery.date);
          const today = new Date();
          const diffTime = today.getTime() - galleryDate.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          return diffDays <= days;
        })()
      : true;

    const matchSearch = searchQuery
      ? [gallery.surfSpot, gallery.area, gallery.prefecture].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;

    return matchArea && matchDate && matchSearch;
  });

  return (
    <>
      {/* 🛠 Date Filter Section */}
      <div className="flex justify-center gap-4 mb-12">
        <select
          className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-stone-400 focus:ring-0"
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
        >
          <option value="">All Dates</option>
          <option value="7">Last 7 Days</option>
          <option value="14">Last 2 Weeks</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 3 Months</option>
          <option value="180">Last 6 Months</option>
          <option value="365">Last 1 Year</option>
        </select>
      </div>

      {/* 🔥 Gallery Grid */}
      {filteredGalleries.length === 0 ? (
        <p className="text-center text-gray-500">
          No galleries match the selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => (
            <Link
              key={gallery.id}
              href={`/gallery/${gallery.id}`}
              className="block border rounded shadow hover:shadow-lg transition"
            >
              {/* ✅ Cover Image */}
              {gallery.coverPhoto && (
                <div className="relative w-full h-48">
                  <Image
                    src={gallery.coverPhoto}
                    alt="Gallery cover"
                    fill
                    className="object-cover rounded-t"
                  />
                </div>
              )}

              <div className="p-4">
                <h2 className="text-xl font-bold">{gallery.surfSpot}</h2>
                <p className="text-sm text-gray-700">
                  {gallery.prefecture} - {gallery.area}
                </p>

                {/* ✅ Session Time (optional) */}
                {gallery.sessionTime && (
                  <p className="text-xs text-gray-600 italic">
                    Session: {gallery.sessionTime}
                  </p>
                )}

                <p className="text-xs text-gray-600">
                  {new Date(gallery.date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
