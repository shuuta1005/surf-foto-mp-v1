//app/gallery/[galleryId]/page.tsx

import { notFound } from "next/navigation";
import { getGalleryById } from "@/lib/queries/gallery";
import { Gallery } from "@/types/gallery";
import GalleryView from "./GalleryView"; // ✅ Import a separate client component

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ galleryId: string }>; // ✅ Correctly using Promise for Next.js 15
}) {
  // ✅ Await params to extract the galleryId
  //We extract the gallery ID from the params
  const { galleryId } = await params;

  // ✅ Fetch gallery data
  //typing it as `Gallery | null` so that you can safely handle the case where the gallery is not found.
  const gallery: Gallery | null = await getGalleryById(galleryId);

  // ✅ Handle "Gallery Not Found"
  if (!gallery) {
    return notFound();
  }

  return <GalleryView gallery={gallery} />; // ✅ Pass data to Client Component
}
