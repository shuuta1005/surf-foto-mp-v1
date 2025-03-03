import { NextRequest, NextResponse } from "next/server";
import { createPhoto } from "@/db/photo";

export async function POST(req: NextRequest) {
  try {
    const { galleryId, photoUrl, title } = await req.json();

    if (!galleryId || !photoUrl) {
      return NextResponse.json(
        { error: "Gallery ID and Photo URL are required" },
        { status: 400 }
      );
    }

    const newPhoto = await createPhoto(galleryId, photoUrl, title);

    return NextResponse.json(newPhoto);
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
