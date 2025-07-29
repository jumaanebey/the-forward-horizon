'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const formType = searchParams.get('type');
  const firstName = searchParams.get('name');

  const getContent = () => {
    switch (formType) {
      case 'veteran-housing':
        return {
          title: "Thank You for Your Service!",
          subtitle: "Your Veterans Benefits Guide is on the way",
          icon: "🇺🇸",
          description: "We honor your military service and are here to support your transition to civilian housing.",
          nextSteps: [
            "Check your email for the Veterans Benefits Guide",
            "We'll call you within 24 hours to discuss your housing needs",
            "Our veterans coordinator will walk you through available programs"
          ],
          cta: "Learn More About Veterans Housing",
          ctaLink: "#programs"
        };
      case 'sober-living':
        return {
          title: "Your Recovery Journey Starts Here",
          subtitle: "Recovery Housing Preparation Guide sent to your email",
          icon: "🌟",
          description: "Taking this step shows incredible courage. We're here to support your recovery every step of the way.",
          nextSteps: [
            "Download your Recovery Housing Preparation Guide from email",
            "A recovery specialist will contact you within 24 hours",
            "We'll discuss intake process and available rooms"
          ],
          cta: "Explore Recovery Programs",
          ctaLink: "#programs"
        };
      case 'Re-entry-housing':
        return {
          title: "Your Fresh Start Begins Now",
          subtitle: "Life After Release Planning Kit delivered to your inbox",
          icon: "🔑",
          description: "Your past doesn't define your future. We believe in second chances and successful reintegration.",
          nextSteps: [
            "Open your Life After Release Planning Kit email",
            "Our reentry coordinator will call within 24 hours",
            "Schedule your intake interview and facility tour"
          ],
          cta: "View Reentry Support",
          ctaLink: "#programs"
        };
      default:
        return {
          title: "Thank You for Reaching Out!",
          subtitle: "We've received your message",
          icon: "✉️",
          description: "Forward Horizon is here to help you on your journey to stable housing and community support.",
          nextSteps: [
            "Check your email for confirmation",
            "We'll respond within 24 hours during business days",
            "Feel free to call us at (626) 603-0954 if urgent"
          ],
          cta: "Return to Homepage",
          ctaLink: "/"
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="text-6xl mb-6">{content.icon}</div>
          
          {/* Main Content */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {firstName ? `${content.title}, ${firstName}!` : content.title}
          </h1>
          
          <p className="text-xl text-blue-600 font-semibold mb-6">
            {content.subtitle}
          </p>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {content.description}
          </p>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next:</h3>
            <ul className="space-y-3">
              {content.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start text-left">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need immediate assistance?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a href="tel:+16266030954" className="flex items-center text-blue-600 hover:text-blue-800 font-semibold">
                <span className="mr-2">📞</span>
                (626) 603-0954
              </a>
              <a href="mailto:admin@theforwardhorizon.com" className="flex items-center text-blue-600 hover:text-blue-800 font-semibold">
                <span className="mr-2">✉️</span>
                admin@theforwardhorizon.com
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={content.ctaLink}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              {content.cta}
            </a>
            <a 
              href="/"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              Return Home
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Forward Horizon - Rebuilding Lives Together</p>
          <p className="text-sm mt-2">Serving Los Angeles County, Orange County, Riverside County & San Bernardino County</p>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}