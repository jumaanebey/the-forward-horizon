import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forward Horizon - Transitional Housing for Veterans, Recovering Individuals, and Returning Citizens',
  description: 'Forward Horizon provides transitional housing support for veterans, individuals in recovery, and returning citizens. Safe, structured community support.',
}

export default function Home() {
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
                    <div class="md:hidden flex items-center">
                        <button id="mobile-menu-button" class="text-gray-700 p-3 min-h-[48px] min-w-[48px] flex items-center justify-center hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Mobile menu -->
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t shadow-lg">
                <div class="px-2 pt-4 pb-4 space-y-2">
                    <a href="#home" class="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium min-h-[48px] flex items-center">Home</a>
                    <a href="#programs" class="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium min-h-[48px] flex items-center">Programs</a>
                    <a href="#about" class="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium min-h-[48px] flex items-center">About Us</a>
                    <a href="#admissions" class="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium min-h-[48px] flex items-center">Admissions</a>
                    <a href="#get-involved" class="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium min-h-[48px] flex items-center">Get Involved</a>
                    <a href="#contact" class="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium min-h-[48px] flex items-center">Contact</a>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <header id="home" class="relative bg-cover bg-center text-white" style="background-image: url('/images/American Flag.jpg');">
            <!-- Background overlay for better text readability -->
            <div class="absolute inset-0 bg-black bg-opacity-70"></div>

            <div class="relative max-w-7xl mx-auto px-4 py-24">
                <div class="text-center">
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Forward Horizon</h1>
                    <h2 class="text-xl sm:text-2xl lg:text-3xl font-light mb-4 text-blue-100">
                        Transitional Housing for Veterans, Recovering Individuals, and Returning Citizens
                    </h2>
                    <p class="text-lg sm:text-xl lg:text-2xl font-medium mb-8 text-green-100">
                        Rebuilding Lives Together — Through Accountability, Community, and a Fresh Start
                    </p>


                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#admissions" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 min-h-[48px] flex items-center justify-center text-center">
                            Apply for Housing
                        </a>
                        <a href="#contact" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition duration-300 min-h-[48px] flex items-center justify-center text-center">
                            Inquire
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Featured Programs Section -->
        <section id="programs" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Featured Programs</h2>
                    <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Comprehensive transitional housing programs designed to meet the unique needs of our diverse community members
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8 mb-12">
                    <!-- Veteran Transitional Housing -->
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
                                Specialized support for veterans transitioning to civilian life. We understand the unique challenges of military service and provide tailored resources for successful reintegration.
                            </p>
                            <ul class="text-sm text-gray-600 space-y-2">
                                <li>• VA benefits assistance</li>
                                <li>• PTSD and mental health support</li>
                                <li>• Career transition services</li>
                                <li>• Peer veteran mentorship</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Sober Living After Detox -->
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
                                Continued support for individuals completing detox programs. Our structured environment provides the stability needed for long-term recovery success.
                            </p>
                            <ul class="text-sm text-gray-600 space-y-2">
                                <li>• 24/7 sober living environment</li>
                                <li>• Recovery program coordination</li>
                                <li>• Relapse prevention support</li>
                                <li>• Life skills development</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Re-entry Housing-->
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div class="h-48 bg-gradient-to-br from-purple-600 to-purple-700 relative">
                            <div class="absolute inset-0 bg-purple-600 opacity-90"></div>
                            <div class="relative h-full flex flex-col items-center justify-center text-white px-4">
                                <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 1L8 5V11C8 16.55 11.84 21.74 12 22C12.16 21.74 16 16.55 16 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7Z"/>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-center">Re-entry Housing </h3>
                            </div>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-700 mb-4">
                                Comprehensive reintegration support for individuals returning from incarceration. We provide the tools and community needed for successful Re-entry.
                            </p>
                            <ul class="text-sm text-gray-600 space-y-2">
                                <li>• Employment placement assistance</li>
                                <li>• Legal aid connections</li>
                                <li>• Family reunification support</li>
                                <li>• Community reintegration programs</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <a href="#programs-detail" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 min-h-[48px] flex items-center justify-center text-center inline-flex">
                        Learn More About Our Programs
                    </a>
                </div>
            </div>
        </section>

        <!-- About Us Section -->
        <section id="about" class="py-20 bg-gray-100">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About Us</h2>
                    <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Building bridges to brighter futures through community, accountability, and unwavering support
                    </p>
                </div>

                <!-- Mission Statement -->
                <div class="mb-16">
                    <div class="bg-white rounded-lg shadow-md p-8">
                        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h3>
                        <p class="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                            Forward Horizon exists to provide safe, structured transitional housing and comprehensive support services
                            for veterans, individuals in recovery, and returning citizens. We believe that everyone deserves a second
                            chance and the opportunity to rebuild their lives with dignity, purpose, and community support.
                        </p>
                    </div>
                </div>

                <!-- Facility Image -->
                <div class="mb-16">
                    <div class="h-64 bg-cover bg-center rounded-lg shadow-lg" style="background-image: url('/images/Calm Home.jpg');">
                        <div class="h-full bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                            <h3 class="text-3xl font-bold text-white text-center">Safe, Welcoming Community</h3>
                        </div>
                    </div>
                </div>

                <!-- Our Story -->
                <div class="mb-16">
                    <div class="grid lg:grid-cols-2 gap-8 items-center">
                        <div class="bg-white rounded-lg shadow-md p-8">
                            <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
                            <p class="text-gray-700 leading-relaxed mb-4">
                                Forward Horizon was founded on the belief that transition periods—whether from military service,
                                addiction, or incarceration—are critical moments that require specialized support and understanding.
                            </p>
                            <p class="text-gray-700 leading-relaxed mb-4">
                                Our founders recognized that traditional approaches often failed to address the unique challenges
                                faced by these populations. Through years of community work and personal experience, Forward Horizon
                                emerged as a comprehensive solution that addresses not just housing, but the holistic needs of individuals
                                in transition.
                            </p>
                            <p class="text-gray-700 leading-relaxed">
                                Today, we continue to evolve our programs based on the needs of our residents and the lessons
                                learned from our community's collective journey toward healing and growth.
                            </p>
                        </div>
                        <div class="bg-blue-50 rounded-lg p-8">
                            <h4 class="text-xl font-bold text-gray-900 mb-6">Our Values</h4>
                            <div class="space-y-4">
                                <div class="flex items-start">
                                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <span class="text-white font-bold">A</span>
                                    </div>
                                    <div>
                                        <h5 class="font-semibold text-gray-900">Accountability</h5>
                                        <p class="text-gray-600 text-sm">Personal responsibility and mutual support in our community</p>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <span class="text-white font-bold">S</span>
                                    </div>
                                    <div>
                                        <h5 class="font-semibold text-gray-900">Support</h5>
                                        <p class="text-gray-600 text-sm">Comprehensive assistance for every stage of transition</p>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <span class="text-white font-bold">R</span>
                                    </div>
                                    <div>
                                        <h5 class="font-semibold text-gray-900">Respect</h5>
                                        <p class="text-gray-600 text-sm">Dignity and understanding for every individual's journey</p>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <div class="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <span class="text-white font-bold">G</span>
                                    </div>
                                    <div>
                                        <h5 class="font-semibold text-gray-900">Growth</h5>
                                        <p class="text-gray-600 text-sm">Continuous development of skills, relationships, and purpose</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- Programs & Services Detailed -->
        <section id="programs-detail" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Programs & Services</h2>
                    <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Comprehensive support services designed to address the unique needs of each population we serve
                    </p>
                </div>

                <div class="space-y-16">
                    <!-- Structured Sober Living -->
                    <div class="bg-green-50 rounded-lg p-8">
                        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Structured Sober Living</h3>
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <p class="text-gray-700 mb-4">
                                    Our sober living program provides a safe, substance-free environment with 24/7 support
                                    and structured daily routines designed to support long-term recovery.
                                </p>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• Daily accountability check-ins</li>
                                    <li>• Mandatory recovery meeting participation</li>
                                    <li>• Life skills workshops</li>
                                    <li>• Peer support groups</li>
                                    <li>• Career development assistance</li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="text-xl font-semibold text-gray-900 mb-4">Program Requirements</h4>
                                <ul class="space-y-2 text-gray-600">
                                    <li>• Minimum 30 days of sobriety</li>
                                    <li>• Commitment to house rules</li>
                                    <li>• Active participation in recovery programs</li>
                                    <li>• Employment or job search activities</li>
                                    <li>• Clean background check</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Veteran Re-entry Housing Support -->
                    <div class="bg-blue-50 rounded-lg p-8">
                        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Veteran Re-entry Housing Support</h3>
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <p class="text-gray-700 mb-4">
                                    Specialized services for veterans transitioning to civilian life, addressing the unique
                                    challenges of military service and providing pathway to successful reintegration.
                                </p>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• VA benefits navigation and assistance</li>
                                    <li>• PTSD and mental health support</li>
                                    <li>• Career transition counseling</li>
                                    <li>• Veteran peer mentorship program</li>
                                    <li>• Family reintegration support</li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="text-xl font-semibold text-gray-900 mb-4">Available Resources</h4>
                                <ul class="space-y-2 text-gray-600">
                                    <li>• VA healthcare enrollment</li>
                                    <li>• Disability claims assistance</li>
                                    <li>• Education and training programs</li>
                                    <li>• Job placement services</li>
                                    <li>• Legal aid connections</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Post-Incarceration Transition Program -->
                    <div class="bg-purple-50 rounded-lg p-8">
                        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Post-Incarceration Transition Program</h3>
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <p class="text-gray-700 mb-4">
                                    Comprehensive Re-entry Housing support for returning citizens, focusing on successful community
                                    reintegration and reducing recidivism through holistic support services.
                                </p>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• Employment readiness training</li>
                                    <li>• Legal aid and expungement support</li>
                                    <li>• Family reunification programs</li>
                                    <li>• Financial literacy education</li>
                                    <li>• Community service opportunities</li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="text-xl font-semibold text-gray-900 mb-4">Reintegration Services</h4>
                                <ul class="space-y-2 text-gray-600">
                                    <li>• ID and documentation assistance</li>
                                    <li>• Transportation support</li>
                                    <li>• Healthcare enrollment</li>
                                    <li>• Housing stability planning</li>
                                    <li>• Mentorship matching</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Life Skills & Job Readiness -->
                    <div class="bg-orange-50 rounded-lg p-8">
                        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Life Skills & Job Readiness</h3>
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <p class="text-gray-700 mb-4">
                                    Essential skills development programs that prepare residents for independent living
                                    and sustainable employment opportunities.
                                </p>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• Resume writing and interview skills</li>
                                    <li>• Financial planning and budgeting</li>
                                    <li>• Computer and digital literacy</li>
                                    <li>• Communication and conflict resolution</li>
                                    <li>• Time management and organization</li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="text-xl font-semibold text-gray-900 mb-4">Career Services</h4>
                                <ul class="space-y-2 text-gray-600">
                                    <li>• Job placement assistance</li>
                                    <li>• Trade skills training partnerships</li>
                                    <li>• Professional development workshops</li>
                                    <li>• Employer relationship building</li>
                                    <li>• Follow-up support services</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Admissions Section -->
        <section id="admissions" class="py-20 bg-gray-100">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">How It Works / Admissions</h2>
                    <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Our streamlined admissions process is designed to get you the support you need as quickly as possible
                    </p>
                </div>

                <!-- Eligibility Requirements -->
                <div class="mb-16">
                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Eligibility Requirements</h3>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h4 class="text-xl font-semibold text-gray-900 mb-4 text-center">All Programs</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li>• 18 years of age or older</li>
                                <li>• Commitment to program rules</li>
                                <li>• Willingness to participate in services</li>
                                <li>• No violent criminal history</li>
                                <li>• Pass background screening</li>
                            </ul>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h4 class="text-xl font-semibold text-gray-900 mb-4 text-center">Sober Living</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li>• Minimum 30 days sobriety</li>
                                <li>• Completed detox program</li>
                                <li>• Recovery program participation</li>
                                <li>• Employment or job search</li>
                                <li>• Clean drug/alcohol screening</li>
                            </ul>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <h4 class="text-xl font-semibold text-gray-900 mb-4 text-center">Veteran Program</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li>• Verified military service</li>
                                <li>• Honorable discharge preferred</li>
                                <li>• VA enrollment assistance</li>
                                <li>• Mental health screening</li>
                                <li>• Commitment to peer support</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- What to Expect -->
                <div class="mb-16">
                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">What to Expect</h3>
                    <div class="bg-white rounded-lg shadow-md p-8">
                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 class="text-xl font-semibold text-gray-900 mb-4">Daily Structure</h4>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• 6:00 AM - Wake up and personal care</li>
                                    <li>• 7:00 AM - Community breakfast</li>
                                    <li>• 8:00 AM - Work/job search/services</li>
                                    <li>• 6:00 PM - Community dinner</li>
                                    <li>• 7:00 PM - Group meetings/programs</li>
                                    <li>• 10:00 PM - Quiet hours begin</li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="text-xl font-semibold text-gray-900 mb-4">Living Environment</h4>
                                <ul class="space-y-2 text-gray-700">
                                    <li>• Shared bedrooms (2-3 residents)</li>
                                    <li>• Common areas for meals and activities</li>
                                    <li>• 24/7 staff supervision</li>
                                    <li>• Substance-free environment</li>
                                    <li>• Community chores and responsibilities</li>
                                    <li>• Visitors by appointment only</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Application Process -->
                <div class="mb-16">
                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Step-by-Step Application Process</h3>
                    <div class="grid md:grid-cols-4 gap-6">
                        <div class="text-center">
                            <div class="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                1
                            </div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-2">Application</h4>
                            <p class="text-gray-600 text-sm">Complete online application form with basic information and program interest</p>
                        </div>
                        <div class="text-center">
                            <div class="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                2
                            </div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-2">Interview</h4>
                            <p class="text-gray-600 text-sm">Phone or in-person interview to discuss needs, goals, and program fit</p>
                        </div>
                        <div class="text-center">
                            <div class="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                3
                            </div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-2">Screening</h4>
                            <p class="text-gray-600 text-sm">Background check, references, and documentation review process</p>
                        </div>
                        <div class="text-center">
                            <div class="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                4
                            </div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-2">Move-In</h4>
                            <p class="text-gray-600 text-sm">Intake orientation, move-in coordination, and program enrollment</p>
                        </div>
                    </div>
                </div>

                <!-- Application Form CTA -->
                <div class="text-center">
                    <div class="bg-blue-600 text-white rounded-lg p-8 max-w-2xl mx-auto">
                        <h3 class="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
                        <p class="text-lg mb-6">Take the first step toward rebuilding your life with our supportive community.</p>
                        <a href="#contact" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 min-h-[48px] flex items-center justify-center text-center inline-flex">
                            Complete Application Form
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <!-- Get Involved Section -->
        <section id="get-involved" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Get Involved</h2>
                    <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Join our mission to rebuild lives and strengthen communities through support, partnership, and giving
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8 mb-12">
                    <!-- For Donors -->
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="h-48 bg-gradient-to-br from-green-600 to-green-700">
                            <div class="h-full flex flex-col items-center justify-center text-white px-4">
                                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8.5C14 8.5 16 9.5 16 11.5V14.5C16 15.1 15.6 15.5 15 15.5H13V22H11V15.5H9C8.4 15.5 8 15.1 8 14.5V11.5C8 9.5 10 8.5 12 8.5Z"/>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-center">Donors</h3>
                            </div>
                        </div>
                        <div class="p-8 text-center">
                        <p class="text-gray-700 mb-6">
                            Your financial support directly impacts lives by providing housing, services, and opportunities for our residents.
                        </p>
                        <ul class="text-left text-gray-600 mb-6 space-y-2">
                            <li>• Monthly housing sponsorships</li>
                            <li>• Program-specific donations</li>
                            <li>• One-time contributions</li>
                            <li>• Corporate partnerships</li>
                        </ul>
                        </div>
                    </div>

                    <!-- For Volunteers -->
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="h-48 bg-gradient-to-br from-blue-600 to-blue-700">
                            <div class="h-full flex flex-col items-center justify-center text-white px-4">
                                <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4ZM8 4C10.2 4 12 5.8 12 8C12 10.2 10.2 12 8 12C5.8 12 4 10.2 4 8C4 5.8 5.8 4 8 4ZM8 13C10.7 13 16 14.3 16 17V20H0V17C0 14.3 5.3 13 8 13ZM16 13C18.7 13 24 14.3 24 17V20H18V17C18 15.4 17.2 14.1 15.5 13.4C15.8 13.1 16.9 13 16 13Z"/>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-center">Volunteers</h3>
                            </div>
                        </div>
                        <div class="p-8 text-center">
                        <p class="text-gray-700 mb-6">
                            Share your time and skills to directly support our residents through mentorship, education, and community activities.
                        </p>
                        <ul class="text-left text-gray-600 mb-6 space-y-2">
                            <li>• Mentorship programs</li>
                            <li>• Skills-based workshops</li>
                            <li>• Event planning assistance</li>
                            <li>• Administrative support</li>
                        </ul>
                        </div>
                    </div>

                    <!-- For Community Partners -->
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        <div class="h-48 bg-gradient-to-br from-purple-600 to-purple-700">
                            <div class="h-full flex flex-col items-center justify-center text-white px-4">
                                <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L13.09 8.26L19 6L16.74 11.74L23 12L16.74 12.26L19 18L13.09 15.74L12 22L10.91 15.74L5 18L7.26 12.26L1 12L7.26 11.74L5 6L10.91 8.26L12 2Z"/>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-center">Community Partners</h3>
                            </div>
                        </div>
                        <div class="p-8 text-center">
                        <p class="text-gray-700 mb-6">
                            Organizations and businesses that provide services, employment opportunities, and community connections.
                        </p>
                        <ul class="text-left text-gray-600 mb-6 space-y-2">
                            <li>• Employment partnerships</li>
                            <li>• Service provider network</li>
                            <li>• Resource sharing</li>
                            <li>• Community advocacy</li>
                        </ul>
                        </div>
                    </div>
                </div>

                <!-- Ways to Support -->
                <div class="bg-gray-100 rounded-lg p-8 mb-12">
                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Ways to Support Forward Horizon</h3>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 class="text-xl font-semibold text-gray-900 mb-4">Financial Contributions</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li>• Provides meals for one resident for a week</li>
                                <li>• Supports job training for one resident</li>
                                <li>• Sponsors housing for one resident</li>
                                <li>• Funds comprehensive program services</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-xl font-semibold text-gray-900 mb-4">In-Kind Donations</h4>
                            <ul class="space-y-2 text-gray-700">
                                <li>• Household items and furniture</li>
                                <li>• Professional clothing for job interviews</li>
                                <li>• Transportation vouchers</li>
                                <li>• Computer equipment and technology</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="text-center">
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#contact" class="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 min-h-[48px] flex items-center justify-center text-center">
                            Donate Now
                        </a>
                        <a href="#contact" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 min-h-[48px] flex items-center justify-center text-center">
                            Volunteer Sign-up
                        </a>
                        <a href="#contact" class="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition duration-300 min-h-[48px] flex items-center justify-center text-center">
                            Partner With Us
                        </a>
                    </div>
                </div>
            </div>
        </section>


        <!-- Contact Section -->
        <section id="contact" class="py-20 bg-gray-100">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Contact Us</h2>
                    <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Ready to take the next step? We're here to help guide you through the process and answer your questions.
                    </p>
                </div>

                <div class="grid lg:grid-cols-2 gap-12">
                    <!-- Contact Information -->
                    <div class="bg-white rounded-lg shadow-md p-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>

                        <div class="space-y-6">
                            <div class="flex items-start">
                                <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-900">Phone</h4>
                                    <p class="text-gray-600">(626) 603-0954</p>
                                    <p class="text-sm text-gray-500">24/7 crisis support available</p>
                                </div>
                            </div>

                            <div class="flex items-start">
                                <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-900">Email</h4>
                                    <p class="text-gray-600">admin@theforwardhorizon.com</p>
                                    <p class="text-sm text-gray-500">We respond within 24 hours</p>
                                </div>
                            </div>

                            <div class="flex items-start">
                                <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-900">Location</h4>
                                    <p class="text-gray-600">Serving Los Angeles County, Orange County, Riverside County, & San Bernardino County</p>
                                    <p class="text-sm text-gray-500">Multiple housing locations</p>
                                </div>
                            </div>

                            <div class="border-t pt-6">
                                <h4 class="text-lg font-semibold text-gray-900 mb-4">Office Hours</h4>
                                <div class="space-y-2 text-gray-600">
                                    <div class="flex justify-between">
                                        <span>Monday - Friday:</span>
                                        <span>8:00 AM - 6:00 PM</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Saturday:</span>
                                        <span>9:00 AM - 4:00 PM</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Sunday:</span>
                                        <span>Emergency only</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Form -->
                    <div class="bg-white rounded-lg shadow-md p-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

                        <form id="contact-form" action="/api/submit-form" method="POST" class="space-y-6" novalidate>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input type="text" id="firstName" name="firstName" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] transition-colors duration-200">
                                </div>
                                <div>
                                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input type="text" id="lastName" name="lastName" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] transition-colors duration-200">
                                </div>
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                <input type="email" id="email" name="email" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] transition-colors duration-200">
                            </div>

                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" id="phone" name="phone" class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] transition-colors duration-200" placeholder="(555) 123-4567">
                            </div>

                            <div>
                                <label for="inquiry-type" class="block text-sm font-medium text-gray-700 mb-2">I'm interested in: *</label>
                                <select id="inquiry-type" name="inquiry_type" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] transition-colors duration-200">
                                    <option value="">Select an option</option>
                                    <option value="veteran-housing">Veteran Transitional Housing</option>
                                    <option value="sober-living">Sober Living After Detox</option>
                                    <option value="reentry-housing">Re-entry Housing</option>
                                    <option value="volunteer">Volunteering</option>
                                    <option value="donate">Making a Donation</option>
                                    <option value="partner">Community Partnership</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                <textarea id="message" name="message" rows="4" required class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200" placeholder="Tell us how we can help you or how you'd like to get involved..."></textarea>
                            </div>

                            <button type="submit" class="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 min-h-[48px] text-base">
                                Send Message
                            </button>

                            <p class="text-xs text-gray-500 text-center">We'll respond within 24 hours during business days</p>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-12">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid md:grid-cols-4 gap-8 mb-8">
                    <!-- Organization Info -->
                    <div class="md:col-span-2">
                        <h3 class="text-2xl font-bold mb-4">Forward Horizon</h3>
                        <p class="text-gray-300 mb-4 max-w-md">
                            Transitional Housing for Veterans, Recovering Individuals, and Returning Citizens.
                            Rebuilding lives together through accountability, community, and fresh starts.
                        </p>
                        <div class="flex space-x-4">
                            <!-- Social Media Icons Placeholder -->
                            <a href="#" class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                                <span class="text-sm">FB</span>
                            </a>
                            <a href="#" class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                                <span class="text-sm">TW</span>
                            </a>
                            <a href="#" class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                                <span class="text-sm">IG</span>
                            </a>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul class="space-y-2">
                            <li><a href="#home" class="text-gray-300 hover:text-white transition-colors">Home</a></li>
                            <li><a href="#programs" class="text-gray-300 hover:text-white transition-colors">Programs</a></li>
                            <li><a href="#about" class="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#admissions" class="text-gray-300 hover:text-white transition-colors">Apply</a></li>
                            <li><a href="#get-involved" class="text-gray-300 hover:text-white transition-colors">Get Involved</a></li>
                            <li><a href="#contact" class="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <!-- Contact Info -->
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
                        <div class="space-y-2 text-gray-300">
                            <p>📞 (626) 603-0954</p>
                            <p>✉️ admin@theforwardhorizon.com</p>
                            <p>📍 Los Angeles County, CA</p>
                        </div>
                    </div>
                </div>

                <!-- Bottom Footer -->
                <div class="border-t border-gray-700 pt-8">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <div class="text-gray-400 text-sm mb-4 md:mb-0">
                            &copy; 2024 Forward Horizon. All rights reserved.
                        </div>
                        <div class="flex space-x-6 text-sm">
                            <a href="#privacy" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#terms" class="text-gray-400 hover:text-white transition-colors">Terms of Use</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

        <!-- JavaScript -->
        <script>
            // Mobile menu toggle
            document.getElementById('mobile-menu-button').addEventListener('click', function() {
                const mobileMenu = document.getElementById('mobile-menu');
                mobileMenu.classList.toggle('hidden');
            });

            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    // Close mobile menu if open
                    document.getElementById('mobile-menu').classList.add('hidden');
                });
            });

            // Simple form handling - let the form submit naturally
            document.getElementById('contact-form').addEventListener('submit', function(e) {
                const submitButton = this.querySelector('button[type="submit"]');
                
                // Show loading state
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Let the form submit naturally to the API, which will redirect
            });
        </script>

        <!-- Back to Top Button -->
        <button id="backToTop" class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        </button>

        <script>
            // Back to top button functionality
            const backToTopButton = document.getElementById('backToTop');

            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.remove('hidden');
                } else {
                    backToTopButton.classList.add('hidden');
                }
            });

            backToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        </script>
    </body>
    </html>`
    }} />
  )
}