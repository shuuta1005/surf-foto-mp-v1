// scripts/test-watermark.ts
import { readFile, writeFile } from "fs/promises";
import { addWatermark } from "@/lib/utils/image"; // Adjust path if needed

async function testWatermark() {
  try {
    const inputPath = "public/test.jpg"; // Your test input image
    const outputPath = "public/output.jpg"; // Output will be saved here

    const imageBuffer = await readFile(inputPath);
    const result = await addWatermark(imageBuffer, { blurAmount: 1.5 });

    await writeFile(outputPath, result);
    console.log("✅ Watermark added. Saved to:", outputPath);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testWatermark();
