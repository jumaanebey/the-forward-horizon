'use client';
import { useState } from 'react';
import ModernLayout from '@/components/ModernLayout';
import ModernDashboard from '@/components/ModernDashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModernDashboard />;
      case 'residents':
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Resident Management</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Comprehensive resident management features are being built. This will include profiles, medical records, and program tracking.</p>
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  🚧 Coming Soon
                </div>
              </div>
            </div>
          </div>
        );
      case 'programs':
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Program Management</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Track treatment programs, milestones, and resident progress through their recovery journey.</p>
                <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  🚧 Coming Soon
                </div>
              </div>
            </div>
          </div>
        );
      case 'staff':
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Staff Management</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Manage staff schedules, roles, and assignments across your facility operations.</p>
                <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  🚧 Coming Soon
                </div>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Analytics & Reports</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Generate comprehensive reports and analytics to track facility performance and outcomes.</p>
                <div className="inline-flex items-center px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium">
                  🚧 Coming Soon
                </div>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Calendar & Scheduling</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Schedule appointments, meetings, and activities across your facility with an integrated calendar system.</p>
                <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                  🚧 Coming Soon
                </div>  
              </div>
            </div>
          </div>
        );
      default:
        return <ModernDashboard />;
    }
  };

  return (
    <ModernLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </ModernLayout>
  );
}
