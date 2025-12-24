// app/admin/manage-gallery/[galleryId]/pricing/components/TierDialog.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import {
  validatePricingTier,
  calculateSuggestedPrice,
  calculateDiscount,
  calculatePerPhotoPrice,
  calculateEarnings,
  ALLOWED_BUNDLE_SIZES,
  AllowedBundleSize,
  isAllowedBundleSize,
} from "@/lib/pricing-rules";

type PricingTier = {
  id: string;
  quantity: number;
  price: number;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (quantity: AllowedBundleSize, price: number) => Promise<void>;
  editingTier: PricingTier | null;
  basePrice: number;
  existingTiers: PricingTier[];
  availableSizes: AllowedBundleSize[];
  loading: boolean;
}

export default function TierDialog({
  open,
  onClose,
  onSave,
  editingTier,
  basePrice,
  existingTiers,
  availableSizes,
  loading,
}: Props) {
  const [quantity, setQuantity] = useState<AllowedBundleSize | "">("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Initialize form when dialog opens
  useEffect(() => {
    if (open) {
      if (editingTier) {
        setQuantity(
          isAllowedBundleSize(editingTier.quantity) ? editingTier.quantity : ""
        );
        setPrice(editingTier.price.toString());
      } else {
        setQuantity("");
        setPrice("");
      }
      setError(null);
    }
  }, [open, editingTier]);

  const handleQuantityChange = (value: AllowedBundleSize | "") => {
    setQuantity(value);

    // Auto-fill suggested price only when adding new tier
    if (value && !editingTier) {
      const suggested = calculateSuggestedPrice(value, basePrice);
      setPrice(suggested.toString());
      validatePrice(value, suggested);
    } else {
      setError(null);
    }
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (quantity) {
      validatePrice(quantity, parseInt(value) || 0);
    }
  };

  const validatePrice = (qty: AllowedBundleSize, prc: number) => {
    const otherTiers = existingTiers
      .filter((t) => (editingTier ? t.id !== editingTier.id : true))
      .map((t) => ({ quantity: t.quantity, price: t.price }));

    const validationError = validatePricingTier({
      quantity: qty,
      price: prc,
      basePrice,
      existingTiers: otherTiers,
    });

    setError(validationError);
  };

  const handleSave = async () => {
    if (!quantity || !price) {
      setError("Please fill in all fields");
      return;
    }

    const priceNum = parseInt(price);

    // Final validation
    const otherTiers = existingTiers
      .filter((t) => (editingTier ? t.id !== editingTier.id : true))
      .map((t) => ({ quantity: t.quantity, price: t.price }));

    const validationError = validatePricingTier({
      quantity,
      price: priceNum,
      basePrice,
      existingTiers: otherTiers,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    // Check for duplicate quantity (only when adding new)
    if (!editingTier && existingTiers.some((t) => t.quantity === quantity)) {
      setError(`A bundle for ${quantity} photos already exists`);
      return;
    }

    await onSave(quantity, priceNum);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTier ? "Edit Pricing Tier" : "Add Pricing Tier"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Photos *
            </label>
            <select
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(
                  e.target.value
                    ? (parseInt(e.target.value) as AllowedBundleSize)
                    : ""
                )
              }
              disabled={!!editingTier}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select bundle size...</option>
              {availableSizes.map((size) => (
                <option key={size} value={size}>
                  {size} photos
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Only 2, 3, 4, or 5 photo bundles are allowed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Total Price (¥) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              min="1"
              step="100"
              placeholder="e.g., 4500"
              className={`w-full px-3 py-2 border rounded-md ${
                error ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
            />
            {quantity && price && !error && (
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <p>
                  ¥
                  {calculatePerPhotoPrice(
                    parseInt(price),
                    quantity
                  ).toLocaleString()}{" "}
                  per photo
                </p>
                <p>
                  {calculateDiscount(quantity, parseInt(price), basePrice)}%
                  discount
                </p>
                <p className="text-green-600">
                  You earn: ¥
                  {calculateEarnings(parseInt(price)).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={loading || !!error || !quantity || !price}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingTier ? (
                "Update Tier"
              ) : (
                "Add Tier"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
