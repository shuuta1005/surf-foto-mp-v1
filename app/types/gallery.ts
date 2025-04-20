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
};

export type GalleryCardProps = {
  id: string;
  image: string;
  title: string;
  location: string;
};

export type GalleryViewProps = {
  gallery: Gallery;
};
