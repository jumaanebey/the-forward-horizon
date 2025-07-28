'use client';
import { useState } from 'react';
import ModernLayout from '@/components/ModernLayout';
import ModernDashboard from '@/components/ModernDashboard';
import ResidentManagement from '@/components/ResidentManagement';
import ProgramManagement from '@/components/ProgramManagement';
import StaffManagement from '@/components/StaffManagement';
import AnalyticsReports from '@/components/AnalyticsReports';
// import CalendarScheduling from '@/components/CalendarScheduling'; // Temporarily disabled due to syntax error
import DocumentManagement from '@/components/DocumentManagement';
import HousingInventory from '@/components/HousingInventory';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModernDashboard onNavigate={setActiveTab} />;
      case 'residents':
        return <ResidentManagement />;
      case 'programs':
        return <ProgramManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'reports':
        return <AnalyticsReports />;
      case 'calendar':
        return <div className="p-6"><div className="text-center py-8"><h3 className="text-lg font-medium text-gray-900 mb-2">Calendar Temporarily Disabled</h3><p className="text-gray-600">Calendar component is being fixed and will be available soon.</p></div></div>;
      case 'documents':
        return <DocumentManagement />;
      case 'housing':
        return <HousingInventory />;
      default:
        return <ModernDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <ModernLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </ModernLayout>
  );
}
