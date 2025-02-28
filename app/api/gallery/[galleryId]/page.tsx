"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

// Define Type for Photos
type Photo = {
  id: string;
  photoUrl: string;
  title?: string;
};

const GalleryPage = () => {
  const { galleryId } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(`/api/gallery/${galleryId}/photos`);
        const data: Photo[] = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    }

    if (galleryId) {
      fetchPhotos();
    }
  }, [galleryId]);

  return (
    <div className="w-full px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Gallery Photos</h2>

      {loading && <p className="text-center text-gray-500">Loading photos...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative h-[250px]">
            <Image
              src={photo.photoUrl || "/images/default.jpg"} // Default image fallback
              alt={photo.title || "Untitled Photo"}
              layout="fill"
              objectFit="cover"
              className="rounded-md shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
