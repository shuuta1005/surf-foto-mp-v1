// app/admin/galleries/epic/EpicGalleryToggle.tsx

"use client";

import { useState } from "react";
import { toggleEpicGallery } from "@/lib/actions/gallery";

interface Props {
  galleryId: string;
  initialIsEpic: boolean;
  epicCount: number;
}

export default function EpicGalleryToggle({
  galleryId,
  initialIsEpic,
  epicCount,
}: Props) {
  const [isEpic, setIsEpic] = useState(initialIsEpic);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isEpic && epicCount >= 6) {
      alert("Maximum 6 epic galleries allowed! Remove one first.");
      return;
    }

    setLoading(true);
    try {
      const result = await toggleEpicGallery(galleryId);
      setIsEpic(result.isEpic);
    } catch (error) {
      alert("Failed to toggle epic status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
        loading
          ? "bg-gray-300 cursor-not-allowed"
          : isEpic
          ? "bg-yellow-500 text-white hover:bg-yellow-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {loading ? "..." : isEpic ? "⭐ Epic (Remove)" : "☆ Mark as Epic"}
    </button>
  );
}
