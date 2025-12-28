// lib/blob-watermark.ts

import sharp from "sharp";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";

const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  throw new Error("Missing BLOB_READ_WRITE_TOKEN in env");
}

/**
 * Download a blob URL and watermark it
 * Used AFTER files are already uploaded to Blob
 */
export async function watermarkBlobUrl(
  originalUrl: string,
  filename: string
): Promise<string> {
  try {
    // ─────────────────────────────────────────────────────────
    // STEP 1: Download original from Blob
    // ─────────────────────────────────────────────────────────
    const response = await fetch(originalUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch original: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // ─────────────────────────────────────────────────────────
    // STEP 2: Load watermark
    // ─────────────────────────────────────────────────────────
    const watermarkPath = path.join(process.cwd(), "public", "watermark.png");
    const rawWatermark = await fs.readFile(watermarkPath);
    const watermarkBuffer = await sharp(rawWatermark)
      .resize({ width: 700 })
      .toBuffer();

    // ─────────────────────────────────────────────────────────
    // STEP 3: Apply blur and watermark
    // ─────────────────────────────────────────────────────────
    const blurredWithWatermark = await sharp(fileBuffer)
      .resize(1600) // Consistent size
      .blur(1.5) // Moderate blur
      .composite([
        { input: watermarkBuffer, top: 300, left: 900 },
        { input: watermarkBuffer, top: 300, left: 50 },
      ])
      .jpeg()
      .toBuffer();

    // ─────────────────────────────────────────────────────────
    // STEP 4: Upload watermarked version
    // ─────────────────────────────────────────────────────────
    const watermarked = await put(`wm_${filename}`, blurredWithWatermark, {
      access: "public",
      token,
    });

    console.log(`✅ Watermarked: ${filename}`);
    return watermarked.url;
  } catch (error) {
    console.error(`❌ Watermarking failed for ${filename}:`, error);
    throw error;
  }
}

/**
 * Watermark multiple images in batch
 * Skip videos (return original URL)
 */
export async function watermarkPhotos(
  photos: Array<{ url: string; mediaType: string; filename: string }>
): Promise<Array<{ originalUrl: string; watermarkedUrl: string }>> {
  const results = [];

  for (const photo of photos) {
    // Skip videos - return original URL for both
    if (photo.mediaType === "video") {
      console.log(`⏭️  Skipping video: ${photo.filename}`);
      results.push({
        originalUrl: photo.url,
        watermarkedUrl: photo.url, // Videos don't get watermarked
      });
      continue;
    }

    try {
      // Watermark image
      const watermarkedUrl = await watermarkBlobUrl(photo.url, photo.filename);

      results.push({
        originalUrl: photo.url,
        watermarkedUrl,
      });
    } catch (error) {
      console.error(`Failed to watermark ${photo.filename}, using original`);
      // Fallback: Use original if watermarking fails
      results.push({
        originalUrl: photo.url,
        watermarkedUrl: photo.url,
      });
    }
  }

  return results;
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
