"use client";
import { useState, useEffect } from "react";
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
            Privacy Policy
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
          {/* Introduction */}
          <div
            className={`pb-8 transform transition-all duration-1000 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-gray-300">
              At BraFotos, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website and use our services.
              Please read this policy carefully. If you do not agree with the
              terms of this privacy policy, please do not access the site.
            </p>
          </div>

          {/* Policy sections */}
          <div className="space-y-12">
            <section
              className={`transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center mb-4">
                <Database className="text-purple-400 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-purple-400">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-4 pl-9">
                <div>
                  <h3 className="font-medium text-white">Personal Data</h3>
                  <p className="text-gray-300">
                    We may collect personal identification information,
                    including but not limited to your name, email address,
                    postal address, phone number, and payment information when
                    you register on our site, place an order, subscribe to our
                    newsletter, or fill out a form.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">Usage Data</h3>
                  <p className="text-gray-300">
                    We may collect information on how the site is accessed and
                    used. This usage data may include information such as your
                    computer&apos;s IP address, browser type, browser version,
                    pages visited, time spent on those pages, and other
                    diagnostic data.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    Cookies and Tracking Technologies
                  </h3>
                  <p className="text-gray-300">
                    We use cookies and similar tracking technologies to track
                    activity on our site and hold certain information. Cookies
                    are files with small amounts of data that may include an
                    anonymous unique identifier.
                  </p>
                </div>
              </div>
            </section>

            <section
              className={`transform transition-all duration-1000 delay-400 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center mb-4">
                <Eye className="text-purple-400 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-purple-400">
                  How We Use Your Information
                </h2>
              </div>
              <div className="space-y-3 pl-9">
                <p className="text-gray-300">
                  We may use the information we collect for various purposes
                  including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>
                    To allow you to participate in interactive features when you
                    choose to do so
                  </li>
                  <li>To provide customer support</li>
                  <li>
                    To gather analysis or valuable information to improve our
                    service
                  </li>
                  <li>To monitor the usage of our service</li>
                  <li>To detect, prevent, and address technical issues</li>
                  <li>
                    To process transactions and send related information
                    including confirmations and receipts
                  </li>
                </ul>
              </div>
            </section>

            <section
              className={`transform transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center mb-4">
                <Server className="text-purple-400 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-purple-400">
                  Data Storage and Security
                </h2>
              </div>
              <div className="pl-9 text-gray-300">
                <p className="mb-4">
                  We value your trust in providing us your personal information
                  and strive to use commercially acceptable means of protecting
                  it. However, no method of transmission over the Internet or
                  method of electronic storage is 100% secure.
                </p>
                <p>
                  While we strive to use commercially acceptable means to
                  protect your personal data, we cannot guarantee its absolute
                  security. Your data is stored on secure servers with regular
                  backups. We implement various security measures when a user
                  enters, submits, or accesses their information to maintain the
                  safety of personal information.
                </p>
              </div>
            </section>

            <section
              className={`transform transition-all duration-1000 delay-600 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center mb-4">
                <Shield className="text-purple-400 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-purple-400">
                  Disclosure of Data
                </h2>
              </div>
              <div className="pl-9 text-gray-300">
                <p className="mb-4">
                  We may disclose your personal information in the following
                  situations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Business Transaction:</span>{" "}
                    If we are involved in a merger, acquisition, or asset sale,
                    your personal data may be transferred as part of that
                    transaction.
                  </li>
                  <li>
                    <span className="font-medium">Legal Requirements:</span> We
                    may disclose your personal data in good faith when we
                    believe it is necessary to comply with the law, protect our
                    rights or safety, investigate fraud, or respond to a
                    government request.
                  </li>
                  <li>
                    <span className="font-medium">Service Providers:</span> We
                    may employ third-party companies and individuals to
                    facilitate our service, provide service on our behalf, or
                    assist us in analyzing how our service is used.
                  </li>
                </ul>
              </div>
            </section>

            <section
              className={`transform transition-all duration-1000 delay-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center mb-4">
                <Key className="text-purple-400 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-purple-400">
                  Your Data Rights
                </h2>
              </div>
              <div className="pl-9 text-gray-300">
                <p className="mb-4">
                  You have certain rights relating to your personal data,
                  including:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Access:</span> You have the
                    right to request copies of your personal information.
                  </li>
                  <li>
                    <span className="font-medium">Rectification:</span> You have
                    the right to request that we correct any information you
                    believe is inaccurate or complete information you believe is
                    incomplete.
                  </li>
                  <li>
                    <span className="font-medium">Erasure:</span> You have the
                    right to request that we erase your personal data, under
                    certain conditions.
                  </li>
                  <li>
                    <span className="font-medium">Restriction:</span> You have
                    the right to request that we restrict the processing of your
                    personal data, under certain conditions.
                  </li>
                  <li>
                    <span className="font-medium">Data Portability:</span> You
                    have the right to request that we transfer the data we have
                    collected to another organization or directly to you, under
                    certain conditions.
                  </li>
                </ul>
              </div>
            </section>

            <section
              className={`transform transition-all duration-1000 delay-800 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center mb-4">
                <AlertCircle className="text-purple-400 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-purple-400">
                  Children&apos;s Privacy
                </h2>
              </div>
              <div className="pl-9 text-gray-300">
                <p>
                  Our service does not address anyone under the age of 18. We do
                  not knowingly collect personally identifiable information from
                  children under 18. In the case we discover that a child under
                  18 has provided us with personal information, we immediately
                  delete this from our servers. If you are a parent or guardian
                  and you are aware that your child has provided us with
                  personal information, please contact us.
                </p>
              </div>
            </section>

            <section
              className={`transform transition-all duration-1000 delay-900 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center mb-4">
                <Mail className="text-purple-400 mr-3" size={24} />
                <h2 className="text-2xl font-semibold text-purple-400">
                  Contact Us
                </h2>
              </div>
              <div className="pl-9 text-gray-300">
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at privacy@brafotos.com.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Agreement Button */}
        <div
          className={`flex justify-center mt-10 transform transition-all duration-1000 delay-1000 ${
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
