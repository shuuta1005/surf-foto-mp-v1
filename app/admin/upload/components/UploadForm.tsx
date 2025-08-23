// app/admin/upload/components/UploadForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadingOverlay from "./UploadingOverlay";
import UploadSessionDetails from "./UploadSessionDetails";
import UploadPhotoSelector from "./UploadPhotoSelector";
import { uploadGallerySchema } from "@/lib/validations/validation";

export default function UploadForm() {
  const [prefecture, setPrefecture] = useState("");
  const [area, setArea] = useState("");
  const [surfSpot, setSurfSpot] = useState("");
  const [date, setDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files;
    if (dropped.length) setFiles(dropped);
  };

  const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files;
    if (dropped.length) setCoverPhoto(dropped[0]); // only use the first one
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = uploadGallerySchema.safeParse({
      prefecture,
      area,
      surfSpot,
      date,
      sessionTime,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const err of validation.error.errors) {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      }
      setFormErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields.",
        variant: "destructive",
      });
      return;
    }

    setFormErrors({});

    if (!files || files.length === 0) {
      toast({
        title: "No photos",
        description: "Please select at least one photo.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("prefecture", prefecture);
      formData.append("area", area);
      formData.append("surfSpot", surfSpot);
      formData.append("date", date);
      formData.append("sessionTime", sessionTime);
      Array.from(files).forEach((file) => formData.append("photos", file));
      if (coverPhoto) {
        formData.append("coverPhoto", coverPhoto);
      }

      const res = await fetch("/api/admin/upload-gallery", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast({
          title: "Gallery uploaded 🎉",
          description: "Your photos are live!",
        });
        router.push("/galleries");
      } else {
        const data = await res.json();
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
    <>
      {isUploading && <UploadingOverlay />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Surf Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadSessionDetails
              prefecture={prefecture}
              setPrefecture={setPrefecture}
              area={area}
              setArea={setArea}
              surfSpot={surfSpot}
              setSurfSpot={setSurfSpot}
              date={date}
              setDate={setDate}
              sessionTime={sessionTime}
              setSessionTime={setSessionTime}
              disabled={isUploading}
              formErrors={formErrors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadPhotoSelector
              files={files}
              setFiles={setFiles}
              coverPhoto={coverPhoto}
              setCoverPhoto={setCoverPhoto}
              disabled={isUploading}
              onDrop={handleFileDrop}
              onCoverDrop={handleCoverDrop} // ✅ ADD THIS LINE
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isUploading} className="w-full">
          {isUploading ? "Uploading..." : "Upload Gallery"}
        </Button>
      </form>
    </>
  );
}
