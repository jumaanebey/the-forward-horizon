'use client';
import { useState } from 'react';
import ModernLayout from '@/components/ModernLayout';
import ModernDashboard from '@/components/ModernDashboard';
import ResidentManagement from '@/components/ResidentManagement';
import ProgramManagement from '@/components/ProgramManagement';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModernDashboard />;
      case 'residents':
        return <ResidentManagement />;
      case 'programs':
        return <ProgramManagement />;
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
