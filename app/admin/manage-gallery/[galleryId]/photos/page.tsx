// app/admin/manage-gallery/[galleryId]/photos/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PhotoGrid from "./PhotoGrid";

async function getGalleryWithPhotos(
  galleryId: string,
  userId: string,
  userRole: string
) {
  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: {
      photos: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!gallery) return null;

  // Check permissions
  if (userRole !== "ADMIN" && gallery.photographerId !== userId) {
    return null;
  }

  return gallery;
}

export default async function ManagePhotosPage({
  params,
}: {
  params: Promise<{ galleryId: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { galleryId } = await params;

  const gallery = await getGalleryWithPhotos(
    galleryId,
    session.user.id!,
    session.user.role!
  );

  if (!gallery) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800">Gallery not found</h1>
        <Link href="/admin/manage-gallery">
          <Button className="mt-4">Back to Galleries</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <Link href={`/admin/manage-gallery/${gallery.id}`}>
        <Button variant="outline" className="mb-6">
          ← Back to Gallery
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Photos</h1>
        <p className="text-gray-600 mt-2">
          {gallery.surfSpot} • {gallery.photos.length} photos
        </p>
      </div>

      {/* Photo Grid Component */}
      <PhotoGrid
        galleryId={gallery.id}
        photos={gallery.photos}
        currentCoverPhoto={gallery.coverPhoto}
      />
    </div>
  );
}
