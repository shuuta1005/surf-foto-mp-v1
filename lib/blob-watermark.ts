// lib/blob-watermark.ts

import sharp from "sharp"; //sharp is a library for editing images (resizing, adding watermarks, etc.)
import { put } from "@vercel/blob";
import fs from "fs/promises"; //fs is Node's file system module (promises version).
import path from "path";
import { File as FormidableFile } from "formidable";

const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  throw new Error("Missing BLOB_READ_WRITE_TOKEN in env");
}

export async function uploadWithWatermarkAndOriginal(
  file: FormidableFile
): Promise<{ originalUrl: string; watermarkedUrl: string }> {
  if (!file.filepath) {
    throw new Error("Uploaded file missing filepath");
  }

  const fileBuffer = await fs.readFile(file.filepath);

  // Upload original photo
  const original = await put(
    //put(...) uploads the original photo using its filename or “original.jpg”
    file.originalFilename || "original.jpg",
    fileBuffer, //fileBuffer is the actual photo data.
    {
      access: "public", //access: "public" means people can view it online.
      token, //token is needed to upload.
    }
  );

  // Load watermark
  const watermarkPath = path.join(process.cwd(), "public", "watermark.png"); //Builds the full file path to public/watermark.png.
  const rawWatermark = await fs.readFile(watermarkPath); //Reads the watermark image file into memory.
  const watermarkBuffer = await sharp(rawWatermark) //Resize the watermark image to 700px wide
    .resize({ width: 700 })
    // You want to “compose” the watermark onto another image — like putting a sticker on a photo.
    // To do that, both images must be in memory, and in a format sharp understands — that’s a Buffer.
    .toBuffer();

  // Apply blur and watermark
  const blurredWithWatermark = await sharp(fileBuffer)
    .resize(1600) // optional: resize for consistency
    .blur(1.5) // moderate blur
    .composite([
      { input: watermarkBuffer, top: 300, left: 900 },
      { input: watermarkBuffer, top: 300, left: 50 },
    ])
    .jpeg() //Convert the final image into JPEG format
    .toBuffer(); //Output it as a buffer ready to upload

  // Upload watermarked image
  const watermarked = await put(
    `wm_${file.originalFilename || "photo"}.jpg`,
    blurredWithWatermark,
    {
      access: "public",
      token,
    }
  );

  return {
    originalUrl: original.url,
    watermarkedUrl: watermarked.url,
  };
}

// ✅ Future To-Do List: Photo Deletion System
// Here’s a clean checklist you can revisit when you’re ready:

// 🔧 Core Logic
// [ ] Add photoUrl and originalUrl fields to your Prisma schema (if not already)

// [ ] Create a reusable deletePhoto(photoId) function

// [ ] Wrap DB + Blob deletion in a Prisma transaction

// [ ] Add error handling and logging for failed deletions

// 🖼️ Gallery-Level Cleanup
// [ ] Create deleteGallery(galleryId) function

// [ ] Fetch all photos linked to the gallery

// [ ] Loop through and delete each Blob file

// [ ] Delete photo records and gallery record from DB

// 🧪 Testing
// [ ] Test single photo deletion with dummy data

// [ ] Test gallery deletion with multiple photos

// [ ] Simulate failure cases (missing URLs, network errors)

// 🧠 Optional Enhancements
// [ ] Add a confirmation modal in the frontend before deletion

// [ ] Log deleted URLs for audit/debugging

// [ ] Add a fallback queue for failed deletions (e.g. retry later)

// [ ] Build a cron job to clean up orphaned Blob files
