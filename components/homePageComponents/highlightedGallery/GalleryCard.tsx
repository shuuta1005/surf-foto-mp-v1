//components/highlightedGallery/GalleryCard.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { GalleryCardProps } from "@/types/gallery";
import spiralGif from "@/assets/spiral.gif";

const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  image,
  title,
  location,
  sessionTime,
  date,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/gallery/${id}`} className="block">
      <Card className="overflow-hidden group cursor-pointer">
        <CardContent className="relative p-0 h-[160px] sm:h-[220px] md:h-[300px] w-full">
          {/* Wrapper so we can overlay the loader */}
          <div className="relative h-full w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <Image
                  src={spiralGif} // 👈 replace with your gif path
                  alt="Loading..."
                  width={60}
                  height={60}
                />
              </div>
            )}

            <Image
              src={image}
              alt="Gallery Cover Surf Photo"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className={`brightness-75 group-hover:scale-105 transition-transform duration-300 object-cover ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoadingComplete={() => setIsLoading(false)} // ✅ hide gif once loaded
            />
          </div>

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
              {title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base font-semibold">
              {location}
            </p>

            {sessionTime && (
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold italic">
                {sessionTime}
              </p>
            )}

            {date && (
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold mt-1">
                {new Date(date).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GalleryCard;
