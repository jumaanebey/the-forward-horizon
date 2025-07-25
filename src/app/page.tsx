'use client';
import { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardContent from '@/components/DashboardContent';
import ReportsContent from '@/components/ReportsContent';
import CalendarContent from '@/components/CalendarContent';
import ProgramsContent from '@/components/ProgramsContent';
import StaffContent from '@/components/StaffContent';
import SettingsContent from '@/components/SettingsContent';
import ResidentsList from '../components/ResidentsList';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'residents':
        return <DashboardContent />; // For now, residents is same as dashboard
      case 'reports':
        return <ReportsContent />;
      case 'calendar':
        return <CalendarContent />;
      case 'programs':
        return <ProgramsContent />;
      case 'staff':
        return <StaffContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      <ResidentsList />
    </Layout>
  );
}
