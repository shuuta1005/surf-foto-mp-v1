// //app/components/GalleryList.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";

// interface Photo {
//   photoUrl: string;
//   isCover?: boolean;
// }

// interface Gallery {
//   id: string;
//   area: string;
//   surfSpot: string;
//   prefecture: string;
//   date: Date;
//   photos: Photo[];
// }

// interface GalleryListProps {
//   galleries: Gallery[];
//   areas: string[];
//   initialSelectedArea?: string;
//   initialSearchQuery?: string; // 🆕 Add this
// }

// export default function GalleryList({
//   galleries,
//   areas,
//   initialSelectedArea = "",
//   initialSearchQuery = "",
// }: GalleryListProps) {
//   const [selectedArea, setSelectedArea] = useState(initialSelectedArea);
//   const [selectedDateRange, setSelectedDateRange] = useState("");
//   const searchQuery = initialSearchQuery;

//   const filteredGalleries = galleries.filter((gallery) => {
//     const matchArea = selectedArea ? gallery.area === selectedArea : true;

//     const matchDate = selectedDateRange
//       ? (() => {
//           const days = parseInt(selectedDateRange, 10);
//           const galleryDate = new Date(gallery.date);
//           const today = new Date();
//           const diffTime = today.getTime() - galleryDate.getTime();
//           const diffDays = diffTime / (1000 * 3600 * 24);
//           return diffDays <= days;
//         })()
//       : true;

//     const matchSearch = searchQuery
//       ? gallery.surfSpot.toLowerCase().includes(searchQuery.toLowerCase())
//       : true;

//     return matchArea && matchDate && matchSearch;
//   });

//   return (
//     <>
//       {/* 🛠 Filter Section */}
//       <div className="flex flex-wrap justify-center gap-4 mb-12">
//         {/* Area Filter */}
//         <select
//           className="border border-gray-300 rounded-md p-2 text-gray-700"
//           value={selectedArea}
//           onChange={(e) => setSelectedArea(e.target.value)}
//         >
//           <option value="">All Areas</option>
//           {areas.map((area) => (
//             <option key={area} value={area}>
//               {area}
//             </option>
//           ))}
//         </select>

//         {/* Date Range Filter */}
//         <select
//           className="border border-gray-300 rounded-md p-2 text-gray-700"
//           value={selectedDateRange}
//           onChange={(e) => setSelectedDateRange(e.target.value)}
//         >
//           <option value="">All Dates</option>
//           <option value="7">Last 7 Days</option>
//           <option value="30">Last 30 Days</option>
//           <option value="90">Last 3 Months</option>
//         </select>
//       </div>

//       {/* 🔥 Galleries Grid */}
//       {filteredGalleries.length === 0 ? (
//         <p className="text-center text-gray-500">
//           No galleries match the selected filters.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {filteredGalleries.map((gallery) => {
//             const cover =
//               gallery.photos.find((p) => p.isCover) ?? gallery.photos[0];

//             return (
//               <Link
//                 key={gallery.id}
//                 href={`/gallery/${gallery.id}`}
//                 className="block border rounded shadow hover:shadow-lg transition"
//               >
//                 {cover && (
//                   <div className="relative w-full h-48">
//                     <Image
//                       src={cover.photoUrl}
//                       alt="Gallery cover"
//                       fill
//                       className="object-cover rounded-t"
//                     />
//                   </div>
//                 )}
//                 <div className="p-4">
//                   <h2 className="text-xl font-bold">{gallery.surfSpot}</h2>
//                   <p className="text-sm text-gray-700">
//                     {gallery.prefecture} - {gallery.area}
//                   </p>
//                   <p className="text-xs text-gray-600">
//                     {new Date(gallery.date).toLocaleDateString()}
//                   </p>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Photo {
  photoUrl: string;
  isCover?: boolean;
}

interface Gallery {
  id: string;
  area: string;
  surfSpot: string;
  prefecture: string;
  date: Date;
  photos: Photo[];
}

// interface GalleryListProps {
//   galleries: Gallery[];
//   initialSearchQuery?: string;
//   initialDateRange?: string;
// }

interface GalleryListProps {
  galleries: Gallery[];
  initialSelectedArea?: string; // ✅ Make sure this line is here
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

  // ✅ Sync selectedArea from URL on every change
  useEffect(() => {
    const areaFromURL = searchParams.get("area") || "";
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
      ? gallery.surfSpot.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchArea && matchDate && matchSearch;
  });

  return (
    <>
      {/* 🛠 Date Filter Section (Area handled by AreaFilterBar) */}
      <div className="flex justify-center gap-4 mb-12">
        {/* Date Range Filter */}
        <select
          className="border border-gray-300 rounded-md p-2 text-gray-700"
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
        >
          <option value="">All Dates</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 3 Months</option>
        </select>
      </div>

      {/* 🔥 Gallery Grid */}
      {filteredGalleries.length === 0 ? (
        <p className="text-center text-gray-500">
          No galleries match the selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredGalleries.map((gallery) => {
            const cover =
              gallery.photos.find((p) => p.isCover) ?? gallery.photos[0];

            return (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.id}`}
                className="block border rounded shadow hover:shadow-lg transition"
              >
                {cover && (
                  <div className="relative w-full h-48">
                    <Image
                      src={cover.photoUrl}
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
                  <p className="text-xs text-gray-600">
                    {new Date(gallery.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
