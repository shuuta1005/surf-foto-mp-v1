// lib/blob-watermark.ts

import sharp from "sharp";
import { put } from "@vercel/blob";
import fs from "fs/promises";
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
    file.originalFilename || "original.jpg",
    fileBuffer,
    {
      access: "public",
      token,
    }
  );

  // Load watermark
  const watermarkPath = path.join(process.cwd(), "public", "watermark.png");
  const rawWatermark = await fs.readFile(watermarkPath);
  const watermarkBuffer = await sharp(rawWatermark)
    .resize({ width: 700 })
    .toBuffer();

  // Apply blur and watermark
  const blurredWithWatermark = await sharp(fileBuffer)
    .resize(1600) // optional: resize for consistency
    .blur(1.5) // moderate blur
    .composite([
      { input: watermarkBuffer, top: 300, left: 900 },
      { input: watermarkBuffer, top: 300, left: 50 },
    ])
    .jpeg()
    .toBuffer();

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
