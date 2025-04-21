"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { uploadToBlob } from "@/lib/blob";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadForm() {
  const [prefecture, setPrefecture] = useState("");
  const [area, setArea] = useState("");
  const [surfSpot, setSurfSpot] = useState("");
  const [date, setDate] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadedUrls = await uploadToBlob(files);

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

      if (res.ok) {
        // Optional: Toast
        router.push("/galleries");
      } else {
        const data = await res.json();
        console.error("Upload failed:", data);
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Surf Info */}
      <Card>
        <CardHeader>
          <CardTitle>Surf Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prefecture">都道府県</Label>
            <Input
              id="prefecture"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              placeholder="e.g. 千葉"
              disabled={isUploading}
            />
          </div>
          <div>
            <Label htmlFor="area">エリア</Label>
            <Input
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. 千葉北"
              disabled={isUploading}
            />
          </div>
          <div>
            <Label htmlFor="surfSpot">サーフスポット</Label>
            <Input
              id="surfSpot"
              value={surfSpot}
              onChange={(e) => setSurfSpot(e.target.value)}
              placeholder="e.g. 一宮海岸"
              disabled={isUploading}
            />
          </div>
          <div>
            <Label htmlFor="date">日にち</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isUploading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="photos">Surf Fotos</Label>
          <Input
            id="photos"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            disabled={isUploading}
          />
          {files && (
            <p className="text-sm text-muted-foreground">
              {files.length} file(s) selected
            </p>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isUploading} className="w-full">
        {isUploading ? "Uploading..." : "Upload Gallery"}
      </Button>
    </form>
  );
}
