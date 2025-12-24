// app/admin/upload/components/UploadForm.tsx

import { useState } from "react";
import axios from "axios";
import UploadPhotoSelector from "./UploadPhotoSelector";
import UploadingOverlay from "./UploadingOverlay";
import UploadSessionDetails from "./UploadSessionDetails";
import PricingSetup from "./PricingSetup";
import BundlePricingSetup from "./BundlePricingSetup";
import { PricingTier } from "@/types/pricing";

export default function UploadForm() {
  // 📸 File state
  const [files, setFiles] = useState<File[] | null>(null);
  const [coverIndex, setCoverIndex] = useState<number>(0); // ✅ Track cover by index

  // ⚙️ Upload state
  const [isUploading, setIsUploading] = useState(false);
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
    files.length > 0; // ✅ No more coverPhoto check!

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
    setFormErrors({});
  };

  const handleUpload = async () => {
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

    const formData = new FormData();

    // ✅ Add all photos
    if (files) {
      files.forEach((file) => formData.append("photos", file));
    }

    // ✅ Add cover photo separately (it's one of the uploaded photos)
    if (files && files[coverIndex]) {
      formData.append("coverPhoto", files[coverIndex]);
    }

    formData.append("prefecture", prefecture);
    formData.append("area", area);
    formData.append("surfSpot", surfSpot);
    formData.append("date", date);
    formData.append("sessionTime", sessionTime);
    formData.append("price", price.toString());
    formData.append("tiers", JSON.stringify(tiers));

    setIsUploading(true);
    setUploadProgress(0);
    setFormErrors({});

    try {
      await axios.post("/api/admin/upload-gallery", formData, {
        onUploadProgress: (event) => {
          const percent = event.total
            ? Math.round((event.loaded * 100) / event.total)
            : 0;
          setUploadProgress(percent);
        },
      });
      alert("Gallery uploaded successfully! ✅");
      resetForm();
    } catch (error) {
      console.error("Upload failed:", error);
      setFormErrors({ general: "Upload failed. Please try again." });
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
          coverName={files[coverIndex]?.name || ""}
          progress={uploadProgress}
        />
      )}
    </div>
  );
}
