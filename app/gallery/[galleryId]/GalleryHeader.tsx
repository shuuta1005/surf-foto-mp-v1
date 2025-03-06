"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GalleryHeader({
  name,
  location,
}: {
  name: string;
  location?: string;
}) {
  const router = useRouter();

  return (
    // <div className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-10">
    //   <Button variant="outline" onClick={() => router.back()}>
    //     ← Back
    //   </Button>
    //   <h1 className="text-xl font-bold text-center">
    //     {name} - {location || "Unknown"}
    //   </h1>
    //   <Button variant="outline">Checkout</Button>
    // </div>

    <header className="w-full border-b bg-stone-100 shadow-md sticky top-0 z-10 mb-1">
      <div className=" flex justify-between items-center p-4 gap-4 max-w-7xl mx-auto">
        <Button
          className="font-semibold"
          variant="outline"
          onClick={() => router.back()}
        >
          ← Back
        </Button>

        <h1 className="text-2xl font-extrabold text-center">
          {name} - <span className="font-noto">{location || "Unknown"}</span>
        </h1>

        <Button className="font-semibold" variant="outline">
          Checkout
        </Button>
      </div>
    </header>
  );
}
