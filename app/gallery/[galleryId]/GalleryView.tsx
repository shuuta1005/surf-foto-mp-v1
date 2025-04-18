"use client";

import { useState } from "react";
import Image from "next/image";
import GalleryHeader from "./GalleryHeader";
import GalleryGrid from "./GalleryGrid";
import PhotoModal from "./PhotoModal";
import { GalleryViewProps } from "@/app/types/gallery";

export default function GalleryView({ gallery }: GalleryViewProps) {
  //   🧠 React is “Top-Down” (Unidirectional Data Flow)
  // This means:

  // State should live in the parent if multiple children need to share or update it

  // The parent controls the logic

  // It passes props (data + functions) down to the children

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : prev
    );
  };

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) =>
      prev !== null && prev < gallery.photos.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <div>
      <GalleryHeader
        name={gallery.name}
        location={gallery.location ?? undefined}
      />

      {/* ✅ Cover Image */}
      {gallery.photos.length > 0 && (
        <div className="relative w-full h-96 overflow-hidden">
          <Image
            src={gallery.photos[0].photoUrl}
            alt="Gallery Cover"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* ✅ Gallery Grid */}
        <GalleryGrid gallery={gallery} onPhotoClick={handlePhotoClick} />

        {/* ✅ Photo Modal */}
        {selectedPhotoIndex !== null && (
          // <PhotoModal
          //   photoUrl={gallery.photos[selectedPhotoIndex].photoUrl}
          //   onClose={handleCloseModal}
          //   onNext={handleNextPhoto}
          //   onPrev={handlePrevPhoto}
          //   isFirst={selectedPhotoIndex === 0}
          //   isLast={selectedPhotoIndex === gallery.photos.length - 1}
          // />

          <PhotoModal
            photoId={gallery.photos[selectedPhotoIndex].id}
            photoUrl={gallery.photos[selectedPhotoIndex].photoUrl}
            price={1000}
            onClose={handleCloseModal}
            onNext={handleNextPhoto}
            onPrev={handlePrevPhoto}
            isFirst={selectedPhotoIndex === 0}
            isLast={selectedPhotoIndex === gallery.photos.length - 1}
          />
        )}
      </div>
    </div>
  );
}
