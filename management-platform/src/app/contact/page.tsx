import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Forward Horizon - Get Help Today',
  description: 'Contact Forward Horizon for transitional housing, veteran support, recovery housing, and reentry services. We\'re here to help 24/7.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="https://theforwardhorizon.com" className="text-2xl font-bold text-blue-600">Forward Horizon</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://theforwardhorizon.com" className="text-gray-700 hover:text-blue-600">← Back to Main Site</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Contact Forward Horizon</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to take the next step? We're here to help guide you through the process and answer your questions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              <form id="contact-form" action="/api/submit-form" method="POST" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      required 
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      required 
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]" 
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-type" className="block text-sm font-medium text-gray-700 mb-2">I'm interested in: *</label>
                  <select 
                    id="inquiry-type" 
                    name="inquiry_type" 
                    required 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                  >
                    <option value="">Select an option</option>
                    <option value="veteran-housing">Veteran Transitional Housing</option>
                    <option value="sober-living">Sober Living After Detox</option>
                    <option value="Re-entry-housing">Re-entry Housing</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="donate">Making a Donation</option>
                    <option value="partner">Community Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Tell us how we can help you or how you'd like to get involved..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 min-h-[48px] text-base"
                >
                  Send Message
                </button>

                <p className="text-xs text-gray-500 text-center">We'll respond within 24 hours during business days</p>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">(626) 603-0954</p>
                    <p className="text-sm text-gray-500">24/7 crisis support available</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">admin@theforwardhorizon.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Location</h4>
                    <p className="text-gray-600">Serving Los Angeles County, Orange County, Riverside County, & San Bernardino County</p>
                    <p className="text-sm text-gray-500">Multiple housing locations</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span>9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Emergency only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}