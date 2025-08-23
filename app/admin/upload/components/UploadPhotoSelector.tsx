// app/admin/upload/components/UploadPhotoSelector.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { UploadCloud, XCircle } from "lucide-react";

type Props = {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
  coverPhoto: File | null;
  setCoverPhoto: (file: File | null) => void;
  disabled: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onCoverDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

export default function UploadPhotoSelector({
  files,
  setFiles,
  coverPhoto,
  setCoverPhoto,
  disabled,
  onDrop,
  onCoverDrop,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Surf Photos */}
      <div>
        <Label htmlFor="photos" className="block mb-2 text-base font-semibold">
          Surf Photos
        </Label>
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <UploadCloud className="w-10 h-10 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600 font-medium">
            Drag & Drop photos here
          </p>
          <p className="text-sm text-gray-400 mb-4">or</p>
          <label
            htmlFor="photos"
            className={`inline-block px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition cursor-pointer ${
              disabled ? "pointer-events-none opacity-60" : ""
            }`}
          >
            Browse Files
          </label>
          <Input
            id="photos"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            disabled={disabled}
            className="hidden"
          />
          {files && (
            <div className="mt-2 flex flex-col items-center gap-1">
              <p className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
              <button
                type="button"
                onClick={() => setFiles(null)}
                className="text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cover Photo */}
      <div>
        <Label
          htmlFor="coverPhoto"
          className="block mb-2 text-base font-semibold"
        >
          Cover Photo
        </Label>
        <div
          onDrop={onCoverDrop}
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
            className={`inline-block px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition cursor-pointer ${
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
            <div className="mt-2 flex flex-col items-center gap-1">
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
    </div>
  );
}
