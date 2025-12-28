// app/admin/upload/components/UploadForm.tsx
"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import UploadPhotoSelector from "./UploadPhotoSelector";
import UploadingOverlay from "./UploadingOverlay";
import UploadSessionDetails from "./UploadSessionDetails";
import PricingSetup from "./PricingSetup";
import BundlePricingSetup from "./BundlePricingSetup";
import { PricingTier } from "@/types/pricing";

export default function UploadForm() {
  // 📸 File state
  const [files, setFiles] = useState<File[] | null>(null);
  const [coverIndex, setCoverIndex] = useState<number>(0);

  // ⚙️ Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState(0);
  const [currentFileName, setCurrentFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // 📝 Metadata fields
  const [prefecture, setPrefecture] = useState("");
  const [area, setArea] = useState("");
  const [surfSpot, setSurfSpot] = useState("");
  const [date, setDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 💴 Pricing
  const [price, setPrice] = useState<number>(1000);
  const [tiers, setTiers] = useState<PricingTier[]>([]);

  // ✅ Check if all required fields are filled
  const isFormValid =
    prefecture.trim() !== "" &&
    area.trim() !== "" &&
    surfSpot.trim() !== "" &&
    date !== "" &&
    sessionTime !== "" &&
    files !== null &&
    files.length > 0;

  // 🔄 Reset helper
  const resetForm = () => {
    setFiles(null);
    setCoverIndex(0);
    setPrefecture("");
    setArea("");
    setSurfSpot("");
    setDate("");
    setSessionTime("");
    setPrice(1000);
    setTiers([]);
    setUploadProgress(0);
    setCurrentFile(0);
    setCurrentFileName("");
    setFormErrors({});
  };

  const handleUpload = async () => {
    // ─────────────────────────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────────────────────────
    const errors: Record<string, string> = {};
    if (!prefecture) errors.prefecture = "都道府県を入力してください";
    if (!area) errors.area = "エリアを入力してください";
    if (!surfSpot) errors.surfSpot = "スポット名を入力してください";
    if (!date) errors.date = "日にちを選択してください";
    if (!sessionTime) errors.sessionTime = "セッション時間を設定してください";
    if (!files || files.length === 0) errors.files = "写真を選択してください";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!files) return;

    setIsUploading(true);
    setFormErrors({});

    try {
      // ─────────────────────────────────────────────────────────
      // STEP 1: Upload all files to Blob (sequential)
      // ─────────────────────────────────────────────────────────
      console.log(`🚀 Starting upload of ${files.length} files...`);

      const uploadedFiles: { url: string; mediaType: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Update UI
        setCurrentFile(i + 1);
        setCurrentFileName(file.name);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));

        console.log(`⬆️  Uploading ${i + 1}/${files.length}: ${file.name}`);

        try {
          // Upload to Blob
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/blob/upload",
          });

          // Determine media type
          const mediaType = blob.contentType?.startsWith("video/")
            ? "video"
            : "image";

          console.log(`✅ Success: ${blob.url}`);

          uploadedFiles.push({
            url: blob.url,
            mediaType,
          });
        } catch (error) {
          console.error(`❌ Failed to upload ${file.name}:`, error);
          throw new Error(`Failed to upload ${file.name}`);
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(
        `🏁 All files uploaded: ${uploadedFiles.length}/${files.length}`
      );

      // ─────────────────────────────────────────────────────────
      // STEP 2: Create gallery in database
      // ─────────────────────────────────────────────────────────
      setCurrentFileName("Saving gallery to database...");
      setUploadProgress(100);

      const coverPhotoUrl = uploadedFiles[coverIndex]?.url;

      const response = await fetch("/api/admin/upload-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Location & Session
          prefecture,
          area,
          surfSpot,
          date: new Date(date).toISOString(),
          sessionTime,

          // Uploaded files
          uploadedFiles,
          coverPhotoUrl,

          // Pricing
          basePrice: price,
          pricingTiers: tiers.map((t) => ({
            quantity: t.quantity,
            price: t.price,
          })),

          // Flags
          isEpic: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create gallery");
      }

      console.log("✅ Gallery created:", data.gallery);

      // ─────────────────────────────────────────────────────────
      // SUCCESS!
      // ─────────────────────────────────────────────────────────
      alert("Gallery uploaded successfully! ✅");
      resetForm();
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setFormErrors({
        general:
          error instanceof Error
            ? error.message
            : "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-10">
      {/* 📝 Metadata + Pricing row */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Metadata */}
        <div className="w-full md:w-6/12 space-y-6">
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
        </div>

        {/* Right: Pricing */}
        <div className="w-full md:w-6/12 space-y-6">
          <PricingSetup price={price} setPrice={setPrice} />
          <BundlePricingSetup
            tiers={tiers}
            setTiers={setTiers}
            basePrice={price}
          />
        </div>
      </div>

      {/* 📸 Photo Upload (full width) */}
      <div className="w-full space-y-4 mt-10">
        <UploadPhotoSelector
          files={files}
          setFiles={setFiles}
          coverIndex={coverIndex}
          setCoverIndex={setCoverIndex}
          disabled={isUploading}
        />
        {formErrors.files && (
          <p className="text-sm text-red-500 mt-1">{formErrors.files}</p>
        )}
      </div>

      {/* 🚀 Submit Button */}
      <div className="w-full">
        <button
          onClick={handleUpload}
          disabled={isUploading || !isFormValid}
          className="w-full md:w-auto mt-6 px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold transition-opacity"
        >
          Upload Gallery
        </button>
        {formErrors.general && (
          <p className="text-sm text-red-500 mt-2">{formErrors.general}</p>
        )}
      </div>

      {/* ⏳ Upload Overlay */}
      {isUploading && files && (
        <UploadingOverlay
          fileCount={files.length}
          currentFile={currentFile}
          currentFileName={currentFileName}
          progress={uploadProgress}
        />
      )}
    </div>
  );
}
