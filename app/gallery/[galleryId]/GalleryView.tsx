// gallery/[galleryId]/GalleryView.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import GalleryHeader from "./GalleryHeader";
import GalleryGrid from "./GalleryGrid";
import PhotoModal from "./PhotoModal";
import PricingDisplay from "@/app/admin/upload/components/PricingDisplay";
import { GalleryViewProps } from "@/types/gallery";

export default function GalleryView({ gallery }: GalleryViewProps) {
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
      <GalleryHeader name={gallery.surfSpot} location={gallery.area} />

      {/* ✅ Cover Image with Metadata Overlay */}
      {gallery.coverPhoto && (
        <div className="relative w-full bg-white">
          <div className="relative aspect-[16/9] sm:aspect-[3/1] md:aspect-[21/9]">
            <Image
              src={gallery.coverPhoto}
              alt="Gallery Cover"
              fill
              className="object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {gallery.surfSpot}
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-bold">
                {gallery.prefecture} - {gallery.area}
              </p>
              <p className="text-xs sm:text-sm md:text-lg font-semibold">
                {new Date(gallery.date).toLocaleDateString()}
              </p>
              {gallery.sessionTime && (
                <p className="text-sm sm:text-lg italic font-semibold mt-1">
                  Session: {gallery.sessionTime}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 💰 Pricing Information */}
      <PricingDisplay
        basePrice={gallery.price}
        pricingTiers={gallery.pricingTiers}
      />

      {/* ✅ Gallery Grid */}
      <div className="max-w-7xl mx-auto">
        <GalleryGrid gallery={gallery} onPhotoClick={handlePhotoClick} />

        {/* ✅ Photo Modal */}
        {selectedPhotoIndex !== null && (
          <PhotoModal
            photoId={gallery.photos[selectedPhotoIndex].id}
            photoUrl={gallery.photos[selectedPhotoIndex].photoUrl}
            galleryId={gallery.id}
            galleryName={gallery.surfSpot}
            galleryBasePrice={gallery.price}
            galleryTiers={gallery.pricingTiers.map((t) => ({
              id: t.id,
              quantity: t.quantity,
              price: t.price,
            }))}
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
