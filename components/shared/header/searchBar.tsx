// // //components/shared/header/searchBar.tsx

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Search, X } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";

// const Searchbar = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState(
//     searchParams.get("search") || ""
//   );
//   const barRef = useRef<HTMLDivElement>(null);

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (searchValue.trim()) {
//       router.push(
//         `/galleries?search=${encodeURIComponent(searchValue.trim())}`
//       );
//       setIsOpen(false);
//     }
//   };

//   const handleClickOutside = (e: MouseEvent) => {
//     if (barRef.current && !barRef.current.contains(e.target as Node)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       document.body.style.overflow = "hidden"; // optional: prevent scroll
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.body.style.overflow = ""; // reset
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   return (
//     <>
//       {/* Search icon button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="text-gray-600 hover:text-black transition"
//         aria-label="Open search"
//       >
//         <Search className="w-5 h-5 sm:w-6 sm:h-6" />
//       </button>

//       {/* Overlay with top search bar */}
//       {isOpen && (
//         <>
//           {/* Dimmed background */}
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />

//           {/* Search bar */}
//           <div
//             ref={barRef}
//             className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md px-4 py-3 flex items-center gap-2"
//           >
//             <Search className="text-gray-400" />
//             <form onSubmit={handleSearch} className="flex-1">
//               <input
//                 autoFocus
//                 type="text"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 placeholder="Search"
//                 className="w-full text-sm bg-transparent focus:outline-none"
//               />
//             </form>
//             <button
//               onClick={() => setIsOpen(false)}
//               aria-label="Close search"
//               className="text-gray-500 hover:text-black"
//             >
//               <X size={22} />
//             </button>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Searchbar;

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
      document.body.style.overflow = "hidden"; // prevent scroll
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

      {/* Search overlay + top bar */}
      {isOpen && (
        <>
          {/* Dimmed background */}
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />

          {/* Top search bar */}
          <div
            ref={barRef}
            className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md px-4 py-3 flex items-center gap-2 max-w-screen w-full overflow-hidden"
          >
            <Search size={20} className="text-gray-400" />
            <form onSubmit={handleSearch} className="flex-1">
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search galleries..."
                className="w-full text-sm bg-transparent focus:outline-none"
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
