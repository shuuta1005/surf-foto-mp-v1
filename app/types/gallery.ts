//app/types/gallery.ts

export type Photo = {
  id: string;
  galleryId: string;
  photoUrl: string;
  uploadedAt: Date;
  isCover: boolean;
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

  // ✅ New optional fields
  sessionTime?: string;
  coverPhoto?: string;
};

export type GalleryCardProps = {
  id: string;
  image: string;
  title: string;
  location: string;
  sessionTime?: string | null;
  date?: string | Date | null; // ✅ Add this
};

export type GalleryViewProps = {
  gallery: Gallery;
};
