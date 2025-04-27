// //components/shared/header/searchBar.tsx

// import React, { useState } from "react";
// import { Search, X } from "lucide-react";

// const Searchbar = () => {
//   const [searchValue, setSearchValue] = useState("");

//   const handleClearSearch = () => {
//     setSearchValue("");
//   };

//   return (
//     <div className="relative flex-1 max-w-md mx-4">
//       <div className="relative flex items-center">
//         <Search className="absolute left-3 text-gray-400 z-10" size={18} />
//         <input
//           type="text"
//           placeholder="Search galleries..."
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:bg-white focus:shadow-md transition-all duration-200"
//           style={{
//             outline: "none",
//             WebkitAppearance: "none",
//             WebkitTapHighlightColor: "transparent",
//           }}
//         />
//         {searchValue && (
//           <button
//             onClick={handleClearSearch}
//             className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
//             aria-label="Clear search"
//           >
//             <X size={16} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Searchbar;

"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Searchbar = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/galleries?query=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-4">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-400 z-10" size={18} />
        <input
          type="text"
          placeholder="Search galleries..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm focus:bg-white focus:shadow-md transition-all duration-200"
          style={{
            outline: "none",
            WebkitAppearance: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
};

export default Searchbar;
