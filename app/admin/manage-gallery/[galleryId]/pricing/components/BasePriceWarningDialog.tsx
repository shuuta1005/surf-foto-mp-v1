// app/admin/manage-gallery/[galleryId]/pricing/components/BasePriceWarningDialog.tsx

"use client";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import { AlertCircle } from "lucide-react";
import { validatePricingTier } from "@/lib/pricing-rules";

type PricingTier = {
  id: string;
  quantity: number;
  price: number;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  oldBasePrice: number;
  newBasePrice: number;
  invalidTiers: PricingTier[];
  allTiers: PricingTier[];
  loading: boolean;
}

export default function BasePriceWarningDialog({
  open,
  onClose,
  onConfirm,
  oldBasePrice,
  newBasePrice,
  invalidTiers,
  allTiers,
  loading,
}: Props) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Warning: Pricing Tiers Will Be Affected"
      confirmText="Update & Delete Tiers"
      variant="destructive"
      loading={loading}
    >
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 font-medium">
              Changing the base price from ¥{oldBasePrice.toLocaleString()} to ¥
              {newBasePrice.toLocaleString()} will invalidate{" "}
              {invalidTiers.length} pricing tier
              {invalidTiers.length !== 1 ? "s" : ""}:
            </p>
          </div>

          <div className="space-y-2">
            {invalidTiers.map((tier) => {
              const otherTiers = allTiers
                .filter((t) => t.id !== tier.id)
                .map((t) => ({ quantity: t.quantity, price: t.price }));

              const error = validatePricingTier({
                quantity: tier.quantity,
                price: tier.price,
                basePrice: newBasePrice,
                existingTiers: otherTiers,
              });

              return (
                <div
                  key={tier.id}
                  className="bg-white border border-amber-300 rounded p-3"
                >
                  <p className="font-semibold text-sm">
                    {tier.quantity} photos • ¥{tier.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900 font-medium mb-2">
            What will happen:
          </p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              Base price will be updated to ¥{newBasePrice.toLocaleString()}
            </li>
            <li>
              {invalidTiers.length} invalid tier
              {invalidTiers.length !== 1 ? "s" : ""} will be deleted
            </li>
            <li>You can recreate tiers with valid prices afterward</li>
          </ul>
        </div>
      </div>
    </ConfirmDialog>
  );
}
