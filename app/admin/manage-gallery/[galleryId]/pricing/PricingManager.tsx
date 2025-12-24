// app/admin/manage-gallery/[galleryId]/pricing/PricingManager.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  validatePricingTier,
  ALLOWED_BUNDLE_SIZES,
  AllowedBundleSize,
} from "@/lib/pricing-rules";
import BasePriceEditor from "./components/BasePriceEditor";
import TiersList from "./components/TiersList";
import TierDialog from "./components/TierDialog";
import DeleteTierDialog from "./components/DeleteTierDialog";
import BasePriceWarningDialog from "./components/BasePriceWarningDialog";

type PricingTier = {
  id: string;
  quantity: number;
  price: number;
};

interface Props {
  galleryId: string;
  basePrice: number;
  pricingTiers: PricingTier[];
}

export default function PricingManager({
  galleryId,
  basePrice,
  pricingTiers,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Base price state
  const [newBasePrice, setNewBasePrice] = useState(basePrice);

  // Tier dialog state
  const [showTierDialog, setShowTierDialog] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);

  // Delete confirmation
  const [deleteTier, setDeleteTier] = useState<PricingTier | null>(null);

  // Base price change warning
  const [showBasePriceWarning, setShowBasePriceWarning] = useState(false);
  const [invalidTiers, setInvalidTiers] = useState<PricingTier[]>([]);

  // Check which tiers would become invalid with new base price
  const checkInvalidTiers = (newBase: number): PricingTier[] => {
    return pricingTiers.filter((tier) => {
      const otherTiers = pricingTiers
        .filter((t) => t.id !== tier.id)
        .map((t) => ({ quantity: t.quantity, price: t.price }));

      const error = validatePricingTier({
        quantity: tier.quantity,
        price: tier.price,
        basePrice: newBase,
        existingTiers: otherTiers,
      });

      return error !== null;
    });
  };

  // Update base price
  const handleUpdateBasePrice = async (newPrice: number) => {
    setNewBasePrice(newPrice);

    // Check if any tiers would become invalid
    if (pricingTiers.length > 0) {
      const invalid = checkInvalidTiers(newPrice);
      if (invalid.length > 0) {
        setInvalidTiers(invalid);
        setShowBasePriceWarning(true);
        return;
      }
    }

    await performBasePriceUpdate(newPrice);
  };

  // Perform base price update
  const performBasePriceUpdate = async (price: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/galleries/${galleryId}/update-pricing`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basePrice: price }),
      });

      if (res.ok) {
        alert("Base price updated! ✅");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update base price");
      }
    } catch (error) {
      console.error("Error updating base price:", error);
      alert("Failed to update base price");
    } finally {
      setLoading(false);
    }
  };

  // Confirm base price update and delete invalid tiers
  const confirmBasePriceUpdate = async () => {
    setLoading(true);
    try {
      // Delete invalid tiers first
      for (const tier of invalidTiers) {
        await fetch(`/api/pricing-tiers/${tier.id}`, { method: "DELETE" });
      }

      // Then update base price
      await performBasePriceUpdate(newBasePrice);

      setShowBasePriceWarning(false);
      setInvalidTiers([]);
    } catch (error) {
      console.error("Error updating base price:", error);
      alert("Failed to update base price");
    } finally {
      setLoading(false);
    }
  };

  // Save tier (add or edit)
  const handleSaveTier = async (quantity: AllowedBundleSize, price: number) => {
    setLoading(true);
    try {
      if (editingTier) {
        // Update existing tier
        const res = await fetch(`/api/pricing-tiers/${editingTier.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity, price }),
        });

        if (res.ok) {
          alert("Pricing tier updated! ✅");
        } else {
          const data = await res.json();
          alert(data.error || "Failed to update tier");
          setLoading(false);
          return;
        }
      } else {
        // Create new tier
        const res = await fetch(`/api/galleries/${galleryId}/pricing-tiers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity, price }),
        });

        if (res.ok) {
          alert("Pricing tier added! ✅");
        } else {
          const data = await res.json();
          alert(data.error || "Failed to add tier");
          setLoading(false);
          return;
        }
      }

      setShowTierDialog(false);
      setEditingTier(null);
      router.refresh();
    } catch (error) {
      console.error("Error saving tier:", error);
      alert("Failed to save tier");
    } finally {
      setLoading(false);
    }
  };

  // Delete tier
  const handleDeleteTier = async () => {
    if (!deleteTier) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/pricing-tiers/${deleteTier.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Pricing tier deleted! ✅");
        setDeleteTier(null);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete tier");
      }
    } catch (error) {
      console.error("Error deleting tier:", error);
      alert("Failed to delete tier");
    } finally {
      setLoading(false);
    }
  };

  // Get available bundle sizes
  const availableBundleSizes = ALLOWED_BUNDLE_SIZES.filter(
    (size) =>
      editingTier?.quantity === size ||
      !pricingTiers.some((t) => t.quantity === size)
  );

  return (
    <div className="space-y-6">
      {/* Base Price */}
      <BasePriceEditor
        basePrice={basePrice}
        onUpdate={handleUpdateBasePrice}
        loading={loading}
      />

      {/* Pricing Tiers */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Bulk Pricing Tiers</h3>
              <p className="text-sm text-gray-600">
                Offer discounts for multiple photos (2, 3, 4, or 5 photos)
              </p>
            </div>
            <Button
              onClick={() => setShowTierDialog(true)}
              disabled={availableBundleSizes.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tier
            </Button>
          </div>

          <TiersList
            tiers={pricingTiers}
            basePrice={basePrice}
            onEdit={(tier) => {
              setEditingTier(tier);
              setShowTierDialog(true);
            }}
            onDelete={setDeleteTier}
          />

          {availableBundleSizes.length === 0 && pricingTiers.length > 0 && (
            <div className="mt-4 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded px-3 py-2">
              All available bundle sizes (2, 3, 4, 5 photos) have been
              configured.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier Dialog */}
      <TierDialog
        open={showTierDialog}
        onClose={() => {
          setShowTierDialog(false);
          setEditingTier(null);
        }}
        onSave={handleSaveTier}
        editingTier={editingTier}
        basePrice={newBasePrice}
        existingTiers={pricingTiers}
        availableSizes={availableBundleSizes}
        loading={loading}
      />

      {/* Delete Confirmation */}
      <DeleteTierDialog
        tier={deleteTier}
        basePrice={basePrice}
        onClose={() => setDeleteTier(null)}
        onConfirm={handleDeleteTier}
        loading={loading}
      />

      {/* Base Price Warning */}
      <BasePriceWarningDialog
        open={showBasePriceWarning}
        onClose={() => {
          setShowBasePriceWarning(false);
          setInvalidTiers([]);
          setNewBasePrice(basePrice);
        }}
        onConfirm={confirmBasePriceUpdate}
        oldBasePrice={basePrice}
        newBasePrice={newBasePrice}
        invalidTiers={invalidTiers}
        allTiers={pricingTiers}
        loading={loading}
      />
    </div>
  );
}
