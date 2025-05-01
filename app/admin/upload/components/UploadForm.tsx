// app/admin/upload/components/UploadForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

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
      const formData = new FormData();
      formData.append("prefecture", prefecture);
      formData.append("area", area);
      formData.append("surfSpot", surfSpot);
      formData.append("date", date);

      Array.from(files).forEach((file) => {
        formData.append("photos", file); // must match field name used in route.ts
      });

      const res = await fetch("/api/admin/upload-gallery", {
        method: "POST",
        body: formData, // ✅ send actual files
      });

      if (res.ok) {
        toast({
          title: "Gallery uploaded",
          description: "Your photos are live!",
        });
        router.push("/galleries");
      } else {
        const data = await res.json();
        console.error("Upload failed:", data);
        toast({
          title: "Upload failed",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Unexpected error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="photos">Surf Fotos</Label>
          <Input
            id="photos"
            name="photos" // ✅ Add this line
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

// 🧠 Reminder: Why Zod will eventually matter
// Later, when your upload forms get more complex (e.g., optional fields, price settings, photo rights, photographer assignments, etc.) manually checking all fields becomes:

// Repetitive

// Hard to maintain

// Easy to make mistakes

// Zod allows you to:

// ✅ Define your upload schema once
// ✅ Validate incoming form data both on the client and server easily
// ✅ Show super clean error messages to users
// ✅ Trust your data even if users tamper with the frontend

// But no rush —
// You’re doing the right thing focusing on shipping clean MVP first!
