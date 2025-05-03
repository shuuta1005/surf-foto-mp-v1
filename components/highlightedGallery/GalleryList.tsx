// import GalleryCard from "./GalleryCard";

// interface GalleryListProps {
//   galleries: {
//     id: string;
//     coverImage?: string | null; // ✅ Allow undefined or null
//     name: string;
//     location?: string;
//   }[];
// }

// const GalleryList: React.FC<GalleryListProps> = ({ galleries }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {galleries.map((gallery) => (
//         <GalleryCard
//           key={gallery.id}
//           id={gallery.id}
//           image={gallery.coverImage || "/placeholder.jpg"} // ✅ Provide a default value
//           title={gallery.name}
//           location={gallery.location || "Unknown"}
//         />
//       ))}
//     </div>
//   );
// };

// export default GalleryList;

import GalleryCard from "./GalleryCard";

interface GalleryListProps {
  galleries: {
    id: string;
    coverImage?: string | null;
    name: string;
    location?: string;
  }[];
}

const GalleryList: React.FC<GalleryListProps> = ({ galleries }) => {
  return (
    <div>
      {/* Small screen: horizontal scroll */}
      <div className="block md:hidden overflow-x-auto">
        <div className="flex gap-4 px-2">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="flex-shrink-0 w-80">
              <GalleryCard
                id={gallery.id}
                image={gallery.coverImage || "/placeholder.jpg"}
                title={gallery.name}
                location={gallery.location || "Unknown"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Medium+ screen: 3-column grid */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {galleries.map((gallery) => (
          <GalleryCard
            key={gallery.id}
            id={gallery.id}
            image={gallery.coverImage || "/placeholder.jpg"}
            title={gallery.name}
            location={gallery.location || "Unknown"}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
