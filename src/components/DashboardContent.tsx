'use client';
import { useState } from 'react';
import AddResidentForm from '@/components/AddResidentForm';
import EditResidentForm from '@/components/EditResidentForm';
import MedicalRecordsModal from '@/components/MedicalRecordsModal';
import PaymentTrackingModal from '@/components/PaymentTrackingModal';
import DisciplinaryModal from '@/components/DisciplinaryModal';
import ProgressTrackingModal from '@/components/ProgressTrackingModal';
import DashboardStats from '@/components/DashboardStats';
import ReportsPanel from '@/components/ReportsPanel';
import IntegrationPanel from '@/components/IntegrationPanel';
import PaymentTracking from '@/components/PaymentTracking';
import SchedulingSystem from '@/components/SchedulingSystem';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import InventoryManagement from '@/components/InventoryManagement';
import MaintenanceTracker from '@/components/MaintenanceTracker';
import AIAssistant from '@/components/AIAssistant';
import SmartNotifications from '@/components/SmartNotifications';
import MobileApp from '@/components/MobileApp';
import PushNotifications from '@/components/PushNotifications';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import AIPredictions from '@/components/AIPredictions';

export default function DashboardContent() {
  // State for residents data
  const [residents, setResidents] = useState([
    { id: 1, name: "John Smith", room: "A-101", status: "Active", entryDate: "2024-01-15" },
    { id: 2, name: "Sarah Johnson", room: "B-203", status: "Active", entryDate: "2024-02-10" },
    { id: 3, name: "Michael Brown", room: "A-105", status: "Pending", entryDate: "2024-03-01" },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showPaymentTracking, setShowPaymentTracking] = useState(false);
  const [paymentResident, setPaymentResident] = useState(null);
  const [showDisciplinary, setShowDisciplinary] = useState(false);
  const [disciplinaryResident, setDisciplinaryResident] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progressResident, setProgressResident] = useState(null);
  const [showReportsPanel, setShowReportsPanel] = useState(false);
  const [showIntegrationPanel, setShowIntegrationPanel] = useState(false);
  const [showSchedulingSystem, setShowSchedulingSystem] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [showInventoryManagement, setShowInventoryManagement] = useState(false);
  const [showMaintenanceTracker, setShowMaintenanceTracker] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showSmartNotifications, setShowSmartNotifications] = useState(false);
  const [showMobileApp, setShowMobileApp] = useState(false);
  const [showPushNotifications, setShowPushNotifications] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [showAIPredictions, setShowAIPredictions] = useState(false);

  const handleAddResident = (newResident: any) => {
    setResidents([...residents, newResident]);
  };

  const handleEditResident = (resident: any) => {
    setEditingResident(resident);
    setShowEditForm(true);
  };

  const handleUpdateResident = (updatedResident: any) => {
    setResidents(residents.map(r => r.id === updatedResident.id ? updatedResident : r));
  };

  const handleDeleteResident = (residentId: number) => {
    if (confirm('Are you sure you want to delete this resident?')) {
      setResidents(residents.filter(r => r.id !== residentId));
    }
  };

  const handleViewMedicalRecords = (resident: any) => {
    setSelectedResident(resident);
    setShowMedicalRecords(true);
  };

  const handleViewPayments = (resident: any) => {
    setPaymentResident(resident);
    setShowPaymentTracking(true);
  };

  const handleViewDisciplinary = (resident: any) => {
    setDisciplinaryResident(resident);
    setShowDisciplinary(true);
  };

  const handleViewProgress = (resident: any) => {
    setProgressResident(resident);
    setShowProgress(true);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Residents</h2>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setShowAIPredictions(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Predictions
                  </button>
                  <button
                    onClick={() => setShowPerformanceMonitor(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-md hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Performance
                  </button>
                  <button
                    onClick={() => setShowMobileApp(true)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Mobile App
                  </button>
                  <button
                    onClick={() => setShowPushNotifications(true)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md hover:from-pink-700 hover:to-rose-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006 3h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    Push Alerts
                  </button>
                  <button
                    onClick={() => setShowAIAssistant(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Assistant
                  </button>
                  <button
                    onClick={() => setShowSmartNotifications(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md hover:from-blue-700 hover:to-cyan-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006 3h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    Smart Alerts
                  </button>
                  <button
                    onClick={() => setShowMaintenanceTracker(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Maintenance
                  </button>
                  <button
                    onClick={() => setShowInventoryManagement(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Inventory
                  </button>
                  <button
                    onClick={() => setShowAdvancedAnalytics(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </button>
                  <button
                    onClick={() => setShowSchedulingSystem(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule
                  </button>
                  <button
                    onClick={() => setShowPaymentTracking(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Payments
                  </button>
                  <button
                    onClick={() => setShowIntegrationPanel(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Integrations
                  </button>
                  <button
                    onClick={() => setShowReportsPanel(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Reports
                  </button>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Resident
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {residents.map((resident) => (
                    <tr key={resident.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{resident.room}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          resident.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {resident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {resident.entryDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => handleViewMedicalRecords(resident)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Medical
                          </button>
                          <button 
                            onClick={() => handleViewPayments(resident)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Payments
                          </button>
                          <button 
                            onClick={() => handleViewDisciplinary(resident)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Disciplinary
                          </button>
                          <button 
                            onClick={() => handleViewProgress(resident)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Progress
                          </button>
                          <button 
                            onClick={() => handleEditResident(resident)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteResident(resident.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm font-medium">Add New Resident</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm font-medium">View Reports</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Schedule Appointment</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">John Smith completed 30-day milestone</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">New resident Sarah Johnson admitted</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Payment reminder sent to Michael Brown</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddForm && (
        <AddResidentForm
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddResident}
        />
      )}

      {showEditForm && editingResident && (
        <EditResidentForm
          resident={editingResident}
          onClose={() => {
            setShowEditForm(false);
            setEditingResident(null);
          }}
          onUpdate={handleUpdateResident}
        />
      )}

      {showMedicalRecords && selectedResident && (
        <MedicalRecordsModal
          resident={selectedResident}
          onClose={() => {
            setShowMedicalRecords(false);
            setSelectedResident(null);
          }}
        />
      )}

      {showPaymentTracking && paymentResident && (
        <PaymentTrackingModal
          resident={paymentResident}
          onClose={() => {
            setShowPaymentTracking(false);
            setPaymentResident(null);
          }}
        />
      )}

      {showDisciplinary && disciplinaryResident && (
        <DisciplinaryModal
          resident={disciplinaryResident}
          onClose={() => {
            setShowDisciplinary(false);
            setDisciplinaryResident(null);
          }}
        />
      )}

      {showProgress && progressResident && (
        <ProgressTrackingModal
          resident={progressResident}
          onClose={() => {
            setShowProgress(false);
            setProgressResident(null);
          }}
        />
      )}

      {/* Reports Panel */}
      <ReportsPanel
        residents={residents}
        isOpen={showReportsPanel}
        onClose={() => setShowReportsPanel(false)}
      />
      
      {/* Integration Panel */}
      <IntegrationPanel
        isOpen={showIntegrationPanel}
        onClose={() => setShowIntegrationPanel(false)}
      />

      {/* Payment Tracking */}
      <PaymentTracking
        resident={selectedResident}
        isOpen={showPaymentTracking}
        onClose={() => setShowPaymentTracking(false)}
      />

      {/* Scheduling System */}
      <SchedulingSystem
        isOpen={showSchedulingSystem}
        onClose={() => setShowSchedulingSystem(false)}
      />

      {/* Advanced Analytics */}
      <AdvancedAnalytics
        isOpen={showAdvancedAnalytics}
        onClose={() => setShowAdvancedAnalytics(false)}
      />

      {/* Inventory Management */}
      <InventoryManagement
        isOpen={showInventoryManagement}
        onClose={() => setShowInventoryManagement(false)}
      />

      {/* Maintenance Tracker */}
      <MaintenanceTracker
        isOpen={showMaintenanceTracker}
        onClose={() => setShowMaintenanceTracker(false)}
      />

      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />

      {/* Smart Notifications */}
      <SmartNotifications
        isOpen={showSmartNotifications}
        onClose={() => setShowSmartNotifications(false)}
      />

      {/* Mobile App */}
      <MobileApp
        isOpen={showMobileApp}
        onClose={() => setShowMobileApp(false)}
      />

      {/* Push Notifications */}
      <PushNotifications
        isOpen={showPushNotifications}
        onClose={() => setShowPushNotifications(false)}
      />

      {/* Performance Monitor */}
      <PerformanceMonitor
        isOpen={showPerformanceMonitor}
        onClose={() => setShowPerformanceMonitor(false)}
      />

      {/* AI Predictions */}
      <AIPredictions
        isOpen={showAIPredictions}
        onClose={() => setShowAIPredictions(false)}
      />


    </div>
  );
}