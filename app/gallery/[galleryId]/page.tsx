import { notFound } from "next/navigation";
import { getGalleryById } from "@/db/gallery";
import { Gallery } from "@/app/types/gallery";
import GalleryView from "./GalleryView"; // ✅ Import a separate client component

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ galleryId: string }>; // ✅ Correctly using Promise for Next.js 15
}) {
  // ✅ Await params to extract the galleryId
  const { galleryId } = await params;

  // ✅ Fetch gallery data
  const gallery: Gallery | null = await getGalleryById(galleryId);

  // ✅ Handle "Gallery Not Found"
  if (!gallery) {
    return notFound();
  }

  return <GalleryView gallery={gallery} />; // ✅ Pass data to Client Component
}
