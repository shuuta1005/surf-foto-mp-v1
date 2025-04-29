// components/admin/UploadingOverlay.tsx
"use client";

export default function UploadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
      <p className="mt-4 text-gray-700">Uploading…</p>
    </div>
  );
}
