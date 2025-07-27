'use client';
import { useState, useEffect } from 'react';
import { trackFormSubmission, trackPageView, trackCTAClick } from '../../components/Analytics';
import StructuredData from '../../components/StructuredData';

export default function ReentrySupportLanding() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackPageView('Re-entry Support Landing Page');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          email,
          formType: 're-entry'
        }),
      });

      if (response.ok) {
        trackFormSubmission('re-entry', email);
        setIsSubmitted(true);
      } else {
        alert('There was an error sending your guide. Please try again.');
      }
    } catch (error) {
      alert('There was an error sending your guide. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Fresh Start Begins Now, {firstName}!</h2>
          <p className="text-gray-600 mb-6">
            Your Re-entry Planning Kit is being delivered to your inbox. These resources will help you build your path forward.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-800">
              <strong>Next Step:</strong> Visit Forward Horizon to learn about our supportive community and housing program.
            </p>
          </div>
          <a
            href="https://theforwardhorizon.com"
            className="inline-block w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            onClick={() => trackCTAClick('thank_you_cta', 'main_website')}
          >
            Explore Forward Horizon →
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <StructuredData type="re-entry" />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FH</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Forward Horizon</h1>
                <p className="text-sm text-gray-500">Re-entry Support Program</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm text-gray-600">Need Help?</span>
              <a href="tel:+1-626-603-0954" className="text-purple-600 font-semibold text-lg hover:text-purple-700">
                (626) 603-0954
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div>
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🏠 Re-entry Housing Support
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Stable Housing for Your 
              <span className="text-purple-600"> Fresh Start</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your past doesn't define your future. Join a community that believes in second chances and provides the support you need to build a successful, independent life.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Safe, Affordable Housing</h3>
                  <p className="text-gray-600">Clean, secure rooms with all utilities included at affordable rates</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Employment Assistance</h3>
                  <p className="text-gray-600">Job placement services and partnerships with second-chance employers</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Legal & Documentation Support</h3>
                  <p className="text-gray-600">Help with ID replacement, legal aid referrals, and record sealing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Life Skills & Financial Literacy</h3>
                  <p className="text-gray-600">Budget management, banking, and independent living skills training</p>
                </div>
              </div>
            </div>

            {/* Program Commitment */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Our Commitment to You</h4>
                  <div className="text-purple-600 font-medium">Evidence-Based Re-entry Support</div>
                </div>
              </div>
              <p className="text-gray-700">
                Forward Horizon is committed to providing comprehensive re-entry support based on proven best practices. We believe in second chances and are dedicated to helping you build the stable, independent life you deserve through individualized planning and community support.
              </p>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden">
              <a
                href="https://theforwardhorizon.com"
                className="inline-block w-full bg-purple-600 text-white text-center py-4 px-6 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors mb-4"
              >
                Start Your Fresh Start →
              </a>
              <p className="text-center text-sm text-gray-500">
                Or get your free planning kit first ↓
              </p>
            </div>
          </div>

          {/* Right Column - Lead Capture Form */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2 0V3m0 2v2m0-2h2m-2 0H9m2 0v2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Your Free Re-entry Kit
                </h2>
                <p className="text-gray-600">
                  Download our complete planning guide with checklists, resources, and step-by-step guidance for your re-entry
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Kit...
                    </span>
                  ) : (
                    'Get Free Re-entry Planning Kit'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  100% confidential. We respect your privacy.
                </p>
              </form>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    No Judgment
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Second Chances
                  </div>
                </div>
              </div>
            </div>

            {/* Additional CTA */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">Ready to apply now?</p>
              <a
                href="https://theforwardhorizon.com"
                className="inline-block bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Explore Forward Horizon →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Program Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Our Program Different</h2>
            <p className="text-xl text-gray-600">Comprehensive support designed for your success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">90+</div>
              <div className="text-gray-600">Day Program</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">1:1</div>
              <div className="text-gray-600">Case Management</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Commitment</div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Provide */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Re-entry Support</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Employment Ready</h3>
              <p className="text-gray-600">Resume building, interview prep, and connections with employers who believe in second chances.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2 0V3m0 2v2m0-2h2m-2 0H9m2 0v2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Navigation</h3>
              <p className="text-gray-600">Assistance with documentation, legal aid referrals, and understanding your rights and responsibilities.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Stability</h3>
              <p className="text-gray-600">Budget management, banking setup, credit repair guidance, and financial literacy education.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">FH</span>
            </div>
            <span className="text-xl font-bold">Forward Horizon</span>
          </div>
          <p className="text-gray-400 mb-4">Supporting your re-entry with stable housing and comprehensive services</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="tel:+1-626-603-0954" className="text-purple-400 hover:text-purple-300">
              📞 (626) 603-0954
            </a>
            <a href="https://theforwardhorizon.com" className="text-purple-400 hover:text-purple-300">
              🌐 theforwardhorizon.com
            </a>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}