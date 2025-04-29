// app/admin/upload/page.tsx
"use client";

import UploadForm from "./components/UploadForm";
import Image from "next/image";

export default function UploadGalleryPage() {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto p-10 gap-10">
      {/* 📝 Upload Form Section */}
      <section
        aria-labelledby="upload-heading"
        className="w-full md:w-1/2 space-y-6"
      >
        <h1 id="upload-heading" className="text-2xl font-bold">
          📤 Upload New Gallery
        </h1>
        <UploadForm />
      </section>

      {/* 🖼️ Image Preview */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center">
        <div className="relative w-full h-[400px] max-w-md">
          <Image
            src="/admin-surf.png"
            alt="Surf upload vibes"
            fill
            className="object-cover rounded-lg shadow"
          />
        </div>
      </div>
    </div>
  );
}
