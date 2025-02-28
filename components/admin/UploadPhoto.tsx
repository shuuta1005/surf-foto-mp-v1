"use client";

import { useState } from "react";

const UploadPhoto = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      setImageUrl(data.url);
      console.log("Uploaded Image URL:", data.url);
    }

    setUploading(false);
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold">Upload a Photo</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {preview && <img src={preview} alt="Preview" className="mt-2 w-40" />}
      <button
        onClick={handleUpload}
        disabled={!image || uploading}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {imageUrl && <p className="mt-2 text-green-500">Uploaded: {imageUrl}</p>}
    </div>
  );
};

export default UploadPhoto;
