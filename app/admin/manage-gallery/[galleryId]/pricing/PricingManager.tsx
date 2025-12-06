// app/admin/manage-gallery/[galleryId]/pricing/PricingManager.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

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
  const [editingBasePrice, setEditingBasePrice] = useState(false);

  // Tier dialog state
  const [showTierDialog, setShowTierDialog] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTier | null>(null);
  const [tierQuantity, setTierQuantity] = useState("");
  const [tierPrice, setTierPrice] = useState("");

  // Delete confirmation
  const [deleteTier, setDeleteTier] = useState<PricingTier | null>(null);

  // Update base price
  const handleUpdateBasePrice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/galleries/${galleryId}/update-pricing`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basePrice: newBasePrice }),
      });

      if (res.ok) {
        alert("Base price updated! ✅");
        setEditingBasePrice(false);
        router.refresh();
      } else {
        alert("Failed to update base price");
      }
    } catch (error) {
      console.error("Error updating base price:", error);
      alert("Failed to update base price");
    } finally {
      setLoading(false);
    }
  };

  // Add or edit tier
  const handleSaveTier = async () => {
    const quantity = parseInt(tierQuantity);
    const price = parseInt(tierPrice);

    if (!quantity || !price || quantity < 1 || price < 1) {
      alert("Please enter valid quantity and price");
      return;
    }

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
          alert("Failed to update tier");
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
          alert("Failed to add tier");
        }
      }

      setShowTierDialog(false);
      setEditingTier(null);
      setTierQuantity("");
      setTierPrice("");
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
        alert("Failed to delete tier");
      }
    } catch (error) {
      console.error("Error deleting tier:", error);
      alert("Failed to delete tier");
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for new tier
  const openAddTierDialog = () => {
    setEditingTier(null);
    setTierQuantity("");
    setTierPrice("");
    setShowTierDialog(true);
  };

  // Open dialog for editing tier
  const openEditTierDialog = (tier: PricingTier) => {
    setEditingTier(tier);
    setTierQuantity(tier.quantity.toString());
    setTierPrice(tier.price.toString());
    setShowTierDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Base Price Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Base Price</h3>
              <p className="text-sm text-gray-600">
                Price per single photo (JPY)
              </p>
            </div>
            {!editingBasePrice && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingBasePrice(true)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {editingBasePrice ? (
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Price (¥)
                </label>
                <input
                  type="number"
                  value={newBasePrice}
                  onChange={(e) => setNewBasePrice(parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <Button
                onClick={handleUpdateBasePrice}
                disabled={loading}
                className="flex-shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingBasePrice(false);
                  setNewBasePrice(basePrice);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <p className="text-3xl font-bold text-blue-600">¥{basePrice}</p>
          )}
        </CardContent>
      </Card>

      {/* Pricing Tiers Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Bulk Pricing Tiers</h3>
              <p className="text-sm text-gray-600">
                Offer discounts for multiple photos
              </p>
            </div>
            <Button onClick={openAddTierDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tier
            </Button>
          </div>

          {pricingTiers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pricing tiers yet</p>
              <p className="text-sm mt-1">
                Add tiers to offer bulk discounts (e.g., 5 photos for ¥4,500)
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">
                      {tier.quantity} {tier.quantity === 1 ? "photo" : "photos"}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      ¥{tier.price}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ¥{Math.round(tier.price / tier.quantity)} per photo
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditTierDialog(tier)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTier(tier)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Tier Dialog */}
      <Dialog open={showTierDialog} onOpenChange={setShowTierDialog}>
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
              <input
                type="number"
                value={tierQuantity}
                onChange={(e) => setTierQuantity(e.target.value)}
                min="1"
                placeholder="e.g., 5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Total Price (¥) *
              </label>
              <input
                type="number"
                value={tierPrice}
                onChange={(e) => setTierPrice(e.target.value)}
                min="1"
                placeholder="e.g., 4500"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {tierQuantity && tierPrice && (
                <p className="text-xs text-gray-500 mt-1">
                  ¥{Math.round(parseInt(tierPrice) / parseInt(tierQuantity))}{" "}
                  per photo
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowTierDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveTier}
                disabled={loading}
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

      {/* Delete Tier Confirmation */}
      <Dialog open={!!deleteTier} onOpenChange={() => setDeleteTier(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pricing Tier?</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this pricing tier?
            </p>

            {deleteTier && (
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-semibold">
                  {deleteTier.quantity}{" "}
                  {deleteTier.quantity === 1 ? "photo" : "photos"} for ¥
                  {deleteTier.price}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteTier(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteTier}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Delete Tier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
