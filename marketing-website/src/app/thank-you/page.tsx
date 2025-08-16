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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="max-w-2xl w-full relative z-10">
        {/* Success Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/20 transform hover:scale-105 transition-all duration-300">
          {/* Animated Icon */}
          <div className="text-7xl mb-6 animate-bounce">{content.icon}</div>
          
          {/* Sparkle Animation */}
          <div className="absolute top-8 right-8 text-2xl animate-spin">✨</div>
          <div className="absolute top-12 left-8 text-xl animate-pulse">🌟</div>
          <div className="absolute bottom-12 right-12 text-lg animate-bounce animation-delay-1000">💫</div>
          
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <span className="mr-2">🎯</span>
              What happens next:
            </h3>
            <ul className="space-y-3">
              {content.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start text-left group">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-200">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-center">
              <span className="mr-2">🤝</span>
              Need immediate assistance?
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8">
              <a href="tel:+16266030954" className="flex items-center text-blue-600 hover:text-blue-800 font-semibold bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <span className="mr-2 text-lg">📞</span>
                (626) 603-0954
              </a>
              <a href="mailto:admin@theforwardhorizon.com" className="flex items-center text-blue-600 hover:text-blue-800 font-semibold bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <span className="mr-2 text-lg">✉️</span>
                admin@theforwardhorizon.com
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={content.ctaLink}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
            >
              <span className="mr-2">🚀</span>
              {content.cta}
            </a>
            <a 
              href="/"
              className="border-2 border-gradient bg-gradient-to-r from-transparent to-transparent hover:from-blue-50 hover:to-purple-50 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 transform"
            >
              <span className="mr-2">🏠</span>
              Return Home
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <p className="font-semibold text-gray-800 flex items-center justify-center">
            <span className="mr-2">🌟</span>
            Forward Horizon - Rebuilding Lives Together
            <span className="ml-2">🌟</span>
          </p>
          <p className="text-sm mt-2 text-gray-600">Serving Los Angeles County, Orange County, Riverside County & San Bernardino County</p>
          <div className="flex justify-center space-x-2 mt-3 text-2xl">
            <span className="animate-pulse">🏡</span>
            <span className="animate-pulse animation-delay-1000">💙</span>
            <span className="animate-pulse animation-delay-2000">🤝</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <>
      <style jsx global>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
      
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center">
          <div className="text-2xl font-semibold text-gray-700 animate-pulse">
            <span className="mr-2">✨</span>
            Loading your success page...
            <span className="ml-2">🚀</span>
          </div>
        </div>
      }>
        <ThankYouContent />
      </Suspense>
    </>
  );
}