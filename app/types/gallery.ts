export interface Photo {
  id: string;
  photoUrl: string;
}

export interface Gallery {
  id: string;
  name: string;
  location?: string | null; // Optional, can be null
  photos: Photo[];
}
