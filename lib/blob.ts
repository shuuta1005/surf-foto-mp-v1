// lib/blob.ts
import { put } from "@vercel/blob";
//importing the put function from Vercel's Blob SDK — it handles uploading files.

// ⛑️ Use public env var on client side
const token = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

export async function uploadToBlob(files: FileList): Promise<string[]> {
  const urls: string[] = [];

  for (const file of Array.from(files)) {
    const res = await put(file.name, file, {
      access: "public",
      token, // ✅ Client-safe token
    });
    urls.push(res.url);
  }

  return urls;
}
