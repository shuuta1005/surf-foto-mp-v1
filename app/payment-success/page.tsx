//app/payment-success/page.tsx

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { CheckCircle } from "lucide-react";
// import { useCart } from "@/features/cart/CartContext";

// export default function PaymentSuccessPage() {
//   const { clearCart } = useCart();
//   const [hasCleared, setHasCleared] = useState(false);

//   useEffect(() => {
//     if (typeof window !== "undefined" && !hasCleared) {
//       try {
//         clearCart();
//         setHasCleared(true); // ✅ avoid repeated calls
//       } catch (err) {
//         console.error("❌ Failed to clear cart on success page:", err);
//       }
//     }
//   }, [clearCart, hasCleared]);

//   return (
//     <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
//       <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
//       <h1 className="text-3xl sm:text-4xl font-bold mb-4">
//         Payment Successful! 🎉
//       </h1>
//       <p className="text-gray-600 mb-6 max-w-md">
//         Thank you for your purchase. You can now download your photos from the{" "}
//         <Link
//           href="/purchases"
//           className="text-blue-600 underline hover:text-blue-800"
//         >
//           My Purchased Photos
//         </Link>{" "}
//         page.
//       </p>
//       <Link
//         href="/purchases"
//         className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
//       >
//         Go to My Purchased Photos
//       </Link>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Download, Camera, ArrowRight } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !hasCleared) {
      try {
        clearCart();
        setHasCleared(true);
      } catch (err) {
        console.error("❌ Failed to clear cart on success page:", err);
      }
    }
  }, [clearCart, hasCleared]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Camera className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">BraFotos</h2>
          </div>
        </div>

        {/* Main Success Content */}
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header Section with Image */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center text-white">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
              <p className="text-green-100 text-lg">
                Your photos are ready for download
              </p>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Hero Image Placeholder */}
              <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    Your purchased photos await!
                  </p>
                </div>
              </div>

              {/* Success Message */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Thank you for your purchase! 🎉
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Your payment has been processed successfully. You can now
                  access and download your high-quality photos from your
                  purchases page.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link
                  href="/purchases"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <Download className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                  Download My Photos
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  Continue Browsing Photos
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">
                  What&apos;s Next?
                </h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Access your photos anytime from the &quot;My Purchased Photos&quot;
                    page
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Download high-resolution versions without watermarks
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Use your photos for personal or commercial purposes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Need help? Contact us at support@brafotos.com</p>
        </div>
      </div>
    </div>
  );
}
