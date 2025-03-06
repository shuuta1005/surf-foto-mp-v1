// "use client";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight, X } from "lucide-react";
// import { useEffect } from "react";

// export default function PhotoModal({
//   photoUrl,
//   onClose,
//   onNext,
//   onPrev,
//   isFirst,
//   isLast,
// }: {
//   photoUrl: string;
//   onClose: () => void;
//   onNext: () => void;
//   onPrev: () => void;
//   isFirst: boolean;
//   isLast: boolean;
// }) {
//   // ✅ Handle keyboard navigation (Esc to close, Arrows for navigation)
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowLeft" && !isFirst) onPrev();
//       if (e.key === "ArrowRight" && !isLast) onNext();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [onClose, onNext, onPrev, isFirst, isLast]);

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
//       onClick={onClose} // ✅ Close when clicking outside
//     >
//       <div
//         className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center"
//         onClick={(e) => e.stopPropagation()} // ✅ Prevent click from closing modal when clicking arrows or image
//       >
//         {/* ⬅️ Left Arrow (Back) - ✅ Fix: Ensure higher z-index */}
//         {!isFirst && (
//           <button
//             className="absolute left-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-200 text-black z-50" // ✅ Ensuring higher z-index
//             onClick={onPrev}
//           >
//             <ChevronLeft size={40} />
//           </button>
//         )}

//         {/* 🖼️ Image */}
//         <div className="relative w-full h-full flex justify-center z-10">
//           <Image
//             src={photoUrl}
//             alt="Selected Photo"
//             layout="intrinsic"
//             width={900} // ✅ Ensure proper width
//             height={700} // ✅ Ensure proper height
//             objectFit="contain"
//             className="rounded-md"
//           />
//         </div>

//         {/* ➡️ Right Arrow - ✅ Fix: Ensure higher z-index */}
//         {!isLast && (
//           <button
//             className="absolute right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-200 text-black z-50" // ✅ Ensuring higher z-index
//             onClick={onNext}
//           >
//             <ChevronRight size={40} />
//           </button>
//         )}
//       </div>

//       {/* ❌ Close Button - ✅ Fix: Ensure it's clickable */}
//       <button
//         className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-200 text-black z-50"
//         onClick={onClose}
//       >
//         <X size={32} />
//       </button>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function PhotoModal({
  photoUrl,
  onClose,
  onNext,
  onPrev,
  isFirst,
  isLast,
  caption,
}: {
  photoUrl: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  caption?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Handle keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && !isFirst) onPrev();
      if (e.key === "ArrowRight" && !isLast) onNext();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
    };

    document.body.style.overflow = "hidden"; // Prevent background scrolling
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto"; // Restore scrolling on unmount
    };
  }, [onClose, onNext, onPrev, isFirst, isLast]);

  const handleZoomIn = () => {
    if (zoomLevel < 2) setZoomLevel((prev) => prev + 0.25);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel((prev) => prev - 0.25);
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Main image container */}
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

        {/* Caption (if provided) */}
        {caption && (
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <p className="bg-black/60 text-white py-2 px-4 mx-auto inline-block rounded-full text-sm backdrop-blur-sm">
              {caption}
            </p>
          </div>
        )}

        {/* Navigation controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          {/* Image counter */}
          <div className="bg-black/60 text-white py-1 px-3 rounded-full text-sm backdrop-blur-sm">
            {isFirst ? "1" : "•"} / {isLast ? "•" : "•"}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              className="p-2 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut size={20} />
            </button>
            <button
              className="p-2 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
            >
              <ZoomIn size={20} />
            </button>
            <button
              className="p-2 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
              onClick={() => window.open(photoUrl, "_blank")}
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Navigation arrows */}
        {!isFirst && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
            onClick={onPrev}
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {!isLast && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/80 text-white transition-colors"
            onClick={onNext}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
