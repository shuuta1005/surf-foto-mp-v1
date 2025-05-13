//components/footer/footer.tsx

// import { APP_NAME } from "@/lib/constants";
// const Footer = () => {
//   const currentYear = new Date().getFullYear();
//   return (
//     <footer className="border-t">
//       <div className="p-5 flex-center">
//         {currentYear} {APP_NAME}. All Rights Recerved
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-white">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b border-stone-700">
        {/* Explore */}
        <div>
          <h4 className="text-sm font-bold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/galleries" className="hover:underline">
                Galleries
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-sm font-bold mb-4">Help</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories (Optional) */}
        <div>
          <h4 className="text-sm font-bold mb-4">Popular Spots</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/galleries?area=千葉北" className="hover:underline">
                千葉北
              </Link>
            </li>
            <li>
              <Link href="/galleries?area=湘南" className="hover:underline">
                湘南
              </Link>
            </li>
            <li>
              <Link href="/galleries?area=Bali" className="hover:underline">
                仙台
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h4 className="text-sm font-bold mb-4">Connect with Us</h4>
          <div className="flex gap-4 mb-4">
            <FaInstagram className="hover:text-pink-400 cursor-pointer" />
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
            <FaFacebookF className="hover:text-blue-600 cursor-pointer" />
            <FaYoutube className="hover:text-red-500 cursor-pointer" />
          </div>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="px-3 py-2 rounded-md bg-stone-800 text-white text-sm placeholder:text-gray-400 border border-stone-700"
            />
            <button className="bg-stone-500 hover:bg-stone-600 text-white text-sm font-semibold px-3 py-2 rounded-md">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-xs text-gray-400 py-4">
        © {year} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
