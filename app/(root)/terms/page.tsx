"use client";
import { Button } from "@/components/ui/button";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-gray-900 px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-2">Terms and Conditions</h1>
          <p className="text-sm text-gray-600">Last updated: March 8, 2025</p>
          <div className="h-1 w-16 bg-stone-400 mx-auto mt-4" />
        </div>

        {/* Terms Section */}
        <div className="space-y-10 text-gray-700 text-[0.95rem] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-2">1. Introduction</h2>
            <p>
              Welcome to BraFotos. These Terms and Conditions govern your use of
              our website and services. By accessing or using BraFotos, you
              agree to be bound by these Terms. If you do not agree, please
              don’t use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">2. Definitions</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>User:</strong> Any individual using BraFotos.
              </li>
              <li>
                <strong>Photographer:</strong> Individuals who upload and sell
                photos.
              </li>
              <li>
                <strong>Content:</strong> Photos, images, and text shared on the
                platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">3. Account Registration</h2>
            <p>
              You agree to provide accurate information and keep your
              credentials secure. You’re responsible for all activity under your
              account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">4. Intellectual Property</h2>
            <p>
              Photographers retain copyright. Buyers receive a license for
              personal use unless otherwise agreed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">5. Payments and Fees</h2>
            <p>
              We charge a commission on sales. Fees and details are provided on
              the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">6. Prohibited Conduct</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Do not infringe intellectual property.</li>
              <li>No illegal or offensive content.</li>
              <li>Don’t misuse or abuse other users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">7. Termination</h2>
            <p>
              We may suspend your account if you violate our terms. Access to
              services ends immediately upon termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">
              8. Disclaimer & Liability
            </h2>
            <p>
              Our services are provided “as is.” We are not liable for indirect
              or special damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">9. Changes to Terms</h2>
            <p>
              Terms may change at any time. Continued use means you accept
              updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">10. Contact</h2>
            <p>
              Questions? Email us at <strong>legal@brafotos.com</strong>
            </p>
          </section>
        </div>

        {/* Return Button */}
        <div className="text-center pt-10">
          <Button onClick={() => window.history.back()}>
            ← Return to Previous Page
          </Button>
        </div>
      </div>
    </div>
  );
}
