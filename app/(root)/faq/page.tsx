"use client";

import React, { useState } from "react";

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I find my surf photos?",
          answer:
            "Browse our galleries by location and date. Use the search filters to find your specific surf session. Our photographers organize photos by surf spot and date to make finding your shots easy.",
        },
        {
          question: "Do I need to create an account to buy photos?",
          answer:
            "Yes, creating an account allows you to track your purchases, re-download photos, and receive updates about new sessions at your favorite surf spots.",
        },
        {
          question: "How quickly are photos uploaded after a session?",
          answer:
            "We typically upload photos within 24-48 hours after a surf session. You'll get notified via email when new photos from your registered surf spots are available.",
        },
      ],
    },
    {
      category: "Purchasing & Payment",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, PayPal, and other secure payment methods through Stripe. All transactions are encrypted and secure.",
        },
        {
          question: "How do bulk discounts work?",
          answer:
            "The more photos you add to your cart, the lower the price per photo becomes. Discounts are automatically applied - buy 2 photos and save 6%, buy 10 and save 25%!",
        },
        {
          question: "Can I get a refund if I'm not satisfied?",
          answer:
            "We offer a 24-hour satisfaction guarantee. If you're not happy with your purchase, contact us within 24 hours for a full refund.",
        },
        {
          question: "Do you offer prints or physical products?",
          answer:
            "Currently we only offer digital downloads. However, our high-resolution files are perfect for printing at any photo lab or printing service.",
        },
      ],
    },
    {
      category: "Photo Quality & Downloads",
      questions: [
        {
          question: "What resolution are the photos?",
          answer:
            "All photos are delivered in full high-resolution (typically 4000x6000 pixels or higher), perfect for large prints, social media, or any personal use.",
        },
        {
          question: "How long do download links last?",
          answer:
            "Your download links never expire! You can re-download your purchased photos anytime from your account dashboard.",
        },
        {
          question: "Are the photos edited or filtered?",
          answer:
            "Yes, our photographers professionally edit each photo for color correction, contrast, and clarity while maintaining the natural look of your surf session.",
        },
        {
          question: "Do photos have watermarks?",
          answer:
            "No, purchased photos are delivered without any watermarks or logos. They're completely clean for your personal use.",
        },
      ],
    },
    {
      category: "Surf Sessions & Coverage",
      questions: [
        {
          question: "Which surf spots do you cover?",
          answer:
            "We primarily cover surf spots around Chiba and the Shonan area. Check our galleries page for current locations, and follow us for updates on new spots.",
        },
        {
          question: "How do I know when you'll be at my local surf spot?",
          answer:
            "Follow our social media or sign up for location-based notifications in your account settings. We post our shooting schedule when possible.",
        },
        {
          question: "Can I request coverage of a specific session or event?",
          answer:
            "Yes! Contact us about private session coverage or surf contest photography. Pricing varies depending on location and duration.",
        },
        {
          question: "What if I can't find myself in the photos?",
          answer:
            "Sometimes lighting or angles make identification tricky. Contact us with details about your session (time, board, wetsuit color) and we'll help locate your shots.",
        },
      ],
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "I'm having trouble downloading my photos",
          answer:
            "First, check your internet connection and try again. If issues persist, contact support with your order details and we'll send direct download links.",
        },
        {
          question: "The website isn't working properly",
          answer:
            "Try clearing your browser cache and cookies, or try a different browser. For persistent issues, email us at support@surfphotosjapan.com with details.",
        },
        {
          question: "I forgot my account password",
          answer:
            "Use the 'Forgot Password' link on the sign-in page. We'll send you a secure reset code via email to create a new password.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100">
            Find answers to common questions about BrahFotos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Quick Contact */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className="text-blue-700 mb-3">
                Our support team is here to help! Send us an email and
                we&apos;ll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@surfphotosjapan.com"
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
              >
                support@surfphotosjapan.com
                <svg
                  className="ml-1 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600">
              {category.category}
            </h2>

            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => {
                const itemIndex = categoryIndex * 100 + questionIndex; // Unique index
                const isOpen = openItems.includes(itemIndex);

                return (
                  <div
                    key={questionIndex}
                    className="bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <button
                      onClick={() => toggleItem(itemIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          isOpen ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-4">
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Browse our latest surf photos and find your perfect wave moments.
          </p>
          <div className="space-x-4">
            <a
              href="/galleries"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Browse Photos
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
