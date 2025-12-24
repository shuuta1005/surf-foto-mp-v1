// app/admin/manage-gallery/[galleryId]/pricing/components/DeleteTierDialog.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { calculateDiscount, calculatePerPhotoPrice } from "@/lib/pricing-rules";

type PricingTier = {
  id: string;
  quantity: number;
  price: number;
};

interface Props {
  tier: PricingTier | null;
  basePrice: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export default function DeleteTierDialog({
  tier,
  basePrice,
  onClose,
  onConfirm,
  loading,
}: Props) {
  return (
    <Dialog open={!!tier} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Pricing Tier?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this pricing tier?
          </p>

          {tier && (
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="font-semibold">
                {tier.quantity} {tier.quantity === 1 ? "photo" : "photos"} for ¥
                {tier.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {calculateDiscount(tier.quantity, tier.price, basePrice)}%
                discount • ¥
                {calculatePerPhotoPrice(
                  tier.price,
                  tier.quantity
                ).toLocaleString()}{" "}
                per photo
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete Tier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
