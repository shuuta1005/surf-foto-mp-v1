"use client";

import Image from "next/image";
import { Gallery } from "@/app/types/gallery";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

type GalleryGridProps = {
  gallery: Gallery;
  onPhotoClick: (index: number) => void;
};

export default function GalleryGrid({
  gallery,
  onPhotoClick,
}: GalleryGridProps) {
  const { addToCart, removeFromCart, isInCart } = useCart();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {gallery.photos.map((photo, index) => {
        const isSelected = isInCart(photo.id);

        return (
          <div
            key={photo.id}
            className="relative w-full h-48 cursor-pointer group transition-transform transform hover:scale-105"
          >
            <Image
              src={photo.photoUrl}
              alt="Surf Photo"
              fill
              className="rounded-md shadow-md object-cover"
              onClick={() => onPhotoClick(index)}
            />

            {/* 🛒 Cart Icon */}
            <button
              className={`absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white ${
                isSelected ? "text-red-500" : "text-gray-700"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  removeFromCart(photo.id);
                } else {
                  addToCart({
                    photoId: photo.id,
                    photoUrl: photo.photoUrl,
                    price: 1000,
                  });
                }
              }}
            >
              <ShoppingCart size={24} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
