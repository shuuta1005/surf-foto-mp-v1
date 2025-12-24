// app/admin/upload/components/BasePriceWarning.tsx

"use client";

interface Props {
  show: boolean;
  oldPrice: number;
  newPrice: number;
  onDismiss: () => void;
}

export default function BasePriceWarning({
  show,
  oldPrice,
  newPrice,
  onDismiss,
}: Props) {
  if (!show) return null;

  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-2">
        <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-amber-900 mb-1">
            Base Price Changed
          </p>
          <p className="text-xs sm:text-sm text-amber-800">
            The base price was changed from ¥{oldPrice.toLocaleString()} to ¥
            {newPrice.toLocaleString()}. Some bundle prices are now invalid and
            need to be adjusted.
          </p>
          <button
            onClick={onDismiss}
            className="text-xs text-amber-700 underline mt-2 hover:text-amber-900"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
