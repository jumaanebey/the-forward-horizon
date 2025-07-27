'use client';
import { useState, useEffect } from 'react';
import { trackFormSubmission, trackPageView, trackCTAClick } from '../../components/Analytics';
import StructuredData from '../../components/StructuredData';

export default function RecoveryHousingLanding() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackPageView('Recovery Housing Landing Page');
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
          formType: 'recovery'
        }),
      });

      if (response.ok) {
        trackFormSubmission('recovery', email);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Recovery Journey, {firstName}!</h2>
          <p className="text-gray-600 mb-6">
            Your Recovery Housing Guide is on its way to your inbox. This is the first step toward your new life.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Take Action Now:</strong> Visit Forward Horizon to learn about our recovery community and start your application.
            </p>
          </div>
          <a
            href="https://theforwardhorizon.com"
            className="inline-block w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            onClick={() => trackCTAClick('thank_you_cta', 'main_website')}
          >
            Start Your Recovery Journey →
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <StructuredData type="recovery" />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FH</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Forward Horizon</h1>
                <p className="text-sm text-gray-500">Recovery Housing Program</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span className="text-sm text-gray-600">24/7 Support:</span>
              <a href="tel:+1-626-603-0954" className="text-green-600 font-semibold text-lg hover:text-green-700">
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
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🌱 Recovery-Focused Community
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Safe, Sober Housing for Your 
              <span className="text-green-600"> Recovery Journey</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Recovery is more than staying clean—it's building a new life. Join a supportive community where sobriety isn't just encouraged, it's celebrated every day.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Substance-Free Environment</h3>
                  <p className="text-gray-600">Completely drug and alcohol-free facility with regular accountability</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Peer Support Community</h3>
                  <p className="text-gray-600">Live with others who understand your journey and support your goals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Life Skills & Job Training</h3>
                  <p className="text-gray-600">Build practical skills for independent living and career success</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Support & Counseling</h3>
                  <p className="text-gray-600">Professional staff and peer mentors available around the clock</p>
                </div>
              </div>
            </div>

            {/* Success Story */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">MR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Maria R., 2 Years Sober</h4>
                  <div className="flex text-yellow-400">
                    ★★★★★
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Forward Horizon saved my life. The community here doesn't just help you stay sober—they help you rebuild everything. I have a job, an apartment, and most importantly, hope."
              </p>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden">
              <a
                href="https://theforwardhorizon.com"
                className="inline-block w-full bg-green-600 text-white text-center py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors mb-4"
              >
                Start Your Recovery Journey →
              </a>
              <p className="text-center text-sm text-gray-500">
                Or get your free guide first ↓
              </p>
            </div>
          </div>

          {/* Right Column - Lead Capture Form */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Your Free Recovery Guide
                </h2>
                <p className="text-gray-600">
                  Download our comprehensive guide to prepare for sober living and build your support network
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Guide...
                    </span>
                  ) : (
                    'Get Free Recovery Guide'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Your privacy is protected. No spam, ever.
                </p>
              </form>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Confidential
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Compassionate Care
                  </div>
                </div>
              </div>
            </div>

            {/* Additional CTA */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">Ready to start today?</p>
              <a
                href="https://theforwardhorizon.com"
                className="inline-block bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Apply to Forward Horizon →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Success Metrics */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recovery Success Stories</h2>
            <p className="text-xl text-gray-600">Real results from our community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">89%</div>
              <div className="text-gray-600">Maintain Sobriety</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">250+</div>
              <div className="text-gray-600">Lives Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Find Employment</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Forward Horizon?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Community</h3>
              <p className="text-gray-600">Our residents support each other through every challenge and celebrate every victory together.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Structured Program</h3>
              <p className="text-gray-600">Clear expectations, regular check-ins, and structured activities that build healthy routines.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Life Transformation</h3>
              <p className="text-gray-600">We don't just provide housing—we help you build the skills and confidence for independent success.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">FH</span>
            </div>
            <span className="text-xl font-bold">Forward Horizon</span>
          </div>
          <p className="text-gray-400 mb-4">Supporting your recovery journey with safe, sober housing</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="tel:+1-626-603-0954" className="text-green-400 hover:text-green-300">
              📞 (626) 603-0954
            </a>
            <a href="https://theforwardhorizon.com" className="text-green-400 hover:text-green-300">
              🌐 theforwardhorizon.com
            </a>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}