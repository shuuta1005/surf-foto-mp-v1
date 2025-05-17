// app/purchases/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";

export default async function PurchasesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return redirect("/sign-in"); // Or wherever your login page is
  }

  const userId = session.user.id;

  const purchases = await prisma.purchase.findMany({
    where: { userId },
    include: {
      photo: {
        include: {
          gallery: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        My Purchased Photos 📸
      </h1>

      {purchases.length === 0 ? (
        <p className="text-center text-gray-500">No purchases yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="border rounded shadow hover:shadow-md transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={purchase.photo.photoUrl}
                  alt="Watermarked photo"
                  fill
                  className="object-cover rounded-t"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  {purchase.photo.gallery.surfSpot} ・{" "}
                  {new Date(purchase.createdAt).toLocaleDateString()}
                </p>
                <a
                  href={`/api/download-photo/${purchase.photo.id}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
