// import GalleryCard from "./GalleryCard";

// interface GalleryListProps {
//   galleries: {
//     id: string;
//     coverPhoto?: string | null; // ✅ Match actual schema
//     surfSpot: string;
//     prefecture: string;
//     area: string;
//     sessionTime?: string | null;
//   }[];
// }

// const GalleryList: React.FC<GalleryListProps> = ({ galleries }) => {
//   return (
//     <div>
//       {/* Small screen: horizontal scroll */}
//       <div className="block md:hidden overflow-x-auto">
//         <div className="flex gap-4 px-2">
//           {galleries.map((gallery) => (
//             <div key={gallery.id} className="flex-shrink-0 w-80">
//               <GalleryCard
//                 id={gallery.id}
//                 image={gallery.coverPhoto || "/placeholder.jpg"}
//                 title={gallery.surfSpot}
//                 location={`${gallery.prefecture} - ${gallery.area}`}
//                 sessionTime={gallery.sessionTime || undefined}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Medium+ screen: 3-column grid */}
//       <div className="hidden md:grid grid-cols-3 gap-4">
//         {galleries.map((gallery) => (
//           <GalleryCard
//             key={gallery.id}
//             id={gallery.id}
//             image={gallery.coverPhoto || "/placeholder.jpg"}
//             title={gallery.surfSpot}
//             location={`${gallery.prefecture} - ${gallery.area}`}
//             sessionTime={gallery.sessionTime || undefined}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GalleryList;

import GalleryCard from "./GalleryCard";

interface GalleryListProps {
  galleries: {
    id: string;
    coverPhoto?: string | null;
    surfSpot: string;
    prefecture: string;
    area: string;
    sessionTime?: string | null;
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
                image={gallery.coverPhoto || "/placeholder.jpg"}
                title={gallery.surfSpot}
                location={`${gallery.prefecture} - ${gallery.area}`}
                sessionTime={gallery.sessionTime || undefined}
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
            image={gallery.coverPhoto || "/placeholder.jpg"}
            title={gallery.surfSpot}
            location={`${gallery.prefecture} - ${gallery.area}`}
            sessionTime={gallery.sessionTime || undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
