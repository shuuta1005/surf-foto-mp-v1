// app/admin/manage-gallery/[galleryId]/DeleteGalleryButton.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Props {
  galleryId: string;
}

export default function DeleteGalleryButton({ galleryId }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/galleries/${galleryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Gallery deleted successfully");
        router.push("/admin/manage-gallery");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete gallery");
      }
    } catch (error) {
      console.error("Error deleting gallery:", error);
      alert("Failed to delete gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowConfirm(true)}
        className="w-full"
      >
        Delete Gallery
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gallery?</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This action cannot be undone. This will permanently delete:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>All photos in this gallery</li>
              <li>All pricing tiers</li>
              <li>Gallery metadata</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
              ⚠️ Make sure there are no pending orders for this gallery!
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
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
                  "Delete Gallery"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
