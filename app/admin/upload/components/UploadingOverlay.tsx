// components/admin/UploadingOverlay.tsx
"use client";

export default function UploadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 px-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
      <p className="mt-4 text-gray-700 text-lg font-semibold">
        Uploading photos…
      </p>
      <p className="mt-2 text-sm text-gray-600 max-w-md">
        Please do not refresh the page or close the window while your photos are
        being uploaded. This may interrupt the upload process.
      </p>
    </div>
  );
}
