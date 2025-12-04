// app/admin/galleries/pending/page.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Eye, Loader2 } from "lucide-react";

type Gallery = {
  id: string;
  surfSpot: string;
  prefecture: string;
  area: string;
  date: string;
  sessionTime: string | null;
  coverPhoto: string | null;
  price: number;
  createdAt: string;
  photographer: {
    id: string;
    name: string;
    email: string;
  };
  photos: Array<{
    id: string;
    photoUrl: string;
  }>;
  pricingTiers: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
};

export default function PendingGalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Preview modal state
  const [previewGallery, setPreviewGallery] = useState<Gallery | null>(null);

  // Rejection modal state
  const [rejectGallery, setRejectGallery] = useState<Gallery | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch pending galleries
  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/galleries/pending");
      const data = await res.json();
      setGalleries(data.galleries || []);
    } catch (error) {
      console.error("Failed to fetch galleries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (galleryId: string) => {
    if (!confirm("Are you sure you want to approve this gallery?")) return;

    try {
      setActionLoading(galleryId);
      const res = await fetch(`/api/admin/galleries/${galleryId}/approve`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Gallery approved! Email sent to photographer.");
        // Remove from list
        setGalleries((prev) => prev.filter((g) => g.id !== galleryId));
      } else {
        alert("Failed to approve gallery");
      }
    } catch (error) {
      console.error("Error approving gallery:", error);
      alert("Failed to approve gallery");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectGallery) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setActionLoading(rejectGallery.id);
      const res = await fetch(
        `/api/admin/galleries/${rejectGallery.id}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      if (res.ok) {
        alert("Gallery rejected! Email sent to photographer.");
        // Remove from list
        setGalleries((prev) => prev.filter((g) => g.id !== rejectGallery.id));
        setRejectGallery(null);
        setRejectionReason("");
      } else {
        alert("Failed to reject gallery");
      }
    } catch (error) {
      console.error("Error rejecting gallery:", error);
      alert("Failed to reject gallery");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pending Galleries</h1>
        <p className="text-gray-600 mt-2">
          {galleries.length} {galleries.length === 1 ? "gallery" : "galleries"}{" "}
          awaiting review
        </p>
      </div>

      {galleries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 text-lg">No pending galleries! 🎉</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Card key={gallery.id} className="overflow-hidden">
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

                {/* Photographer Info */}
                <div className="border-t pt-3">
                  <p className="text-sm font-semibold">Photographer</p>
                  <p className="text-sm text-gray-700">
                    {gallery.photographer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {gallery.photographer.email}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>📸 {gallery.photos.length} photos</span>
                  <span>💴 ¥{gallery.price}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setPreviewGallery(gallery)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(gallery.id)}
                    disabled={actionLoading === gallery.id}
                  >
                    {actionLoading === gallery.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-1" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setRejectGallery(gallery)}
                    disabled={actionLoading === gallery.id}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog
        open={!!previewGallery}
        onOpenChange={() => setPreviewGallery(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewGallery?.surfSpot} - {previewGallery?.prefecture}
            </DialogTitle>
          </DialogHeader>

          {previewGallery && (
            <div className="space-y-4">
              {/* Gallery Details */}
              <div className="bg-gray-50 p-4 rounded space-y-2">
                <p>
                  <strong>Location:</strong> {previewGallery.area},{" "}
                  {previewGallery.prefecture}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(previewGallery.date).toLocaleDateString()}
                </p>
                {previewGallery.sessionTime && (
                  <p>
                    <strong>Session:</strong> {previewGallery.sessionTime}
                  </p>
                )}
                <p>
                  <strong>Base Price:</strong> ¥{previewGallery.price}
                </p>
                <p>
                  <strong>Photos:</strong> {previewGallery.photos.length}
                </p>
                <p>
                  <strong>Photographer:</strong>{" "}
                  {previewGallery.photographer.name} (
                  {previewGallery.photographer.email})
                </p>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-3 gap-2">
                {previewGallery.photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square">
                    <Image
                      src={photo.photoUrl}
                      alt="Gallery photo"
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleApprove(previewGallery.id);
                    setPreviewGallery(null);
                  }}
                  disabled={actionLoading === previewGallery.id}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve Gallery
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setRejectGallery(previewGallery);
                    setPreviewGallery(null);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog
        open={!!rejectGallery}
        onOpenChange={() => setRejectGallery(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Gallery</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Gallery: <strong>{rejectGallery?.surfSpot}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Photographer: <strong>{rejectGallery?.photographer.name}</strong>
            </p>

            <div>
              <label className="block text-sm font-medium mb-2">
                Rejection Reason *
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this gallery cannot be approved..."
                rows={4}
                className="w-full"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
              ℹ️ The photographer will receive an email with this reason.
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setRejectGallery(null);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
                disabled={
                  !rejectionReason.trim() || actionLoading === rejectGallery?.id
                }
              >
                {actionLoading === rejectGallery?.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                Reject Gallery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
