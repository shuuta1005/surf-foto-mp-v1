// app/api/admin/galleries/[id]/approve/route.ts

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

    // Update gallery status to APPROVED
    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        status: "APPROVED",
        // Note: No need for isPublic - status controls visibility
      },
    });

    // Send approval email to photographer
    try {
      await resend.emails.send({
        from: "BrahFotos Support <verify@surfphotosjapan.com>", // ✅ Use verified domain
        to: gallery.photographer.email,
        subject: "🎉 Your Gallery Has Been Approved!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Gallery Approved!</h2>
            <p>Hi ${gallery.photographer.name},</p>
            <p>Great news! Your gallery "<strong>${
              gallery.surfSpot
            }</strong>" has been approved and is now live on BrahFotos!</p>
            
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${
                gallery.prefecture
              } - ${gallery.area}</p>
              <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${new Date(
                gallery.date
              ).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>🏄 Spot:</strong> ${
                gallery.surfSpot
              }</p>
            </div>

            <p>Customers can now view and purchase photos from this gallery.</p>
            
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/gallery/${gallery.id}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              View Your Gallery
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Keep uploading great content! 📸<br/>
              - The BrahFotos Team
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { message: "Gallery approved successfully", gallery: updatedGallery },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving gallery:", error);
    return NextResponse.json(
      { error: "Failed to approve gallery" },
      { status: 500 }
    );
  }
}
