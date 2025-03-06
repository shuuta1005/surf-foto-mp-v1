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
