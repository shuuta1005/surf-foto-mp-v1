"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const HighlightedPhotos: React.FC = () => {
  const originalPhotos: string[] = [
    "/takeoff1.jpg",
    "/takeoff2.jpg",
    "/float1.jpg",
  ];

  // Add the first image at the end to create smooth infinite scrolling
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
        }, 500); // Delay reset to avoid flash
      } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, highlightedPhotos.length]);

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
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
              layout="fill"
              objectFit="cover"
              className="brightness-75"
              priority={index === 0} // Optimize first image load
            />
          </div>
        ))}
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-20">
        <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight">
          Find Yourself
        </h2>
        <p className="text-white text-lg md:text-xl font-medium mt-2">
          Capture the Ride. Share the Stoke.
        </p>
      </div>
    </div>
  );
};

export default HighlightedPhotos;
