"use client";

import { Button } from "@/components/ui/button";
import {
  Shield,
  Eye,
  Key,
  Database,
  AlertCircle,
  Server,
  Mail,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-gray-900 px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-600">Last updated: March 8, 2025</p>
          <div className="h-1 w-16 bg-stone-400 mx-auto mt-4" />
        </div>

        {/* Intro */}
        <p className="text-gray-700 text-[0.95rem] leading-relaxed">
          At BraFotos, we take your privacy seriously. This policy explains how
          we collect, use, and protect your data when you use our platform.
        </p>

        {/* Sections */}
        <div className="space-y-10 text-gray-700 text-[0.95rem] leading-relaxed">
          {/* Section Template */}
          <section>
            <h2 className="flex items-center text-xl font-bold mb-2">
              <Database size={20} className="mr-2 text-stone-500" />
              Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Personal Data:</strong> Name, email, address, and
                payment details
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent, IP
                address
              </li>
              <li>
                <strong>Cookies:</strong> We use them to track usage and
                remember preferences
              </li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center text-xl font-bold mb-2">
              <Eye size={20} className="mr-2 text-stone-500" />
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and improve our service</li>
              <li>To send transaction emails or updates</li>
              <li>To detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center text-xl font-bold mb-2">
              <Server size={20} className="mr-2 text-stone-500" />
              Data Storage and Security
            </h2>
            <p>
              We use secure servers and industry-standard practices, but no
              system is 100% secure. We strive to keep your data safe.
            </p>
          </section>

          <section>
            <h2 className="flex items-center text-xl font-bold mb-2">
              <Shield size={20} className="mr-2 text-stone-500" />
              Disclosure of Data
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Business Transfers:</strong> Your data may be
                transferred if we are acquired or merged
              </li>
              <li>
                <strong>Legal Requirements:</strong> To comply with the law or
                protect rights
              </li>
              <li>
                <strong>Service Providers:</strong> Third parties may help us
                operate our platform
              </li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center text-xl font-bold mb-2">
              <Key size={20} className="mr-2 text-stone-500" />
              Your Data Rights
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Request access, corrections, or deletion of your data</li>
              <li>Limit how we use your data</li>
              <li>Request transfer of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center text-xl font-bold mb-2">
              <AlertCircle size={20} className="mr-2 text-stone-500" />
              Children’s Privacy
            </h2>
            <p>
              We do not knowingly collect data from children under 18. If we
              learn that we have, we’ll delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="flex items-center text-xl font-bold mb-2">
              <Mail size={20} className="mr-2 text-stone-500" />
              Contact Us
            </h2>
            <p>
              If you have any questions about this policy, contact us at{" "}
              <strong>privacy@brafotos.com</strong>.
            </p>
          </section>
        </div>

        {/* Return Button */}
        <div className="text-center pt-12">
          <Button onClick={() => window.history.back()}>
            ← Return to Previous Page
          </Button>
        </div>
      </div>
    </div>
  );
}
