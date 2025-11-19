// app/admin/upload/components/UploadPhotoSelector.tsx

//Could decompose
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { UploadCloud, XCircle } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";

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
  // Cleanup object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      if (files) {
        Array.from(files).forEach((file) => {
          const url = URL.createObjectURL(file);
          URL.revokeObjectURL(url);
        });
      }
      if (coverPhoto) {
        const url = URL.createObjectURL(coverPhoto);
        URL.revokeObjectURL(url);
      }
    };
  }, [files, coverPhoto]);

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
            className={`inline-block px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded hover:bg-gray-600 transition cursor-pointer ${
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
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Array.from(files).map((file, idx) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative w-full h-40">
                      <Image
                        src={previewUrl}
                        alt={`Preview ${idx}`}
                        fill
                        className="object-cover rounded shadow"
                        onLoadingComplete={() =>
                          URL.revokeObjectURL(previewUrl)
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col items-center gap-1">
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
    </div>
  );
}
