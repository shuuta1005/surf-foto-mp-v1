// components/admin/UploadingOverlay.tsx

type Props = {
  fileCount: number;
  coverName: string;
  progress: number;
};

export default function UploadingOverlay({
  fileCount,
  coverName,
  progress,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 px-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
      <p className="mt-4 text-gray-700 text-lg font-semibold">
        Uploading {fileCount} photo{fileCount !== 1 ? "s" : ""}…
      </p>
      {coverName && (
        <p className="text-sm text-gray-500 mt-1">
          Cover Photo: <span className="font-medium">{coverName}</span>
        </p>
      )}
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
