import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { GalleryCardProps } from "@/app/types/gallery";

const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  image,
  title,
  location,
}) => {
  return (
    <Link href={`/gallery/${id}`} className="block">
      <Card className="overflow-hidden group cursor-pointer">
        {/* Adjust height for mobile vs desktop */}
        {/* <CardContent className="relative p-0 h-[200px] sm:h-[250px] md:h-[300px] w-full">
          <Image
            src={image}
            alt="Gallery Cover Surf Photo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="brightness-75 group-hover:scale-105 transition-transform duration-300 object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
              {title}
            </h3>
            <p className="text-sm sm:text-base md:text-lg font-semibold">
              {location}
            </p>
          </div>
        </CardContent> */}

        <CardContent className="relative p-0 h-[160px] sm:h-[220px] md:h-[300px] w-full">
          <Image
            src={image}
            alt="Gallery Cover Surf Photo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="brightness-75 group-hover:scale-105 transition-transform duration-300 object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
              {title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base font-semibold">
              {location}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GalleryCard;
