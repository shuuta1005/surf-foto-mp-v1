"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
//import Image from "next/image";

// Define the Destination type
type Destination = {
  id: number;
  image: string;
  title: string;
  country: string;
  spots: number;
};

const DestinationsGrid = () => {
  const destinations: Destination[] = [
    {
      id: 1,
      image: "/destinations/south-chiba.jpg",
      title: "South Chiba",
      country: "千葉",
      spots: 3,
    },
    {
      id: 2,
      image: "/destinations/ibaraki-1.jpg",
      title: "Kashima",
      country: "茨城",
      spots: 2,
    },
    {
      id: 3,
      image: "/destinations/shikoku.jpg",
      title: "Kochi",
      country: "四国",
      spots: 6,
    },
    {
      id: 4,
      image: "/destinations/shonan-1.jpg",
      title: "Kugenuma",
      country: "湘南",
      spots: 5,
    },
    {
      id: 5,
      image: "/destinations/okinawa.jpg",
      title: "Amami",
      country: "沖縄",
      spots: 5,
    },
    {
      id: 6,
      image: "/destinations/north-chiba.jpg",
      title: "North Chiba",
      country: "千葉",
      spots: 5,
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const destinationsPerPage = 12;
  const totalPages = Math.ceil(destinations.length / destinationsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentDestinations = () => {
    const start = currentPage * destinationsPerPage;
    return destinations.slice(start, start + destinationsPerPage);
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">All Destinations</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </p>
            <button
              onClick={prevPage}
              className="p-2 rounded-full hover:bg-gray-100 border"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPage}
              className="p-2 rounded-full hover:bg-gray-100 border"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getCurrentDestinations().map((destination) => (
            <div
              key={destination.id}
              className="flex items-center p-2 bg-white rounded-lg hover:bg-gray-100 cursor-pointer border border-stone-100"
            >
              <div className="w-24 h-24 flex-shrink-0 relative">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold text-lg">{destination.title}</h3>
                <p className="text-gray-600 text-sm">{destination.country}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {destination.spots} Spots
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationsGrid;
