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

    return NextResponse.redirect(purchase.photo.originalUrl);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
