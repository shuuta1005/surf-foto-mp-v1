// app/admin/manage-gallery/[galleryId]/pricing/components/BasePriceEditor.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Pencil, AlertCircle } from "lucide-react";
import { validateBasePrice, calculateEarnings } from "@/lib/pricing-rules";

interface Props {
  basePrice: number;
  onUpdate: (newPrice: number) => Promise<void>;
  loading: boolean;
}

export default function BasePriceEditor({
  basePrice,
  onUpdate,
  loading,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [newPrice, setNewPrice] = useState(basePrice);
  const [error, setError] = useState<string | null>(null);

  const handlePriceChange = (value: number) => {
    setNewPrice(value);
    const validationError = validateBasePrice(value);
    setError(validationError);
  };

  const handleSave = async () => {
    const validationError = validateBasePrice(newPrice);
    if (validationError) {
      setError(validationError);
      return;
    }

    await onUpdate(newPrice);
    setEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setNewPrice(basePrice);
    setError(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Base Price</h3>
            <p className="text-sm text-gray-600">
              Price per single photo (JPY)
            </p>
          </div>
          {!editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Price (¥)
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) =>
                    handlePriceChange(parseInt(e.target.value) || 0)
                  }
                  min="1"
                  step="100"
                  className={`w-full px-3 py-2 border rounded-md ${
                    error ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={loading || !!error}
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
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!error && newPrice > 0 && (
              <p className="text-sm text-gray-600">
                You will earn ¥{calculateEarnings(newPrice).toLocaleString()}{" "}
                per photo (after 10% platform fee)
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-3xl font-bold text-blue-600">
              ¥{basePrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You earn ¥{calculateEarnings(basePrice).toLocaleString()} per
              photo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
