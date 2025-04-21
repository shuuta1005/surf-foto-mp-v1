import Link from "next/link";
import { getAllGalleries } from "@/db/gallery";
import Image from "next/image";

export default async function GalleriesPage() {
  const galleries = await getAllGalleries();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-5xl sm:text-5xl font-extrabold text-gray-700 tracking-tight mb-12 text-center">
        All Galleries 🤙🏽
      </h1>

      {galleries.length === 0 ? (
        <p>No galleries uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleries.map((gallery) => {
            const cover =
              gallery.photos.find((p) => p.isCover) ?? gallery.photos[0];

            return (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.id}`}
                className="block border rounded shadow hover:shadow-lg transition"
              >
                {cover && (
                  <div className="relative w-full h-48">
                    <Image
                      src={cover.photoUrl}
                      alt="Gallery cover"
                      fill
                      className="object-cover rounded-t"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold">{gallery.surfSpot}</h2>
                  <p className="text-sm text-gray-600">
                    {gallery.prefecture} - {gallery.area}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(gallery.date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
