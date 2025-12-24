// app/admin/manage-gallery/[galleryId]/photos/PhotoGrid.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Star } from "lucide-react";
import { Photo } from "@/types/gallery";

interface Props {
  galleryId: string;
  photos: Photo[];
  currentCoverPhoto: string | null;
}

export default function PhotoGrid({
  galleryId,
  photos,
  currentCoverPhoto,
}: Props) {
  const router = useRouter();
  const [deletePhoto, setDeletePhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(false);

  // Delete photo
  const handleDelete = async () => {
    if (!deletePhoto) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/photos/${deletePhoto.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Photo deleted successfully! ✅");
        setDeletePhoto(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo");
    } finally {
      setLoading(false);
    }
  };

  // Set as cover photo
  const handleSetCover = async (photoUrl: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/galleries/${galleryId}/set-cover`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverPhoto: photoUrl }),
      });

      if (res.ok) {
        alert("Cover photo updated! ✅");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update cover photo");
      }
    } catch (error) {
      console.error("Error updating cover:", error);
      alert("Failed to update cover photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Photo Grid */}
      {photos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No photos in this gallery</p>
            <p className="text-sm text-gray-400 mt-2">
              To add photos, create a new gallery
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => {
            const isCover = photo.photoUrl === currentCoverPhoto;

            return (
              <div
                key={photo.id}
                className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                  isCover
                    ? "border-yellow-500 ring-2 ring-yellow-200"
                    : "border-gray-200"
                }`}
              >
                {/* Photo */}
                <Image
                  src={photo.photoUrl}
                  alt="Gallery photo"
                  fill
                  className="object-cover"
                />

                {/* Cover Badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    ⭐ Cover
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {/* Set as Cover */}
                  {!isCover && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetCover(photo.photoUrl)}
                      disabled={loading}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Delete */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeletePhoto(photo)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePhoto} onOpenChange={() => setDeletePhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo?</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this photo? This action cannot be
              undone.
            </p>

            {deletePhoto && (
              <div className="relative w-full h-48 bg-gray-100 rounded">
                <Image
                  src={deletePhoto.photoUrl}
                  alt="Photo to delete"
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeletePhoto(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete Photo"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
