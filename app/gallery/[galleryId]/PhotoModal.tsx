"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotoModal({
  photoUrl,
  onClose,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: {
  photoUrl: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
      <div className="relative w-full max-w-3xl h-[80vh] flex items-center">
        {/* Left Arrow */}
        <button
          className="absolute left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
          onClick={onPrev}
          disabled={isFirst}
        >
          <ChevronLeft size={32} />
        </button>

        {/* Image */}
        <Image
          src={photoUrl}
          alt="Selected Photo"
          layout="fill"
          objectFit="contain"
          className="rounded-md"
        />

        {/* Right Arrow */}
        <button
          className="absolute right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
          onClick={onNext}
          disabled={isLast}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
}
