'use client';
import { useState } from 'react';
import ModernLayout from '@/components/ModernLayout';
import ModernDashboard from '@/components/ModernDashboard';
import ResidentManagement from '@/components/ResidentManagement';
import ProgramManagement from '@/components/ProgramManagement';
import StaffManagement from '@/components/StaffManagement';
import AnalyticsReports from '@/components/AnalyticsReports';
import CalendarScheduling from '@/components/CalendarScheduling';

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
        return <StaffManagement />;
      case 'reports':
        return <AnalyticsReports />;
      case 'calendar':
        return <CalendarScheduling />;
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
