"use client";
import { useState, useEffect } from "react";

export default function TermsAndConditionsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            Terms and Conditions
          </h1>
          <div className="h-1 w-20 bg-purple-500 mb-8"></div>
          <p className="text-lg text-gray-300 mb-12">
            Last updated: March 8, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 p-6 md:p-10">
          {/* Terms sections */}
          <div
            className={`space-y-12 transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                1. Introduction
              </h2>
              <p className="mb-4 text-gray-300">
                Welcome to BraFotos. These Terms and Conditions govern your use
                of our website and services. By accessing or using BraFotos, you
                agree to be bound by these Terms. Please read them carefully.
              </p>
              <p className="text-gray-300">
                If you do not agree with these Terms, please do not use our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                2. Definitions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-white">
                    2.1 &quot;User&quot;
                  </h3>
                  <p className="text-gray-300">
                    Refers to any individual who accesses or uses the BraFotos
                    platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    2.2 &quot;Photographer&quot;
                  </h3>
                  <p className="text-gray-300">
                    Refers to individuals who upload and sell photographs
                    through our platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    2.3 &quot;Content&quot;
                  </h3>
                  <p className="text-gray-300">
                    Refers to photographs, images, text, and other material
                    uploaded to or displayed on our platform.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                3. Account Registration
              </h2>
              <p className="mb-4 text-gray-300">
                To access certain features of our platform, you may need to
                register for an account. You agree to provide accurate
                information during registration and to keep your account
                credentials secure.
              </p>
              <p className="text-gray-300">
                You are responsible for all activities that occur under your
                account. Notify us immediately of any unauthorized use of your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                4. Intellectual Property Rights
              </h2>
              <p className="mb-4 text-gray-300">
                Photographers retain copyright ownership of their images. By
                uploading content to BraFotos, photographers grant us a
                non-exclusive license to display, promote, and sell their work.
              </p>
              <p className="text-gray-300">
                Purchasers receive a license to use the photographs for personal
                use only, unless otherwise specified in writing by the
                photographer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                5. Payments and Fees
              </h2>
              <p className="mb-4 text-gray-300">
                BraFotos charges a commission on sales made through our
                platform. Photographers receive the remaining percentage of each
                sale.
              </p>
              <p className="mb-4 text-gray-300">
                All payments are processed securely through our payment
                processors. We do not store your full credit card information on
                our servers.
              </p>
              <p className="text-gray-300">
                All fees are listed in the relevant sections of the website and
                are subject to change with notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                6. Prohibited Conduct
              </h2>
              <p className="mb-4 text-gray-300">Users agree not to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>
                  Upload content that infringes on others&apos; intellectual
                  property rights
                </li>
                <li>Use our platform for illegal activities</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Harass, abuse, or harm other users</li>
                <li>
                  Upload content that is obscene, defamatory, or offensive
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                7. Termination
              </h2>
              <p className="text-gray-300">
                We reserve the right to suspend or terminate your account if you
                violate these Terms. Upon termination, your right to use our
                services will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                8. Disclaimer of Warranties
              </h2>
              <p className="text-gray-300">
                Our services are provided &quot;as is&quot; without warranties
                of any kind, whether express or implied. We do not guarantee
                that our services will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-300">
                To the maximum extent permitted by law, BraFotos shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use of or inability to use
                our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                10. Changes to Terms
              </h2>
              <p className="text-gray-300">
                We may modify these Terms at any time. Changes will be effective
                upon posting to our website. Your continued use of our services
                after changes indicates your acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                11. Contact Information
              </h2>
              <p className="text-gray-300">
                If you have questions about these Terms, please contact us at
                legal@brafotos.com.
              </p>
            </section>
          </div>
        </div>

        {/* Agreement Button */}
        <div
          className={`flex justify-center mt-10 transform transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            onClick={() => window.history.back()}
          >
            Return to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
}
