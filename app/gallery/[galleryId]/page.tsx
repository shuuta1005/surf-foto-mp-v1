import { PrismaClient } from "@prisma/client";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function GalleryPage({
  params,
}: {
  params: { galleryId: string };
}) {
  const gallery = await prisma.gallery.findUnique({
    where: { id: params.galleryId },
    include: { photos: true },
  });

  if (!gallery) {
    return <div className="text-center text-red-500">Gallery not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{gallery.name}</h1>
      <p className="text-lg text-gray-600 mb-6">
        {gallery.location || "Unknown location"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.photos.map((photo) => (
          <div key={photo.id} className="relative h-[300px] w-full">
            <Image
              src={photo.photoUrl}
              alt={photo.title || "Surf photo"}
              layout="fill"
              objectFit="cover"
              className="rounded-md shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
