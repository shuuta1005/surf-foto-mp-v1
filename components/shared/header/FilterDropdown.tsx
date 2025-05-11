// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Filter } from "lucide-react";

// const locations: string[] = ["千葉北", "千葉南", "湘南", "宮崎"];

// const FilterDropdown: React.FC = () => {
//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const filterContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         filterContainerRef.current &&
//         !filterContainerRef.current.contains(event.target as Node)
//       ) {
//         setShowFilters(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={filterContainerRef}>
//       {/* Filter Button */}
//       <Button
//         variant="outline"
//         onClick={() => setShowFilters(!showFilters)}
//         className="flex items-center  font-semibold"
//       >
//         <Filter size={18} className="mr-2" />
//         <span className="hidden sm:inline">Filter</span>
//       </Button>

//       {/* Filter Dropdown */}
//       {showFilters && (
//         <div className="absolute top-12 right-0 bg-white shadow-lg border rounded-lg p-4 w-40 z-10">
//           {locations.map((location, index) => (
//             <Button
//               key={index}
//               variant="ghost"
//               className="block w-full text-left  font-semibold"
//             >
//               {location}
//             </Button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterDropdown;
