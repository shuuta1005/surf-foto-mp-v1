"use client";
import React from "react";

interface PricingTier {
  quantity: number;
  price: number;
}

interface BundlePricingSetupProps {
  tiers: PricingTier[];
  setTiers: React.Dispatch<React.SetStateAction<PricingTier[]>>;
}

export default function BundlePricingSetup({
  tiers,
  setTiers,
}: BundlePricingSetupProps) {
  const addTier = () => setTiers([...tiers, { quantity: 0, price: 0 }]);

  const updateTier = (
    index: number,
    field: keyof PricingTier,
    value: number
  ) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    setTiers(newTiers);
  };

  return (
    <div className="p-6 border rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">📦 Bundle Pricing</h2>
      {tiers.map((tier, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={tier.quantity}
              onChange={(e) =>
                updateTier(i, "quantity", Number(e.target.value))
              }
              className="w-20 border rounded px-2 py-1"
              placeholder="Qty"
              min={1}
            />
            <input
              type="number"
              value={tier.price}
              onChange={(e) => updateTier(i, "price", Number(e.target.value))}
              className="w-32 border rounded px-2 py-1"
              placeholder="Price (JPY)"
              step={100}
              min={500}
            />
          </div>
          {tier.price > 0 && tier.quantity > 0 && (
            <p className="text-sm text-gray-600">
              You will earn ¥{Math.floor(tier.price * 0.9)} with this bundle
            </p>
          )}
        </div>
      ))}
      <button
        onClick={addTier}
        className="mt-2 px-3 py-1 bg-zinc-500 text-white rounded hover:bg-zinc-600"
      >
        Add Tier
      </button>
    </div>
  );
}
