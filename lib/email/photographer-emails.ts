// lib/email/photographer-emails.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.EMAIL_FROM || "BrahFotos <noreply@surfphotosjapan.com>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Send email when user submits photographer application
 */
export async function sendApplicationSubmittedEmail(
  userEmail: string,
  userName: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: "Your BrahFotos Photographer Application",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📸 Application Received!</h1>
            </div>
            <div class="content">
              <p>G'day ${userName}! 🤙</p>
              
              <p>We've received your photographer application for BrahFotos! Thanks for wanting to join our community of surf photographers.</p>
              
              <h3>What happens next:</h3>
              <ul>
                <li>📋 Our team will review your application within 2-3 business days</li>
                <li>✅ You'll receive an email once your application is approved</li>
                <li>📸 Once approved, you can start uploading galleries right away</li>
              </ul>
              
              <p>We're stoked to have passionate surf photographers like you interested in our platform!</p>
              
              <p>Questions? Just reply to this email.</p>
              
              <p>Cheers,<br>The BrahFotos Team 🌊</p>
            </div>
            <div class="footer">
              <p>BrahFotos - Surf Photography Marketplace</p>
              <p>${BASE_URL}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send application submitted email:", error);
    return { success: false, error };
  }
}

/**
 * Send email when photographer application is approved
 */
export async function sendApplicationApprovedEmail(
  userEmail: string,
  userName: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: "🎉 You're Now a BrahFotos Photographer!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .info-box { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <p style="font-size: 18px; margin-top: 10px;">You're now a BrahFotos photographer!</p>
            </div>
            <div class="content">
              <p>G'day ${userName}! 🤙</p>
              
              <p>Awesome news! Your photographer application has been <strong>approved</strong>. You can now start uploading your surf galleries to BrahFotos!</p>
              
              <div style="text-align: center;">
                <a href="${BASE_URL}/admin" class="button">Go to Your Dashboard 📸</a>
              </div>
              
              <div class="info-box">
                <h3 style="margin-top: 0;">Getting Started:</h3>
                <ol>
                  <li><strong>Upload Your First Gallery</strong> - Head to your dashboard</li>
                  <li><strong>Set Your Prices</strong> - Choose base price and bundle deals</li>
                  <li><strong>Wait for Approval</strong> - We'll review and publish</li>
                  <li><strong>Start Earning</strong> - Get 90% on every sale!</li>
                </ol>
              </div>
              
              <h3>What You Get:</h3>
              <ul>
                <li>📤 Upload unlimited surf photo galleries</li>
                <li>💰 Earn 90% on every photo sold (10% platform fee)</li>
                <li>📊 Track sales and earnings in real-time</li>
                <li>💳 Direct payouts via Stripe</li>
              </ul>
              
              <p>Need help getting started? Just reply to this email.</p>
              
              <p>Stoked to have you on board! 🌊</p>
              
              <p>Cheers,<br>The BrahFotos Team</p>
            </div>
            <div class="footer">
              <p>BrahFotos - Surf Photography Marketplace</p>
              <p>${BASE_URL}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send application approved email:", error);
    return { success: false, error };
  }
}

/**
 * Send email when photographer application is rejected
 */
export async function sendApplicationRejectedEmail(
  userEmail: string,
  userName: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: "Update on Your BrahFotos Photographer Application",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #0284c7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
            </div>
            <div class="content">
              <p>G'day ${userName},</p>
              
              <p>Thanks for your interest in becoming a BrahFotos photographer. After reviewing your application, we've decided not to approve it at this time.</p>
              
              <p>This doesn't mean you can't reapply in the future! Here are some tips:</p>
              <ul>
                <li>Build your surf photography portfolio</li>
                <li>Engage with the surf photography community</li>
                <li>Keep shooting and improving your craft</li>
              </ul>
              
              <p>You can still browse and purchase photos on BrahFotos. If you have questions about this decision or want feedback, feel free to reply to this email.</p>
              
              <p>Keep charging! 🏄‍♂️</p>
              
              <p>Cheers,<br>The BrahFotos Team</p>
            </div>
            <div class="footer">
              <p>BrahFotos - Surf Photography Marketplace</p>
              <p>${BASE_URL}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send application rejected email:", error);
    return { success: false, error };
  }
}
