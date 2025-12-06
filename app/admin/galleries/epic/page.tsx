// app/admin/galleries/epic/page.tsx

import { getAllApprovedGalleriesForAdmin } from "@/lib/queries/gallery";
import EpicGalleryToggle from "./EpicGalleryToggle";
import Image from "next/image";

export default async function ManageEpicGalleriesPage() {
  const galleries = await getAllApprovedGalleriesForAdmin();
  const epicCount = galleries.filter((g) => g.isEpic).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Epic Galleries 🌟</h1>
        <p className="text-gray-600">
          Select up to 6 galleries to feature on the homepage
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Currently featured:{" "}
          <span className="font-semibold">{epicCount}/6</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery) => (
          <div
            key={gallery.id}
            className={`border rounded-lg p-4 ${
              gallery.isEpic
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
              {gallery.coverPhoto ? (
                <Image
                  src={gallery.coverPhoto}
                  alt={gallery.surfSpot}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Cover Photo
                </div>
              )}
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-lg mb-1">{gallery.surfSpot}</h3>
              <p className="text-sm text-gray-600">
                {gallery.area}, {gallery.prefecture}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(gallery.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                by {gallery.photographer.name}
              </p>
            </div>

            <EpicGalleryToggle
              galleryId={gallery.id}
              initialIsEpic={gallery.isEpic}
              epicCount={epicCount}
            />
          </div>
        ))}
      </div>

      {galleries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No approved galleries found
        </div>
      )}
    </div>
  );
}
