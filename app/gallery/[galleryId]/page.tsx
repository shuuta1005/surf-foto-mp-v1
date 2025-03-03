// import { PrismaClient } from "@prisma/client";
// import Image from "next/image";

// const prisma = new PrismaClient();

// export default async function GalleryPage({
//   params,
// }: {
//   params: { galleryId: string };
// }) {
//   const gallery = await prisma.gallery.findUnique({
//     where: { id: params.galleryId },
//     include: { photos: true },
//   });

//   if (!gallery) {
//     return <div className="text-center text-red-500">Gallery not found</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-4">{gallery.name}</h1>
//       <p className="text-lg text-gray-600 mb-6">
//         {gallery.location || "Unknown location"}
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {gallery.photos.map((photo) => (
//           <div key={photo.id} className="relative h-[300px] w-full">
//             <Image
//               src={photo.photoUrl}
//               alt={photo.title || "Surf photo"}
//               layout="fill"
//               objectFit="cover"
//               className="rounded-md shadow-md"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { notFound } from "next/navigation";
import { getGalleryById } from "@/db/gallery";
import { Gallery } from "@/app/types/gallery";
import Image from "next/image";

interface GalleryPageProps {
  params: Promise<{ galleryId: string }>; // ✅ Fix: Make params a Promise
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  try {
    // ✅ Await params to extract the galleryId
    const { galleryId } = await params;

    // ✅ Fetch gallery data
    const gallery: Gallery | null = await getGalleryById(galleryId);

    if (!gallery) {
      return notFound(); // ✅ Show 404 page if gallery doesn't exist
    }

    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold">{gallery.name}</h1>
        <p className="text-gray-600">{gallery.location || "Unknown"}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {gallery.photos.map((photo) => (
            <div key={photo.id} className="relative w-full h-64">
              <Image
                src={photo.photoUrl}
                alt={"Surf Photo"}
                layout="fill"
                objectFit="cover"
                className="rounded-md shadow-md"
              />
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading gallery:", error);
    return notFound();
  }
}
