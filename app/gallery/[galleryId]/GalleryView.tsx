"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gallery } from "@/app/types/gallery";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GalleryView({ gallery }: { gallery: Gallery }) {
  const router = useRouter();
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
    <div className="max-w-7xl mx-auto">
      {/* ✅ Gallery Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
        <h1 className="text-xl font-bold text-center">
          {gallery.name} - {gallery.location || "Unknown"}
        </h1>
        <Button variant="outline">Checkout</Button>
      </div>

      {/* ✅ Cover Image (First Photo in Gallery) */}
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

      {/* ✅ Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {gallery.photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative w-full h-48 cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => handlePhotoClick(index)}
          >
            <Image
              src={photo.photoUrl}
              alt={"Surf Photo"}
              layout="fill"
              objectFit="cover"
              className="rounded-md shadow-md"
            />
          </div>
        ))}
      </div>

      {/* ✅ Photo Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <div className="relative w-full max-w-3xl h-[80vh] flex items-center">
            {/* Left Arrow */}
            <button
              className="absolute left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
              onClick={handlePrevPhoto}
              disabled={selectedPhotoIndex === 0}
            >
              <ChevronLeft size={32} />
            </button>

            {/* Image */}
            <Image
              src={gallery.photos[selectedPhotoIndex].photoUrl}
              alt="Selected Photo"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />

            {/* Right Arrow */}
            <button
              className="absolute right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
              onClick={handleNextPhoto}
              disabled={selectedPhotoIndex === gallery.photos.length - 1}
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
            onClick={handleCloseModal}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
