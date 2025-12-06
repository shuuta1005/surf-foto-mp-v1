// app/admin/manage-gallery/[galleryId]/edit/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditDetailsForm from "./EditDetailsForm";

async function getGallery(galleryId: string, userId: string, userRole: string) {
  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: {
      photos: {
        select: {
          id: true,
          photoUrl: true,
        },
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

export default async function EditGalleryDetailsPage({
  params,
}: {
  params: Promise<{ galleryId: string }>; // ✅ Changed to Promise
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  // ✅ Await params
  const { galleryId } = await params;

  const gallery = await getGallery(
    galleryId, // ✅ Now use the awaited value
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
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <Link href={`/admin/manage-gallery/${gallery.id}`}>
        <Button variant="outline" className="mb-6">
          ← Back to Gallery
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Gallery Details</h1>
        <p className="text-gray-600 mt-2">
          Update location, date, and session information
        </p>
      </div>

      {/* Form */}
      <EditDetailsForm gallery={gallery} />
    </div>
  );
}
