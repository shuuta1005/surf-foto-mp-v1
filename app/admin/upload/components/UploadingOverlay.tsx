// app/admin/upload/components/UploadingOverlay.tsx

import Image from "next/image";
import SurfboardKunn from "@/assets/surfboard.gif";

type Props = {
  fileCount: number;
  currentFile: number;
  currentFileName: string;
  progress: number;
};

export default function UploadingOverlay({
  fileCount,
  currentFile,
  currentFileName,
  progress,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen bg-white/90 px-4 text-center">
      {/* Surfboard GIF */}
      <Image
        src={SurfboardKunn}
        alt="Uploading"
        width={180}
        height={180}
        className="rounded-full"
      />

      {/* Main status */}
      <p className="mt-4 text-gray-700 text-lg font-semibold">
        Uploading file {currentFile} of {fileCount}
      </p>

      {/* Current file name */}
      <p className="text-sm text-gray-500 mt-1 max-w-md truncate">
        {currentFileName}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-sm bg-gray-200 rounded-full h-2 mt-4">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress percentage */}
      <p className="mt-2 text-sm text-gray-600">{progress}% complete</p>

      {/* Warning */}
      <p className="mt-4 text-xs text-gray-500 max-w-md">
        Please do not refresh the page or close the window while uploading.
      </p>
    </div>
  );
}
