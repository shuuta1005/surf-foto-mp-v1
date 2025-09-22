//components/shared/filters/AreaFilterBar.tsx

"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

type AreaFilterBarProps = {
  areas: string[];
};

const AreaFilterBar = ({ areas }: AreaFilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeArea, setActiveArea] = useState<string>("");
  const [loadingArea, setLoadingArea] = useState<string | null>(null);

  useEffect(() => {
    const areaParam = searchParams?.get("area") || "";
    setActiveArea(areaParam);
    setLoadingArea(null); // reset loading after navigation
  }, [searchParams]);

  const handleClick = (area: string) => {
    setLoadingArea(area); // start loading effect

    const newParams = new URLSearchParams(searchParams?.toString());

    if (area === "") {
      newParams.delete("area");
    } else {
      newParams.set("area", area);
    }

    newParams.delete("search"); // clear search param when a filter is clicked

    router.push(`/galleries?${newParams.toString()}`);
  };

  // "All Areas" first, then the rest
  const allAreas = ["", ...areas];

  return (
    <div className="w-full bg-white overflow-x-auto border-b shadow-sm">
      <div className="flex gap-2 px-4 py-3 overflow-x-auto whitespace-nowrap">
        {allAreas.map((area) => {
          const isActive = activeArea === area;
          const isLoading = loadingArea === area;
          const label = area === "" ? "All Areas" : area;

          return (
            <button
              key={label}
              onClick={() => handleClick(area)}
              className={clsx(
                "px-4 py-1.5 rounded-full border text-sm transition-all",
                isLoading
                  ? "bg-gray-200 text-gray-600 border-gray-200 font-semibold" // loading style
                  : isActive
                  ? "bg-black text-white border-black font-semibold"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 font-semibold"
              )}
            >
              {isLoading ? "Loading..🤟" : label}{" "}
              {/* ✅ change text when loading */}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AreaFilterBar;
