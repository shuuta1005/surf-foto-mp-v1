// app/admin/manage-gallery/[galleryId]/edit/EditDetailsForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type Gallery = {
  id: string;
  prefecture: string;
  area: string;
  surfSpot: string;
  date: Date;
  sessionTime: string | null;
  coverPhoto: string | null;
  photos: { id: string; photoUrl: string }[];
};

interface Props {
  gallery: Gallery;
}

export default function EditDetailsForm({ gallery }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [prefecture, setPrefecture] = useState(gallery.prefecture);
  const [area, setArea] = useState(gallery.area);
  const [surfSpot, setSurfSpot] = useState(gallery.surfSpot);
  const [date, setDate] = useState(
    new Date(gallery.date).toISOString().split("T")[0]
  );
  const [sessionTime, setSessionTime] = useState(gallery.sessionTime || "");
  const [coverPhoto, setCoverPhoto] = useState(gallery.coverPhoto || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/galleries/${gallery.id}/update-details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prefecture,
          area,
          surfSpot,
          date: new Date(date).toISOString(),
          sessionTime,
          coverPhoto,
        }),
      });

      if (res.ok) {
        alert("Gallery details updated successfully! ✅");
        router.push(`/admin/manage-gallery/${gallery.id}`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update gallery");
      }
    } catch (error) {
      console.error("Error updating gallery:", error);
      alert("Failed to update gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prefecture */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Prefecture *
            </label>
            <input
              type="text"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              required
              placeholder="e.g., 千葉県"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium mb-2">Area *</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              placeholder="e.g., 千葉北"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Surf Spot */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Surf Spot *
            </label>
            <input
              type="text"
              value={surfSpot}
              onChange={(e) => setSurfSpot(e.target.value)}
              required
              placeholder="e.g., 志田下"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Session Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Session Time */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Session Time
            </label>
            <input
              type="text"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              placeholder="e.g., 08:00 - 11:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional - e.g., &quot;08:00 - 11:00&quot; or &quot;Morning
              session&quot;
            </p>
          </div>

          {/* Cover Photo Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Photo
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Select a photo to use as the gallery cover
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {gallery.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setCoverPhoto(photo.photoUrl)}
                  className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                    coverPhoto === photo.photoUrl
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={photo.photoUrl}
                    alt="Gallery photo"
                    fill
                    className="object-cover"
                  />
                  {coverPhoto === photo.photoUrl && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <span className="text-white text-2xl">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {gallery.photos.length === 0 && (
              <p className="text-sm text-gray-500">
                No photos in this gallery yet
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
