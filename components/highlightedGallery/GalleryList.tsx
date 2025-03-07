import GalleryCard from "./GalleryCard";

interface GalleryListProps {
  galleries: {
    id: string;
    coverImage?: string | null; // ✅ Allow undefined or null
    name: string;
    location?: string;
  }[];
}

const GalleryList: React.FC<GalleryListProps> = ({ galleries }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {galleries.map((gallery) => (
        <GalleryCard
          key={gallery.id}
          id={gallery.id}
          image={gallery.coverImage || "/placeholder.jpg"} // ✅ Provide a default value
          title={gallery.name}
          location={gallery.location || "Unknown"}
        />
      ))}
    </div>
  );
};

export default GalleryList;
