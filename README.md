# 🌊 BrahFotos – Digital Surf Photography Platform

BrahFotos is a full‑stack e‑commerce platform for selling surf photography as digital products.  
It demonstrates end‑to‑end engineering: secure authentication, cart & checkout, digital delivery, and an admin dashboard with advanced gallery uploads.


## ✨ Features

### 🔑 Authentication & Security
- Email verification with branded HTML emails (Resend API).  
- Password reset flow with secure codes, expiry, and one‑time tokens.  
- Prisma transactions + bcrypt password hashing.  

### 🛒 Cart & Checkout
- React Context cart with localStorage persistence.  
- Tiered discount pricing logic (bulk photo bundles).  
- Stripe Checkout integration with server‑side validation.  
- Webhook handling for purchases, refunds, and failed payments.  

### 📸 Purchases & Downloads
- Purchases page with responsive photo grid.  
- Secure download API (auth + ownership checks).  
- Streams original files with branded filenames.  
- Refunded purchases excluded automatically.  

### 🛠️ Admin Dashboard
- Role‑based access control (admins only).  
- Personalized dashboard with action cards.  
- **Flagship Feature: Gallery Upload System**  
  - Drag & drop photo + cover selection with previews.  
  - Metadata form (prefecture, area, surf spot, date, session time).  
  - Client + server validation (Zod).  
  - Upload progress overlay.  
  - **Sharp + Vercel Blob Storage**:  
    - Original photos stored for buyers.  
    - Watermarked + blurred versions generated for public display.  
  - Prisma persists galleries + photos in PostgreSQL.  

---

## 🛡️ Security & Robustness
- Role‑based access (NextAuth + Prisma).  
- Server‑side validation of all inputs.  
- Dual uploads (original + watermarked) to protect IP.  
- Webhook signature verification for Stripe events.  
- Error handling and logging across all flows.  

---

## 🎨 UX Highlights
- Branded, professional emails.  
- Drag & drop uploads with previews.  
- Inline validation messages (localized in Japanese).  
- Progress overlays and friendly empty states.  
- Responsive design across all pages.  

---

## 🧰 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Radix UI, Lucide React  
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL, NextAuth  
- **Payments**: Stripe Checkout + Webhooks  
- **Email**: Resend API  
- **Storage & Media**: Vercel Blob Storage, Sharp (image processing)  
- **Validation**: Zod  

---

## 🚀 Planned Enhancements
- Client‑side image compression for faster mobile uploads.  
- Gallery management (edit/delete with Blob cleanup).  
- Analytics dashboard for sales & gallery performance.  
- Multi‑language support for emails and UI.  

---

## 🎯 Why This Project Matters
BrahFotos isn’t just a demo — it’s a **production‑grade digital product platform**.  
It shows how I can:  
- Own a feature from concept → design → implementation → polish.  
- Balance **security, scalability, and user experience**.  
- Deliver **flagship features** like the Admin Gallery Upload that combine **frontend UX, backend validation, image processing, and cloud storage** into one seamless workflow.

---
