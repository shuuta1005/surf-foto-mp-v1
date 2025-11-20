// app/admin/upload/components/UploadCoverPhoto.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { UploadCloud, XCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  coverPhoto: File | null;
  setCoverPhoto: (file: File | null) => void;
  disabled: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

export default function UploadCoverPhoto({
  coverPhoto,
  setCoverPhoto,
  disabled,
  onDrop,
}: Props) {
  return (
    <div>
      <Label
        htmlFor="coverPhoto"
        className="block mb-2 text-base font-semibold"
      >
        Cover Photo
      </Label>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <UploadCloud className="w-10 h-10 mx-auto text-gray-400" />
        <p className="mt-2 text-gray-600 font-medium">Upload a cover photo</p>
        <p className="text-sm text-gray-400 mb-4">or</p>
        <label
          htmlFor="coverPhoto"
          className={`inline-block px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded hover:bg-gray-600 transition cursor-pointer ${
            disabled ? "pointer-events-none opacity-60" : ""
          }`}
        >
          Browse Cover Photo
        </label>
        <Input
          id="coverPhoto"
          type="file"
          accept="image/*"
          onChange={(e) => setCoverPhoto(e.target.files?.[0] || null)}
          disabled={disabled}
          className="hidden"
        />

        {coverPhoto && (
          <div className="mt-4 space-y-2 flex flex-col items-center">
            <div className="relative w-full max-w-xs h-48">
              <Image
                src={URL.createObjectURL(coverPhoto)}
                alt="Cover Preview"
                fill
                className="object-cover rounded shadow"
                onLoadingComplete={(img) => URL.revokeObjectURL(img.src)}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Selected: {coverPhoto.name}
            </p>
            <button
              type="button"
              onClick={() => setCoverPhoto(null)}
              className="text-xs text-red-500 hover:underline flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
