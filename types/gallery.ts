// types/gallery.ts

/**
 * Photo represents an individual surf photo
 * Belongs to a Gallery
 */
export type Photo = {
  id: string;
  galleryId: string;
  photoUrl: string; // Watermarked version (public display)
  originalUrl: string; // High-res original (after purchase)
  createdAt: Date;
};

/**
 * Gallery represents a surf session photo collection
 * Created by photographers, approved by admins
 */
export type Gallery = {
  // Identification
  id: string;
  photographerId: string;
  createdAt: Date;

  // Location & Session
  prefecture: string; // e.g., "千葉県"
  area: string; // e.g., "千葉北"
  surfSpot: string; // e.g., "志田下"
  date: Date; // Session date
  sessionTime: string; // e.g., "08:00 - 11:00" (required)

  // Media
  coverPhoto: string | null;

  // Pricing
  price: number; // Base price per single photo (JPY)
  pricingTiers: {
    id: string;
    galleryId: string;
    quantity: number; // Bundle size (2, 3, 5 photos)
    price: number; // Total bundle price (JPY)
    createdAt: Date;
  }[];

  // Status & Moderation
  status: "PENDING" | "APPROVED" | "REJECTED";

  // Relations
  photos: Photo[];
  photographer?: {
    // Optional - included when needed
    id: string;
    name: string;
    email: string;
  };
};

/**
 * Props for gallery card component
 * Used in gallery list/grid displays
 */
export type GalleryCardProps = {
  id: string;
  image: string;
  title: string;
  location: string;
  sessionTime?: string;
  date?: string | Date;
};

/**
 * Props for gallery view page
 */
export type GalleryViewProps = {
  gallery: Gallery;
};
