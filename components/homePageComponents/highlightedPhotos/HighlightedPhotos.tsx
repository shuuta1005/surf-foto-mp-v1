//Highlighted Photos
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HighlightedPhotos: React.FC = () => {
  const originalPhotos: string[] = [
    "/takeoff1.jpg",
    "/higlighted-photo-3.jpg",
    "/fake-gallery-1/photo-1.jpg",
  ];

  const highlightedPhotos: string[] = [...originalPhotos, originalPhotos[0]];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      if (currentIndex === highlightedPhotos.length - 1) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(0);
        }, 500);
      } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, highlightedPhotos.length]);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
      <div
        className="flex h-full w-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? "transform 500ms ease-in-out" : "none",
        }}
      >
        {highlightedPhotos.map((photo, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <Image
              src={photo}
              alt={`Slide ${index + 1}`}
              fill
              className="brightness-75 object-cover"
              priority={index === 0 || photo === "/takeoff1.jpg"}
            />
          </div>
        ))}
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-20">
        <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Find Yourself
        </h2>
        <p className="text-white text-base sm:text-lg md:text-xl font-medium mt-2">
          Capture the Ride. Share the Stoke.
        </p>

        <Link href="/galleries" passHref>
          <Button
            className="mt-6 px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg font-bold bg-white text-black border border-black
             hover:bg-black hover:text-white transition-colors duration-300"
          >
            View All Galleries
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HighlightedPhotos;
