//components/footer/footer.tsx

"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { useState } from "react";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();

  const [openExplore, setOpenExplore] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  return (
    <footer className="bg-stone-900 text-white text-sm">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 border-b border-stone-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Explore */}
          <div>
            <div className="md:hidden">
              <button
                onClick={() => setOpenExplore(!openExplore)}
                className="w-full flex justify-between items-center font-bold"
              >
                Explore
                <ChevronDown
                  className={`transition-transform ${
                    openExplore ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openExplore && (
                <ul className="mt-3 space-y-2 text-gray-300">
                  <li>
                    <Link href="/galleries">Galleries</Link>
                  </li>
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy</Link>
                  </li>
                </ul>
              )}
            </div>

            <div className="hidden md:block">
              <h4 className="font-bold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/galleries">Galleries</Link>
                </li>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Help */}
          <div>
            <div className="md:hidden">
              <button
                onClick={() => setOpenHelp(!openHelp)}
                className="w-full flex justify-between items-center font-bold"
              >
                Help
                <ChevronDown
                  className={`transition-transform ${
                    openHelp ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openHelp && (
                <ul className="mt-3 space-y-2 text-gray-300">
                  <li>
                    <Link href="/pricing">Pricing</Link>
                  </li>
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              )}
            </div>

            <div className="hidden md:block">
              <h4 className="font-bold mb-4">Help</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-xl text-gray-300">
              <FaInstagram className="hover:text-pink-400 cursor-pointer" />
              <FaTwitter className="hover:text-blue-400 cursor-pointer" />
              <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
            </div>
          </div>

          {/* Payment */}
          <div>
            <h4 className="font-bold mb-4">Payments Accepted</h4>
            <div className="flex flex-wrap gap-4 items-center">
              <Image
                src="/payments/visa.svg"
                alt="Visa"
                width={48}
                height={32}
              />
              <Image
                src="/payments/mastercard.svg"
                alt="Mastercard"
                width={48}
                height={32}
              />
              <Image
                src="/payments/amex.svg"
                alt="American Express"
                width={48}
                height={32}
              />
              <Image
                src="/payments/stripe.svg"
                alt="Stripe"
                width={48}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
          © {year} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
