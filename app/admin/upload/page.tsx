//admin/upload/page.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { uploadToBlob } from "@/lib/blob";

export default function UploadGalleryPage() {
  const [prefecture, setPrefecture] = useState("");
  const [area, setArea] = useState("");
  const [surfSpot, setSurfSpot] = useState("");
  const [date, setDate] = useState("");
  //FileList is a built-in browser type (not custom-made).
  //It represents a list of files selected by a user in an <input type="file" multiple />.
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    // ✅ Upload all selected files at once
    const uploadedUrls = await uploadToBlob(files); // no loop needed

    const res = await fetch("/api/admin/upload-gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefecture,
        area,
        surfSpot,
        date,
        photoUrls: uploadedUrls,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Gallery uploaded successfully!");
    } else {
      console.error("Upload failed:", data);
      alert("Failed to upload gallery");
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Upload New Gallery</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prefecture */}
        <div>
          <Label htmlFor="prefecture">都道府県</Label>
          <Input
            id="prefecture"
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            placeholder="e.g. 千葉"
          />
        </div>

        {/* Area */}
        <div>
          <Label htmlFor="area">エリア</Label>
          <Input
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. 千葉北"
          />
        </div>

        {/* Surf Spot */}
        <div>
          <Label htmlFor="surfSpot">サーフスポット</Label>
          <Input
            id="surfSpot"
            value={surfSpot}
            onChange={(e) => setSurfSpot(e.target.value)}
            placeholder="e.g. 一宮海岸"
          />
        </div>

        {/* Date */}
        <div>
          <Label htmlFor="date">日にち</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* File Upload */}
        <div>
          <Label htmlFor="photos">Surf Fotos</Label>
          <Input
            id="photos"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        <Button type="submit">Upload Gallery</Button>
      </form>
    </div>
  );
}
