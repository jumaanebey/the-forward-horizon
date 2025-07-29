import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forward Horizon - Transitional Housing for Veterans, Recovering Individuals, and Returning Citizens',
  description: 'Forward Horizon provides structured transitional housing for veterans, individuals in recovery, and returning citizens. Rebuilding lives through accountability, community, and fresh starts.',
}

export default function MainSite() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forward Horizon - Transitional Housing for Veterans, Recovering Individuals, and Returning Citizens</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#2563eb',
                        secondary: '#1e40af',
                        accent: '#059669'
                    }
                }
            }
        }
    </script>
    <style>
        /* Custom styles for the main site */
        body { margin: 0; padding: 0; }
        
        /* Custom animations */
        @keyframes sparkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        .animate-sparkle {
            animation: sparkle 2s ease-in-out infinite;
        }
        
        /* Enhanced button styles */
        .btn-gradient {
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            background-size: 200% 200%;
            animation: gradient-shift 3s ease infinite;
        }
        
        @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Form field enhancements */
        .form-field:focus {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 w-full z-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="#" class="text-2xl font-bold text-blue-600">Forward Horizon</a>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#home" class="text-gray-700 hover:text-blue-600">Home</a>
                    <a href="#programs" class="text-gray-700 hover:text-blue-600">Programs</a>
                    <a href="#about" class="text-gray-700 hover:text-blue-600">About Us</a>
                    <a href="#admissions" class="text-gray-700 hover:text-blue-600">Admissions</a>
                    <a href="#get-involved" class="text-gray-700 hover:text-blue-600">Get Involved</a>
                    <a href="#contact" class="text-gray-700 hover:text-blue-600">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Contact Form Section -->
    <section id="contact" class="py-20 bg-gray-100">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Ready to take the next step? We're here to help guide you through the process and answer your questions.
                </p>
            </div>

            <div class="grid lg:grid-cols-2 gap-12">
                <!-- Contact Form -->
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

                    <form id="contact-form" action="/api/submit-form" method="POST" class="space-y-6" novalidate>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                <input type="text" id="firstName" name="firstName" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]">
                            </div>
                            <div>
                                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                <input type="text" id="lastName" name="lastName" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]">
                            </div>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                            <input type="email" id="email" name="email" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]">
                        </div>

                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" id="phone" name="phone" class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]" placeholder="(555) 123-4567">
                        </div>

                        <div>
                            <label for="inquiry-type" class="block text-sm font-medium text-gray-700 mb-2">I'm interested in: *</label>
                            <select id="inquiry-type" name="inquiry_type" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]">
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
                            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                            <textarea id="message" name="message" rows="4" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tell us how we can help you or how you'd like to get involved..."></textarea>
                        </div>

                        <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 min-h-[48px] text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transform">
                            <span class="mr-2">✨</span>Send Message<span class="ml-2">🚀</span>
                        </button>

                        <p class="text-xs text-gray-500 text-center">We'll respond within 24 hours during business days</p>
                    </form>
                </div>

                <!-- Contact Information -->
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
                    <div class="space-y-6">
                        <div class="flex items-start">
                            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                                <span class="text-white">📞</span>
                            </div>
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900">Phone</h4>
                                <p class="text-gray-600">(626) 603-0954</p>
                                <p class="text-sm text-gray-500">24/7 crisis support available</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                                <span class="text-white">✉️</span>
                            </div>
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900">Email</h4>
                                <p class="text-gray-600">admin@theforwardhorizon.com</p>
                                <p class="text-sm text-gray-500">We respond within 24 hours</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                                <span class="text-white">📍</span>
                            </div>
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900">Location</h4>
                                <p class="text-gray-600">Serving Los Angeles County, Orange County, Riverside County, & San Bernardino County</p>
                                <p class="text-sm text-gray-500">Multiple housing locations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Enhanced form handling with proper redirect support
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            const form = this;
            const submitButton = form.querySelector('button[type="submit"]');
            const formData = new FormData(form);
            
            // Show delightful loading state
            submitButton.innerHTML = '✨ Sending your message...';
            submitButton.disabled = true;
            submitButton.style.background = 'linear-gradient(45deg, #3b82f6, #8b5cf6)';
            
            // Submit form via fetch to handle the response properly
            fetch('/api/submit-form', {
                method: 'POST',
                body: formData
            })
            .then(async response => {
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('text/html')) {
                    // Handle HTML redirect response
                    const htmlContent = await response.text();
                    document.body.innerHTML = htmlContent;
                } else {
                    // Handle JSON response (fallback)
                    const data = await response.json();
                    if (data.success) {
                        // Redirect manually if API doesn't redirect
                        const firstName = formData.get('firstName');
                        const inquiryType = formData.get('inquiry_type');
                        window.location.href = \`https://app.theforwardhorizon.com/thank-you?type=\${inquiryType}&name=\${firstName}\`;
                    } else {
                        throw new Error(data.error || 'Something went wrong');
                    }
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                
                // Show delightful error state
                submitButton.innerHTML = '❌ Oops! Please try again';
                submitButton.style.background = '#ef4444';
                submitButton.disabled = false;
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = 'Send Message';
                    submitButton.style.background = '#2563eb';
                }, 3000);
                
                // Show user-friendly error message
                alert('There was an issue sending your message. Please try again or call us at (626) 603-0954.');
            });
        });
    </script>
</body>
</html>`
    }} />
  )
}