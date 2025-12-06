// app/admin/manage-gallery/page.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

async function getPhotographerGalleries(userId: string, userRole: string) {
  // Admins can see all galleries, photographers only see their own
  const where = userRole === "ADMIN" ? {} : { photographerId: userId };

  return await prisma.gallery.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      photographer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      photos: {
        select: {
          id: true,
        },
      },
      pricingTiers: true,
    },
  });
}

export default async function ManageGalleryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const galleries = await getPhotographerGalleries(
    session.user.id!,
    session.user.role!
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Galleries</h1>
        <p className="text-gray-600 mt-2">
          {galleries.length} {galleries.length === 1 ? "gallery" : "galleries"}
        </p>
      </div>

      {galleries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 text-lg">
              No galleries yet. Upload your first one! 📸
            </p>
            <Link
              href="/admin/upload"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Upload Gallery
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Link key={gallery.id} href={`/admin/manage-gallery/${gallery.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
                {/* Cover Photo */}
                <div className="relative h-48 bg-gray-200">
                  {gallery.coverPhoto && (
                    <Image
                      src={gallery.coverPhoto}
                      alt={gallery.surfSpot}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Gallery Info */}
                  <div>
                    <h3 className="font-bold text-lg">{gallery.surfSpot}</h3>
                    <p className="text-sm text-gray-600">
                      {gallery.prefecture} - {gallery.area}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(gallery.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
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
                        ? "⏳ PENDING"
                        : "❌ REJECTED"}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm text-gray-600 border-t pt-3">
                    <span>📸 {gallery.photos.length} photos</span>
                    <span>💴 ¥{gallery.price}</span>
                  </div>

                  {/* Show photographer name for admins */}
                  {session.user.role === "ADMIN" && (
                    <p className="text-xs text-gray-500 border-t pt-2">
                      by {gallery.photographer.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
