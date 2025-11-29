// components/PricingDisplay.tsx
"use client";

interface PricingTier {
  id: string;
  quantity: number;
  price: number;
}

interface PricingDisplayProps {
  basePrice?: number;
  pricingTiers?: PricingTier[];
}

export default function PricingDisplay({
  basePrice,
  pricingTiers,
}: PricingDisplayProps) {
  const hasBundles = pricingTiers && pricingTiers.length > 0;

  // Don't render if no pricing info at all
  if ((!basePrice || basePrice <= 0) && !hasBundles) {
    return null;
  }

  // Calculate discount percentage for bundle tiers
  const calculateDiscount = (quantity: number, price: number) => {
    if (!basePrice) return 0;
    const fullPrice = basePrice * quantity;
    return Math.round(((fullPrice - price) / fullPrice) * 100);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
          {/* Base Price - only show if no bundles */}
          {!hasBundles && basePrice && (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Base Price
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ¥{basePrice.toLocaleString()}
                  <span className="text-sm sm:text-base text-gray-600 font-normal ml-1">
                    per photo
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Bundle Pricing Tiers */}
          {hasBundles && (
            <>
              {/* Optional: Show base price as reference when bundles exist */}
              {basePrice && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📸</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">
                      Single Photo
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      ¥{basePrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {basePrice && (
                <div className="hidden lg:block w-px h-16 bg-blue-200"></div>
              )}

              <div className="w-full lg:flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-3">
                  Bundle Deals 🎁
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {pricingTiers
                    .sort((a, b) => a.quantity - b.quantity)
                    .map((tier) => {
                      const discount = calculateDiscount(
                        tier.quantity,
                        tier.price
                      );
                      const perPhoto = Math.floor(tier.price / tier.quantity);

                      return (
                        <div
                          key={tier.id}
                          className="relative bg-white border-2 border-blue-200 rounded-lg p-3 sm:p-4 hover:border-blue-400 hover:shadow-md transition-all"
                        >
                          {/* Discount Badge */}
                          {discount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              {discount}% OFF
                            </div>
                          )}

                          <div className="text-center">
                            <p className="text-lg sm:text-xl font-bold text-gray-900">
                              {tier.quantity} Photos
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                              ¥{tier.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ¥{perPhoto.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
