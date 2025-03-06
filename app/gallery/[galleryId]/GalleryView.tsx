"use client";

import { useState } from "react";
import { Gallery } from "@/app/types/gallery";
import Image from "next/image";
import GalleryHeader from "./GalleryHeader";
import GalleryGrid from "./GalleryGrid";
import PhotoModal from "./PhotoModal";

export default function GalleryView({ gallery }: { gallery: Gallery }) {
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
        {/* ✅ Cover Image
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
        )} */}

        {/* ✅ Gallery Grid */}
        <GalleryGrid gallery={gallery} onPhotoClick={handlePhotoClick} />

        {/* ✅ Photo Modal */}
        {selectedPhotoIndex !== null && (
          <PhotoModal
            photoUrl={gallery.photos[selectedPhotoIndex].photoUrl}
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
