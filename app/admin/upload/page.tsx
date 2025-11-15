"use client";

import { useState } from "react";
import UploadForm from "./components/UploadForm";
import PricingSetup from "./components/PricingSetup";
import BundlePricingSetup from "./components/BundlePricingSetup";

// Define a type for bundle tiers
interface PricingTier {
  quantity: number;
  price: number;
}

export default function UploadGalleryPage() {
  // State for single photo price
  const [price, setPrice] = useState<number>(1000);

  // State for bundle tiers
  const [tiers, setTiers] = useState<PricingTier[]>([
    { quantity: 1, price: 1000 },
  ]);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto p-10 gap-10">
      {/* 📝 Upload Form Section */}
      <section
        aria-labelledby="upload-heading"
        className="w-full md:w-1/2 space-y-6"
      >
        <h1 id="upload-heading" className="text-2xl font-bold">
          📤 Upload New Gallery
        </h1>
        {/* Pass pricing props down */}
        <UploadForm price={price} tiers={tiers} />
      </section>

      {/* 💴 Pricing Section */}
      <div className="w-full md:w-1/2 space-y-10">
        <PricingSetup price={price} setPrice={setPrice} />
        <BundlePricingSetup tiers={tiers} setTiers={setTiers} />
      </div>
    </div>
  );
}
