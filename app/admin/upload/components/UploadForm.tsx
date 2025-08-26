// app/admin/upload/components/UploadForm.tsx

import { useState } from "react";
import axios from "axios";
import UploadPhotoSelector from "./UploadPhotoSelector";
import UploadingOverlay from "./UploadingOverlay";
import UploadSessionDetails from "./UploadSessionDetails";

export default function UploadForm() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Metadata fields
  const [prefecture, setPrefecture] = useState("");
  const [area, setArea] = useState("");
  const [surfSpot, setSurfSpot] = useState("");
  const [date, setDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleUpload = async () => {
    const errors: Record<string, string> = {};

    if (!prefecture) errors.prefecture = "都道府県を入力してください";
    if (!area) errors.area = "エリアを入力してください";
    if (!surfSpot) errors.surfSpot = "スポット名を入力してください";
    if (!date) errors.date = "日にちを選択してください";
    if (!sessionTime) errors.sessionTime = "セッション時間を設定してください";
    if (!files || files.length === 0) errors.files = "写真を選択してください";
    if (!coverPhoto) errors.coverPhoto = "カバー写真を選択してください";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    if (files) {
      Array.from(files).forEach((file) => formData.append("photos", file));
    }
    
    if (coverPhoto) {
  formData.append("coverPhoto", coverPhoto);
}

    formData.append("prefecture", prefecture);
    formData.append("area", area);
    formData.append("surfSpot", surfSpot);
    formData.append("date", date);
    formData.append("sessionTime", sessionTime);

    setIsUploading(true);
    setUploadProgress(0);
    setFormErrors({}); // Clear errors on submit

    try {
      await axios.post("/api/admin/upload-gallery", formData, {
        onUploadProgress: (event) => {
          const percent = event.total
            ? Math.round((event.loaded * 100) / event.total)
            : 0;
          setUploadProgress(percent);
        },
      });

      // Success handling
      setFiles(null);
      setCoverPhoto(null);
      setPrefecture("");
      setArea("");
      setSurfSpot("");
      setDate("");
      setSessionTime("");
      setUploadProgress(0);
      alert("Upload complete!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative space-y-8">
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

      <UploadPhotoSelector
        files={files}
        setFiles={setFiles}
        coverPhoto={coverPhoto}
        setCoverPhoto={setCoverPhoto}
        disabled={isUploading}
        onDrop={(e) => setFiles(e.dataTransfer.files)}
        onCoverDrop={(e) => setCoverPhoto(e.dataTransfer.files?.[0] || null)}
      />

      {formErrors.files && (
        <p className="text-sm text-red-500 mt-1">{formErrors.files}</p>
      )}
      {formErrors.coverPhoto && (
        <p className="text-sm text-red-500 mt-1">{formErrors.coverPhoto}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Upload Gallery
      </button>

      {isUploading && (
        <UploadingOverlay
          fileCount={files?.length || 0}
          coverName={coverPhoto?.name || ""}
          progress={uploadProgress}
        />
      )}
    </div>
  );
}
