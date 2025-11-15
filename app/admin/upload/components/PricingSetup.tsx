"use client";
import React from "react";

interface PricingSetupProps {
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
}

export default function PricingSetup({ price, setPrice }: PricingSetupProps) {
  return (
    <div className="p-6 border rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">💴 Photo Pricing</h2>
      <label className="block">
        Base Price (JPY):
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          step={100}
          min={500}
          className="mt-2 w-full border rounded px-3 py-2"
        />
      </label>

      <p className="text-sm text-gray-600">
        You will earn ¥{Math.floor(price * 0.9)} (after 10% margin)
      </p>
    </div>
  );
}
