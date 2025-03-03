import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface GalleryCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  image,
  title,
  location,
}) => {
  console.log("Gallery ID in Card:", id);

  return (
    <Link href={`/gallery/${id}`} className="block">
      <Card className="overflow-hidden group cursor-pointer">
        <CardContent className="relative p-0 h-[300px] w-full">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="brightness-75 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h3 className="text-3xl font-bold mb-2">{title}</h3>
            <p className="text-lg font-semibold">{location}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GalleryCard;
