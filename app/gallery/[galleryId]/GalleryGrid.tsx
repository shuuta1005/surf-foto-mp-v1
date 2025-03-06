"use client";
import Image from "next/image";
import { Gallery } from "@/app/types/gallery";

export default function GalleryGrid({
  gallery,
  onPhotoClick,
}: {
  gallery: Gallery;
  onPhotoClick: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {gallery.photos.map((photo, index) => (
        <div
          key={photo.id}
          className="relative w-full h-48 cursor-pointer transition-transform transform hover:scale-105"
          onClick={() => onPhotoClick(index)}
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
  );
}
