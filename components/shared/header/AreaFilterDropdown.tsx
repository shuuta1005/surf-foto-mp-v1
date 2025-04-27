"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface AreaFilterDropdownProps {
  areas: string[];
}

export default function AreaFilterDropdown({ areas }: AreaFilterDropdownProps) {
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = e.target.value;
    setSelectedArea(area);
    if (area) {
      router.push(`/galleries?area=${encodeURIComponent(area)}`);
    }
  };

  return (
    <select
      value={selectedArea}
      onChange={handleChange}
      className="border border-gray-300 rounded-md p-1 text-gray-700 text-sm"
    >
      <option value="">Filter by Area</option>
      {areas.map((area) => (
        <option key={area} value={area}>
          {area}
        </option>
      ))}
    </select>
  );
}
