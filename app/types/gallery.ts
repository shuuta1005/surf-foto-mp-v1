export interface Photo {
  id: string;
  photoUrl: string;
}

export interface Gallery {
  id: string;
  name: string;
  location?: string | null;
  coverImage?: string | null; // ✅ Accept both string and null
  createdAt: Date;
  photos: Photo[];
}

export type GalleryCardProps = {
  id: string;
  image: string;
  title: string;
  location: string;
};

export type GalleryViewProps = {
  gallery: Gallery;
};
