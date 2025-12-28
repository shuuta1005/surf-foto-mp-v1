// app/admin/upload/components/UploadPhotoSelector.tsx

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { UploadCloud, XCircle, Star, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  files: File[] | null;
  setFiles: (files: File[] | null) => void;
  coverIndex: number;
  setCoverIndex: (index: number) => void;
  disabled: boolean;
};

export default function UploadPhotoSelector({
  files,
  setFiles,
  coverIndex,
  setCoverIndex,
  disabled,
}: Props) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // Create preview URLs when files change
  useEffect(() => {
    if (!files || files.length === 0) {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      return;
    }

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newUrls);

    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleDelete = (index: number) => {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);

    if (index === coverIndex && newFiles.length > 0) {
      setCoverIndex(0);
    } else if (index < coverIndex) {
      setCoverIndex(coverIndex - 1);
    }

    setFiles(newFiles.length > 0 ? newFiles : null);
  };

  const handleClearAll = () => {
    setFiles(null);
    setCoverIndex(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (addMoreInputRef.current) {
      addMoreInputRef.current.value = "";
    }
  };

  // Initial file selection (replaces)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : null;
    setFiles(selectedFiles);

    if (selectedFiles && selectedFiles.length > 0) {
      setCoverIndex(0);
    }
  };

  // Add more files (appends)
  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];

    if (newFiles.length === 0) return;

    if (files) {
      // Append to existing files
      setFiles([...files, ...newFiles]);
    } else {
      // First upload
      setFiles(newFiles);
      setCoverIndex(0);
    }

    // Reset input
    if (addMoreInputRef.current) {
      addMoreInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label htmlFor="photos" className="block mb-2 text-base font-semibold">
        Surf Photos
      </Label>

      {/* Show upload zone if no files */}
      {(!files || files.length === 0) && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition">
          <UploadCloud className="w-10 h-10 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600 font-medium">
            Select photos to upload
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Images (JPG, PNG, WebP) or Videos (MP4, MOV)
          </p>
          <label
            htmlFor="photos"
            className={`inline-block px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded hover:bg-gray-600 transition cursor-pointer ${
              disabled ? "pointer-events-none opacity-60" : ""
            }`}
          >
            Browse Files
          </label>
          <Input
            ref={fileInputRef}
            id="photos"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.mp4,.mov,.avi"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
        </div>
      )}

      {/* Show photo grid if files exist */}
      {files && files.length > 0 && previewUrls.length > 0 && (
        <div className="space-y-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Click <Star className="w-4 h-4 inline" /> to set a photo as the
              gallery cover
            </p>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file, idx) => {
              const isCover = idx === coverIndex;
              const previewUrl = previewUrls[idx];

              return (
                <div
                  key={`${file.name}-${idx}`}
                  className={`relative w-full aspect-square group rounded-lg overflow-hidden border-2 ${
                    isCover
                      ? "border-yellow-500 ring-2 ring-yellow-200"
                      : "border-gray-200"
                  }`}
                >
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}

                  {isCover && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Cover
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => setCoverIndex(idx)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                        title="Set as cover"
                      >
                        <Star className="w-5 h-5 text-yellow-500" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      className="p-2 bg-white rounded-full hover:bg-red-50 transition"
                      title="Delete photo"
                    >
                      <XCircle className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t">
            {/* File Count */}
            <div className="flex-1 flex items-center">
              <p className="text-sm text-gray-600 font-medium">
                {files.length} photo{files.length !== 1 ? "s" : ""} uploaded
                {files.length > 0 && ` • Photo ${coverIndex + 1} is cover`}
              </p>
            </div>

            {/* Add More Button */}
            <label
              htmlFor="add-more"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded hover:bg-gray-50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add More Files
            </label>
            <Input
              ref={addMoreInputRef}
              id="add-more"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.mp4,.mov,.avi"
              onChange={handleAddMore}
              disabled={disabled}
              className="hidden"
            />

            {/* Clear All Button */}
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-white border-2 border-red-300 rounded hover:bg-red-50 transition"
            >
              <XCircle className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
