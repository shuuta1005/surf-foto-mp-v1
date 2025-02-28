// "use client";

// import { useState } from "react";
// import GalleryCard from "./GalleryCard";
// import GalleryPagination from "./GalleryPagination";

// const galleries = [
//   {
//     id: 1,
//     image: "/images/chiba.jpg",
//     title: "Torami",
//     location: "North Chiba",
//   },
//   {
//     id: 2,
//     image: "/images/hebara.jpg",
//     title: "Hebara",
//     location: "South Chiba",
//   },
//   {
//     id: 3,
//     image: "/images/miyazaki1.jpg",
//     title: "Kisakihama",
//     location: "Miyazaki",
//   },
//   {
//     id: 4,
//     image: "/images/Sendai.jpg",
//     title: "Sendai Shin-ko",
//     location: "Sendai",
//   },
//   {
//     id: 5,
//     image: "/images/miyazaki2.jpg",
//     title: "Miyazaki",
//     location: "Miyazaki",
//   },
//   {
//     id: 6,
//     image: "/images/kamo.jpg",
//     title: "Kamogawa",
//     location: "South Chiba",
//   },
//   {
//     id: 7,
//     image: "/images/float1.jpg",
//     title: "Dee Why",
//     location: "Sydney",
//   },
//   {
//     id: 8,
//     image: "/images/takeoff2.jpg",
//     title: "Dee Why",
//     location: "Sydney",
//   },
//   {
//     id: 9,
//     image: "/images/takeoff1.jpg",
//     title: "Maroubra",
//     location: "Sydney",
//   },
// ];

// const galleriesPerPage = 3;

// const HighlightedGalleries: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(0);
//   const totalPages = Math.ceil(galleries.length / galleriesPerPage);

//   const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
//   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

//   const getCurrentGalleries = () => {
//     const start = currentPage * galleriesPerPage;
//     return galleries.slice(start, start + galleriesPerPage);
//   };

//   return (
//     <div className="w-full px-4 py-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header and Pagination */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Score in February🔥</h2>
//           <GalleryPagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onNext={nextPage}
//             onPrev={prevPage}
//           />
//         </div>

//         {/* Gallery Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {getCurrentGalleries().map((gallery) => (
//             <GalleryCard
//               key={gallery.id}
//               image={gallery.image}
//               title={gallery.title}
//               location={gallery.location}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HighlightedGalleries;

"use client";

import { useState, useEffect } from "react";
import GalleryCard from "./GalleryCard";
import GalleryPagination from "./GalleryPagination";
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
