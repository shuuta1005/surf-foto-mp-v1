// app/admin/manage-gallery/[galleryId]/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteGalleryButton from "./DeleteGalleryButton";

async function getGallery(galleryId: string, userId: string, userRole: string) {
  const gallery = await prisma.gallery.findUnique({
    where: { id: galleryId },
    include: {
      photographer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      photos: true,
      pricingTiers: true,
    },
  });

  if (!gallery) return null;

  // Check permissions: must be owner or admin
  if (userRole !== "ADMIN" && gallery.photographerId !== userId) {
    return null;
  }

  return gallery;
}

export default async function GalleryManagementHub({
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
        <p className="text-gray-600 mt-2">
          You don't have permission to manage this gallery.
        </p>
        <Link href="/admin/manage-gallery">
          <Button className="mt-4">Back to Galleries</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <Link href="/admin/manage-gallery">
        <Button variant="outline" className="mb-6">
          ← Back to Galleries
        </Button>
      </Link>

      {/* Gallery Header */}
      <div className="mb-8 flex items-start gap-6">
        {/* Cover Photo */}
        <div className="relative w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {gallery.coverPhoto && (
            <Image
              src={gallery.coverPhoto}
              alt={gallery.surfSpot}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Gallery Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{gallery.surfSpot}</h1>
          <p className="text-gray-600 text-lg">
            {gallery.area}, {gallery.prefecture}
          </p>
          <p className="text-gray-500 mt-1">
            {new Date(gallery.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {gallery.sessionTime && ` • ${gallery.sessionTime}`}
          </p>

          {/* Status */}
          <div className="mt-4">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                gallery.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : gallery.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {gallery.status === "APPROVED"
                ? "✅ APPROVED"
                : gallery.status === "PENDING"
                ? "⏳ PENDING REVIEW"
                : "❌ REJECTED"}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 mt-4 text-sm text-gray-600">
            <span>📸 {gallery.photos.length} photos</span>
            <span>💴 ¥{gallery.price} per photo</span>
            <span>📦 {gallery.pricingTiers.length} pricing tiers</span>
          </div>
        </div>
      </div>

      {/* Management Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Details Card */}
        <Link href={`/admin/manage-gallery/${gallery.id}/edit`}>
          <Card className="hover:shadow-lg transition cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-lg mb-2">Edit Details</h3>
              <p className="text-sm text-gray-600">
                Update location, surf spot, date, and session time
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Manage Photos Card */}
        <Link href={`/admin/manage-gallery/${gallery.id}/photos`}>
          <Card className="hover:shadow-lg transition cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">🖼️</div>
              <h3 className="font-bold text-lg mb-2">Manage Photos</h3>
              <p className="text-sm text-gray-600">
                Add or remove photos from this gallery
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Edit Pricing Card */}
        <Link href={`/admin/manage-gallery/${gallery.id}/pricing`}>
          <Card className="hover:shadow-lg transition cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-lg mb-2">Edit Pricing</h3>
              <p className="text-sm text-gray-600">
                Update base price and manage pricing tiers
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Delete Gallery Card */}
        <Card className="border-red-200 bg-red-50 h-full">
          <CardContent className="p-6">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-lg mb-2 text-red-600">
              Delete Gallery
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Permanently remove this gallery and all its photos
            </p>
            <DeleteGalleryButton galleryId={gallery.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
