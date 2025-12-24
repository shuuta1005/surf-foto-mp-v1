// app/admin/upload/components/BundleTierCard.tsx

"use client";

import { AllowedBundleSize } from "@/lib/pricing-rules";
import {
  calculateDiscount,
  calculatePerPhotoPrice,
  calculateEarnings,
} from "@/lib/pricing-rules";

interface Props {
  quantity: AllowedBundleSize;
  isActive: boolean;
  price: number;
  basePrice: number;
  error: string | null;
  onToggle: () => void;
  onPriceChange: (value: number) => void;
}

export default function BundleTierCard({
  quantity,
  isActive,
  price,
  basePrice,
  error,
  onToggle,
  onPriceChange,
}: Props) {
  const discount = calculateDiscount(quantity, price, basePrice);
  const perPhoto = calculatePerPhotoPrice(price, quantity);
  const earnings = calculateEarnings(price);

  return (
    <div
      className={`border rounded-lg p-3 sm:p-4 transition-all ${
        isActive ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5 sm:pt-1 flex-shrink-0">
          <input
            type="checkbox"
            checked={isActive}
            onChange={onToggle}
            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
          {/* Title and discount badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-gray-900">
                {quantity} Photos Bundle
              </span>
              {isActive && discount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Price input */}
            {isActive && (
              <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">
                  ¥
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => onPriceChange(Number(e.target.value))}
                  className={`flex-1 sm:flex-none w-full sm:w-28 px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg text-right font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  step={100}
                  min={0}
                />
              </div>
            )}
          </div>

          {isActive && (
            <>
              {/* Error message */}
              {error && (
                <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded px-2 sm:px-3 py-1.5 sm:py-2">
                  {error}
                </div>
              )}

              {/* Price breakdown */}
              {!error && price > 0 && (
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div>
                    <span className="text-gray-500">Per photo:</span>{" "}
                    <span className="font-medium text-gray-900">
                      ¥{perPhoto.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">You earn:</span>{" "}
                    <span className="font-medium text-green-600">
                      ¥{earnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    (vs. ¥{(basePrice * quantity).toLocaleString()}{" "}
                    individually)
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
