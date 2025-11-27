import Image from "next/image";
import SurfboardKunn from "@/assets/surfboard.gif";

type Props = {
  fileCount: number;
  coverName: string;
  progress: number;
};

export default function UploadingOverlay({
  fileCount,
  //coverName,
  progress,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen bg-white/90 px-4 text-center">
      {/* Replace spinner with surfboard GIF */}
      <Image
        src={SurfboardKunn}
        alt="Uploading Surfboard"
        width={180}
        height={180}
        className="rounded-full"
      />

      <p className="mt-4 text-gray-700 text-lg font-semibold">
        Uploading {fileCount} photo{fileCount !== 1 ? "s" : ""}…
      </p>
      {/* {coverName && (
        <p className="text-sm text-gray-500 mt-1">
          Cover Photo: <span className="font-medium">{coverName}</span>
        </p>
      )} */}
      <div className="w-full max-w-sm bg-gray-200 rounded-full h-2 mt-4">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-gray-600 max-w-md">
        Please do not refresh the page or close the window while your photos are
        being uploaded.
      </p>
    </div>
  );
}
