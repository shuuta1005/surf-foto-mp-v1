import sharp from "sharp";
import path from "path";
import { readFile } from "fs/promises";

/**
 * Add multiple, spread-out watermarks and light blur to an image
 */
export async function addWatermark(
  buffer: Buffer,
  options?: { blurAmount?: number }
): Promise<Buffer> {
  const watermarkPath = path.resolve("public/watermark/brafotos-watermark.png");
  const watermarkBuffer = await readFile(watermarkPath);

  // 🔧 Resize watermark so it's smaller
  const resizedWatermark = await sharp(watermarkBuffer)
    .resize({ width: 700 }) // You can tweak this (150–220 is common)
    .toBuffer();

  const compositeOptions: sharp.OverlayOptions[] = [
    { input: resizedWatermark, top: 300, left: 900 },
    { input: resizedWatermark, top: 300, left: 50 },
  ];

  let image = sharp(buffer).resize({ width: 1600 });

  // 🎯 Apply a chill blur (optional)
  if (options?.blurAmount !== undefined) {
    image = image.blur(options.blurAmount); // Recommended: 2–4
  }

  const result = await image
    .composite(compositeOptions)
    .jpeg({ quality: 80 })
    .toBuffer();

  return result;
}
