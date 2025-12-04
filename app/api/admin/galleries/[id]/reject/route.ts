// app/api/admin/galleries/[id]/reject/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Check if user is admin
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Await params in Next.js 15
    const { id } = await params;
    const body = await req.json();
    const { reason } = body; // Rejection reason from request body

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Get gallery with photographer info before updating
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: {
        photographer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    // Update gallery status to REJECTED
    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        status: "REJECTED",
        // Note: No need for isPublic - status controls visibility
      },
    });

    // Send rejection email to photographer
    try {
      await resend.emails.send({
        from: "BrahFotos Support <verify@surfphotosjapan.com>", // ✅ Use verified domain
        to: gallery.photographer.email,
        subject: "Gallery Review Update - Action Required",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Gallery Not Approved</h2>
            <p>Hi ${gallery.photographer.name},</p>
            <p>Thank you for submitting your gallery "<strong>${
              gallery.surfSpot
            }</strong>". Unfortunately, we cannot approve it at this time.</p>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p style="margin: 5px 0;"><strong>📍 Gallery:</strong> ${
                gallery.surfSpot
              } - ${gallery.prefecture}</p>
              <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${new Date(
                gallery.date
              ).toLocaleDateString()}</p>
              <p style="margin: 15px 0 5px 0;"><strong>Reason for rejection:</strong></p>
              <p style="margin: 5px 0; color: #991b1b;">${reason}</p>
            </div>

            <p><strong>What you can do:</strong></p>
            <ul style="color: #374151;">
              <li>Review the reason above</li>
              <li>Make the necessary changes</li>
              <li>Re-upload your gallery</li>
            </ul>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              We appreciate your understanding and look forward to your next submission!<br/>
              - The BrahFotos Team
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { message: "Gallery rejected successfully", gallery: updatedGallery },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting gallery:", error);
    return NextResponse.json(
      { error: "Failed to reject gallery" },
      { status: 500 }
    );
  }
}
