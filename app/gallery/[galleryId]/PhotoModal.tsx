"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useCart } from "@/features/cart/CartContext";
import { ShoppingCart } from "lucide-react";

export default function PhotoModal({
  photoId,
  photoUrl,
  price,
  onClose,
  onNext,
  onPrev,
  isFirst,
  isLast,
  caption,
}: {
  photoId: string;
  photoUrl: string;
  price: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  caption?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const isSelected = isInCart(photoId);

  const handleZoomIn = useCallback(() => {
    if (zoomLevel < 2) setZoomLevel((prev) => prev + 0.25);
  }, [zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (zoomLevel > 0.5) setZoomLevel((prev) => prev - 0.25);
  }, [zoomLevel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && !isFirst) onPrev();
      if (e.key === "ArrowRight" && !isLast) onNext();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose, onNext, onPrev, isFirst, isLast, handleZoomIn, handleZoomOut]);

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] px-4 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Image */}
        <div className="relative w-full h-full flex justify-center overflow-hidden">
          <div
            className="transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image
              src={photoUrl}
              alt={caption || "Photo"}
              width={1200}
              height={900}
              className={`rounded-lg shadow-2xl transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              style={{ objectFit: "contain" }}
              onLoadingComplete={() => setIsLoading(false)}
              priority
            />
          </div>
        </div>

        {/* Caption */}
        {caption && (
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <p className="bg-black/60 text-white py-2 px-4 mx-auto inline-block rounded-full text-sm backdrop-blur-sm">
              {caption}
            </p>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              className="p-2 sm:p-3 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              className="p-2 sm:p-3 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
            >
              <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {!isFirst && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
            onClick={onPrev}
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
        {!isLast && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
            onClick={onNext}
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 sm:p-3 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Add to Cart */}
        <button
          className={`absolute top-4 left-4 p-2 sm:p-3 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white z-50 ${
            isSelected ? "text-red-500" : "text-gray-700"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (isSelected) {
              removeFromCart(photoId);
            } else {
              addToCart({ photoId, photoUrl, price });
            }
          }}
        >
          <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>
    </div>
  );
}
