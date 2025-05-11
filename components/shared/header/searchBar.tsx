// // //components/shared/header/searchBar.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const Searchbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const barRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(
        `/galleries?search=${encodeURIComponent(searchValue.trim())}`
      );
      setIsOpen(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (barRef.current && !barRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Search icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-600 hover:text-black transition"
        aria-label="Open search"
      >
        <Search size={22} />
      </button>

      {/* Search overlay and bar */}
      {isOpen && (
        <>
          {/* Dimmed background */}
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />

          {/* Top search bar */}
          <div
            ref={barRef}
            className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md w-full max-w-screen overflow-hidden px-4 py-3 flex items-center gap-2"
          >
            <Search size={20} className="text-gray-400" />

            <form onSubmit={handleSearch} className="flex-1 overflow-hidden">
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search galleries..."
                className="w-full max-w-full text-sm bg-transparent focus:outline-none"
              />
            </form>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close search"
              className="text-gray-500 hover:text-black"
            >
              <X size={22} />
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Searchbar;
