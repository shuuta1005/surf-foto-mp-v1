// components/ui/warning-banner.tsx

"use client";

import { AlertCircle, X } from "lucide-react";

interface WarningBannerProps {
  title: string;
  message: string;
  onDismiss?: () => void;
  variant?: "warning" | "error" | "info";
}

const variants = {
  warning: {
    container: "bg-amber-50 border-amber-400",
    icon: "text-amber-600",
    title: "text-amber-900",
    message: "text-amber-800",
  },
  error: {
    container: "bg-red-50 border-red-400",
    icon: "text-red-600",
    title: "text-red-900",
    message: "text-red-800",
  },
  info: {
    container: "bg-blue-50 border-blue-400",
    icon: "text-blue-600",
    title: "text-blue-900",
    message: "text-blue-800",
  },
};

export default function WarningBanner({
  title,
  message,
  onDismiss,
  variant = "warning",
}: WarningBannerProps) {
  const colors = variants[variant];

  return (
    <div className={`border-2 rounded-lg p-3 sm:p-4 ${colors.container}`}>
      <div className="flex items-start gap-2">
        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${colors.icon}`} />
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs sm:text-sm font-semibold mb-1 ${colors.title}`}
          >
            {title}
          </p>
          <p className={`text-xs sm:text-sm ${colors.message}`}>{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ${colors.icon} hover:opacity-70`}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
