// app/api/download-photo/[photoId]/route.ts

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ photoId: string }> }
) {
  try {
    const { photoId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: session.user.id,
        photoId: photoId,
      },
      include: {
        photo: true,
      },
    });

    if (!purchase || !purchase.photo.originalUrl) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const fileRes = await fetch(purchase.photo.originalUrl);

    const blob = await fileRes.blob();
    const arrayBuffer = await blob.arrayBuffer();

    const filename = `BraFotos-${photoId}.jpg`;

    return new Response(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": fileRes.headers.get("Content-Type") || "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(arrayBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
