// app/admin/manage-gallery/[galleryId]/pricing/components/TiersList.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  calculateDiscount,
  calculatePerPhotoPrice,
  calculateEarnings,
} from "@/lib/pricing-rules";

type PricingTier = {
  id: string;
  quantity: number;
  price: number;
};

interface Props {
  tiers: PricingTier[];
  basePrice: number;
  onEdit: (tier: PricingTier) => void;
  onDelete: (tier: PricingTier) => void;
}

export default function TiersList({
  tiers,
  basePrice,
  onEdit,
  onDelete,
}: Props) {
  if (tiers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No pricing tiers yet</p>
        <p className="text-sm mt-1">
          Add tiers to offer bulk discounts (e.g., 5 photos for ¥4,500)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tiers
        .sort((a, b) => a.quantity - b.quantity)
        .map((tier) => {
          const discount = calculateDiscount(
            tier.quantity,
            tier.price,
            basePrice
          );
          const perPhoto = calculatePerPhotoPrice(tier.price, tier.quantity);
          const earnings = calculateEarnings(tier.price);

          return (
            <div
              key={tier.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">
                    {tier.quantity} {tier.quantity === 1 ? "photo" : "photos"}
                  </p>
                  {discount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                      {discount}% off
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ¥{tier.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>¥{perPhoto.toLocaleString()} per photo</span>
                  <span>•</span>
                  <span className="text-green-600">
                    You earn: ¥{earnings.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(tier)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(tier)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
