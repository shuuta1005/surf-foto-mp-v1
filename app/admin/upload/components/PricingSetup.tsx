// components/PricingSetup.tsx

"use client";
import React from "react";

interface PricingSetupProps {
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}

const MIN_PHOTO_PRICE = 500;

export default function PricingSetup({ price, setPrice }: PricingSetupProps) {
  const error =
    price < MIN_PHOTO_PRICE
      ? `Base price must be at least ¥${MIN_PHOTO_PRICE}`
      : null;

  return (
    <div className="p-6 border rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">💴 Base Pricing</h2>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-32 border rounded px-2 py-1"
        placeholder="Price (JPY)"
        step={100}
        min={MIN_PHOTO_PRICE}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && price > 0 && (
        <p className="text-sm text-gray-600">
          You will earn ¥{Math.floor(price * 0.9)} per photo
        </p>
      )}
    </div>
  );
}
