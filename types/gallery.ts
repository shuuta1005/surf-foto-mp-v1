// app/types/gallery.ts

export type Photo = {
  id: string;
  galleryId: string;
  photoUrl: string;
  originalUrl: string; // ✅ required in schema
  price: number;
  createdAt: Date;
};

export type Gallery = {
  id: string;
  prefecture: string;
  area: string;
  surfSpot: string;
  date: Date;
  isPublic: boolean;
  photographerId: string;
  photos: Photo[];
  createdAt: Date;

  // ✅ match schema (nullable, not optional)
  sessionTime: string | null;
  coverPhoto: string | null;

  // ✅ Added base price for the gallery
  price: number;

  pricingTiers: {
    id: string;
    quantity: number;
    price: number;
    createdAt: Date;
    galleryId?: string | null;
  }[];
};

export type GalleryCardProps = {
  id: string;
  image: string;
  title: string;
  location: string;
  sessionTime?: string | null;
  date?: string | Date | null;
};

export type GalleryViewProps = {
  gallery: Gallery;
};
