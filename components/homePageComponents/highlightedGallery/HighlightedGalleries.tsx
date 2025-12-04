// components/homePageComponents/highlightedGallery/HighlightedGalleries.tsx

import HighlightedGalleriesClient from "./HighlightedGalleriesClient";

// ✅ Define the type for the data we're receiving
type HighlightedGallery = {
  id: string;
  coverPhoto: string | null;
  surfSpot: string;
  prefecture: string;
  area: string;
  sessionTime: string | null;
  date: Date;
};

interface Props {
  galleries: HighlightedGallery[]; // ✅ Receive as prop
}

export default function HighlightedGalleries({ galleries }: Props) {
  // ✅ No more fetching here - just format the data
  const formattedGalleries = galleries.map((gallery) => ({
    id: gallery.id,
    coverPhoto: gallery.coverPhoto,
    surfSpot: gallery.surfSpot,
    prefecture: gallery.prefecture,
    area: gallery.area,
    sessionTime: gallery.sessionTime,
    date: gallery.date,
  }));

  return <HighlightedGalleriesClient galleries={formattedGalleries} />;
}
