import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forward Horizon - Get Started',
  description: 'Choose your path to recovery and rebuilding with Forward Horizon.',
}

export default function LeadCapture() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forward Horizon - Get Started</title>
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
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="/" class="text-2xl font-bold text-blue-600">Forward Horizon</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative bg-cover bg-center text-white" style="background-image: url('/images/American Flag.jpg');">
        <div class="absolute inset-0 bg-black bg-opacity-70"></div>
        <div class="relative max-w-7xl mx-auto px-4 py-24">
            <div class="text-center">
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Choose Your Path</h1>
                <h2 class="text-xl sm:text-2xl lg:text-3xl font-light mb-8 text-blue-100">
                    Select the program that best fits your journey
                </h2>
            </div>
        </div>
    </div>

    <!-- Three Options Section -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Which Program Interests You?</h2>
                <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                    Tell us about yourself and we'll guide you to the right program for your needs
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 mb-16">
                <!-- Veterans Option -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div class="h-48 bg-cover bg-center relative" style="background-image: url('/images/veteran.jpg');">
                        <div class="absolute inset-0 bg-blue-600 bg-opacity-75"></div>
                        <div class="relative h-full flex flex-col items-center justify-center text-white px-4">
                            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L13.09 8.26L19 6L16.74 11.74L23 12L16.74 12.26L19 18L13.09 15.74L12 22L10.91 15.74L5 18L7.26 12.26L1 12L7.26 11.74L5 6L10.91 8.26L12 2Z"/>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-center">Veteran Transitional Housing</h3>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-700 mb-4">
                            Specialized support for veterans transitioning to civilian life with VA benefits assistance, PTSD support, and career transition services.
                        </p>
                        <button onclick="selectProgram('veteran')" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                            Choose This Program
                        </button>
                    </div>
                </div>

                <!-- Recovery Option -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div class="h-48 bg-gradient-to-br from-green-600 to-green-700 relative">
                        <div class="absolute inset-0 bg-green-600 opacity-90"></div>
                        <div class="relative h-full flex flex-col items-center justify-center text-white px-4">
                            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9L12 8L9 9V7.5L3 7V9L7 10.5V15C7 16.1 7.9 17 9 17H15C16.1 17 17 16.1 17 15V10.5L21 9ZM12 10.5L15 11.5V15H9V11.5L12 10.5Z"/>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-center">Sober Living After Detox</h3>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-700 mb-4">
                            Continued support for individuals completing detox programs with 24/7 sober living environment and recovery program coordination.
                        </p>
                        <button onclick="selectProgram('recovery')" class="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">
                            Choose This Program
                        </button>
                    </div>
                </div>

                <!-- Re-entry Option -->
                <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div class="h-48 bg-gradient-to-br from-purple-600 to-purple-700 relative">
                        <div class="absolute inset-0 bg-purple-600 opacity-90"></div>
                        <div class="relative h-full flex flex-col items-center justify-center text-white px-4">
                            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 1L8 5V11C8 16.55 11.84 21.74 12 22C12.16 21.74 16 16.55 16 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7Z"/>
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-center">Re-entry Housing</h3>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-gray-700 mb-4">
                            Comprehensive reintegration support for individuals returning from incarceration with employment assistance and family reunification.
                        </p>
                        <button onclick="selectProgram('reentry')" class="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300">
                            Choose This Program
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Lead Capture Form (Hidden by default) -->
    <section id="lead-form" class="py-20 bg-gray-100 hidden">
        <div class="max-w-2xl mx-auto px-4">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Tell Us About Yourself</h2>
                <p class="text-gray-600 mb-8 text-center">We'll use this information to connect you with the right program and resources.</p>
                
                <form id="lead-capture-form" class="space-y-6">
                    <input type="hidden" id="selected-program" name="program" value="">
                    
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                            <input type="text" id="firstName" name="firstName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 123-4567">
                    </div>

                    <div>
                        <label for="age" class="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                        <input type="number" id="age" name="age" required min="18" max="100" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>

                    <div>
                        <label for="location" class="block text-sm font-medium text-gray-700 mb-2">Current Location (City, State) *</label>
                        <input type="text" id="location" name="location" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Los Angeles, CA">
                    </div>

                    <div>
                        <label for="urgency" class="block text-sm font-medium text-gray-700 mb-2">How soon do you need housing? *</label>
                        <select id="urgency" name="urgency" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select an option</option>
                            <option value="immediate">Immediately (within 1 week)</option>
                            <option value="soon">Soon (within 1 month)</option>
                            <option value="planning">Planning ahead (1-3 months)</option>
                            <option value="researching">Just researching options</option>
                        </select>
                    </div>

                    <div>
                        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Tell us about your situation (optional)</label>
                        <textarea id="message" name="message" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any additional information that would help us assist you..."></textarea>
                    </div>

                    <div class="flex items-center">
                        <input type="checkbox" id="consent" name="consent" required class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <label for="consent" class="ml-2 block text-sm text-gray-700">
                            I consent to Forward Horizon contacting me about housing opportunities and services. *
                        </label>
                    </div>

                    <button type="submit" class="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        Submit Information
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <h3 class="text-2xl font-bold mb-4">Forward Horizon</h3>
            <p class="text-gray-300 mb-4">
                Transitional Housing for Veterans, Recovering Individuals, and Returning Citizens.
            </p>
            <div class="text-gray-400 text-sm">
                &copy; 2024 Forward Horizon. All rights reserved.
            </div>
        </div>
    </footer>

    <script>
        function selectProgram(program) {
            // Store the selected program
            document.getElementById('selected-program').value = program;
            
            // Show the lead capture form
            document.getElementById('lead-form').classList.remove('hidden');
            
            // Scroll to the form
            document.getElementById('lead-form').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }

        document.getElementById('lead-capture-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to your backend
            // For now, we'll simulate a successful submission
            setTimeout(() => {
                // Redirect to the main marketing page
                window.location.href = '/';
            }, 2000);
        });
    </script>
</body>
</html>`
    }} />
  )
}
