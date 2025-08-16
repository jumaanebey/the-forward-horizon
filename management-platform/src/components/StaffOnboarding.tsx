'use client';

import { useState } from 'react';
import { CheckCircle, Play, BookOpen, Users, Shield, CreditCard, Home, BarChart3 } from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  completed: boolean;
  videoUrl?: string;
  content: string[];
}

export default function StaffOnboarding() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const trainingModules: TrainingModule[] = [
    {
      id: 'welcome',
      title: 'Welcome to Forward Horizon',
      description: 'Introduction to our mission and values',
      duration: '10 minutes',
      icon: <Home className="w-6 h-6" />,
      completed: completedModules.includes('welcome'),
      content: [
        'Our mission to provide supportive housing',
        'Core values: Compassion, Integrity, Excellence',
        'Overview of our programs: Veterans, Recovery, Reentry',
        'Your role in resident success'
      ]
    },
    {
      id: 'system-basics',
      title: 'System Navigation Basics',
      description: 'Learn to navigate the management platform',
      duration: '15 minutes',
      icon: <BookOpen className="w-6 h-6" />,
      completed: completedModules.includes('system-basics'),
      content: [
        'Dashboard overview and key metrics',
        'Resident management interface',
        'Payment tracking system',
        'Document management',
        'Reporting and analytics'
      ]
    },
    {
      id: 'resident-management',
      title: 'Resident Management',
      description: 'How to manage resident information and care',
      duration: '20 minutes',
      icon: <Users className="w-6 h-6" />,
      completed: completedModules.includes('resident-management'),
      content: [
        'Adding new residents to the system',
        'Updating resident information',
        'Tracking resident progress',
        'Managing room assignments',
        'Handling resident concerns'
      ]
    },
    {
      id: 'payment-system',
      title: 'Payment Processing',
      description: 'Understanding the payment and billing system',
      duration: '25 minutes',
      icon: <CreditCard className="w-6 h-6" />,
      completed: completedModules.includes('payment-system'),
      content: [
        'How Stripe payments work',
        'Processing credit card payments',
        'Handling payment issues',
        'Generating payment reports',
        'Managing payment plans'
      ]
    },
    {
      id: 'security-privacy',
      title: 'Security & Privacy',
      description: 'Protecting resident information and data',
      duration: '15 minutes',
      icon: <Shield className="w-6 h-6" />,
      completed: completedModules.includes('security-privacy'),
      content: [
        'HIPAA compliance requirements',
        'Secure handling of resident data',
        'Password security best practices',
        'Reporting security incidents',
        'Data backup and recovery'
      ]
    },
    {
      id: 'analytics-reports',
      title: 'Analytics & Reporting',
      description: 'Using data to improve resident outcomes',
      duration: '20 minutes',
      icon: <BarChart3 className="w-6 h-6" />,
      completed: completedModules.includes('analytics-reports'),
      content: [
        'Understanding key performance indicators',
        'Generating resident reports',
        'Tracking program success rates',
        'Using data for decision making',
        'Sharing insights with stakeholders'
      ]
    }
  ];

  const markModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  const getProgressPercentage = () => {
    return Math.round((completedModules.length / trainingModules.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Staff Training & Onboarding
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to Forward Horizon! Complete these training modules to get started with our management platform.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Training Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {completedModules.length} of {trainingModules.length} modules completed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Training Modules</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {trainingModules.map((module) => (
                  <div
                    key={module.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      activeModule === module.id ? 'bg-blue-50 border-r-4 border-blue-600' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveModule(module.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          module.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {module.completed ? <CheckCircle className="w-5 h-5" /> : module.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{module.title}</h4>
                          <p className="text-sm text-gray-600">{module.duration}</p>
                        </div>
                      </div>
                      {module.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module Content */}
          <div className="lg:col-span-2">
            {activeModule ? (
              <div className="bg-white rounded-lg shadow-sm">
                {(() => {
                  const module = trainingModules.find(m => m.id === activeModule);
                  if (!module) return null;

                  return (
                    <>
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                            <p className="text-gray-600 mt-1">{module.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{module.duration}</span>
                            {module.completed ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            ) : (
                              <button
                                onClick={() => markModuleComplete(module.id)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="prose max-w-none">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">What you'll learn:</h4>
                          <ul className="space-y-3">
                            {module.content.map((item, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {module.videoUrl && (
                          <div className="mt-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Training Video</h4>
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Video content coming soon</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <div className="flex justify-between">
                            <button
                              onClick={() => {
                                const currentIndex = trainingModules.findIndex(m => m.id === activeModule);
                                if (currentIndex > 0) {
                                  setActiveModule(trainingModules[currentIndex - 1].id);
                                }
                              }}
                              disabled={trainingModules.findIndex(m => m.id === activeModule) === 0}
                              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => {
                                const currentIndex = trainingModules.findIndex(m => m.id === activeModule);
                                if (currentIndex < trainingModules.length - 1) {
                                  setActiveModule(trainingModules[currentIndex + 1].id);
                                }
                              }}
                              disabled={trainingModules.findIndex(m => m.id === activeModule) === trainingModules.length - 1}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Training Module</h3>
                <p className="text-gray-600">Choose a module from the list to start your training.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {getProgressPercentage() === 100 && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-900 mb-2">Training Complete!</h3>
              <p className="text-green-700 mb-4">
                Congratulations! You've completed all training modules and are ready to use the Forward Horizon platform.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Access Dashboard
                </button>
                <button className="px-6 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50">
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
