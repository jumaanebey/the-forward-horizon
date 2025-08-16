"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface MobileAppProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileScreen {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
}

export default function MobileApp({ isOpen, onClose }: MobileAppProps) {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isOffline, setIsOffline] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [mobileData, setMobileData] = useState<any>({
    residents: [],
    payments: [],
    events: [],
    inventory: [],
    maintenance: []
  });

  useEffect(() => {
    if (isOpen) {
      checkOnlineStatus();
      loadMobileData();
      setupOfflineSync();
    }
  }, [isOpen]);

  const checkOnlineStatus = () => {
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));
  };

  const loadMobileData = async () => {
    setSyncStatus('syncing');
    try {
      // Load all data for offline access
      const [residents, payments, events, inventory, maintenance] = await Promise.all([
        supabase.from('residents').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('schedule_events').select('*'),
        supabase.from('inventory_items').select('*'),
        supabase.from('maintenance_requests').select('*')
      ]);

      setMobileData({
        residents: residents.data || [],
        payments: payments.data || [],
        events: events.data || [],
        inventory: inventory.data || [],
        maintenance: maintenance.data || []
      });

      setSyncStatus('synced');
      setLastSync(new Date());
      toast.success('Mobile data synced successfully');
    } catch (error) {
      setSyncStatus('error');
      toast.error('Failed to sync mobile data');
    }
  };

  const setupOfflineSync = () => {
    // Simulate periodic sync
    const interval = setInterval(() => {
      if (!isOffline) {
        loadMobileData();
      }
    }, 300000); // Sync every 5 minutes

    return () => clearInterval(interval);
  };

  const MobileDashboard = () => (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className="text-sm font-medium">
            {isOffline ? 'Offline Mode' : 'Online'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            syncStatus === 'synced' ? 'bg-green-500' :
            syncStatus === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-xs text-gray-600">
            {syncStatus === 'synced' ? 'Synced' :
             syncStatus === 'syncing' ? 'Syncing...' : 'Sync Error'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{mobileData.residents.length}</div>
          <div className="text-sm text-blue-800">Residents</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${mobileData.payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0).toFixed(0)}
          </div>
          <div className="text-sm text-green-800">Total Revenue</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{mobileData.events.length}</div>
          <div className="text-sm text-orange-800">Events</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {mobileData.maintenance.filter((m: any) => m.status === 'pending').length}
          </div>
          <div className="text-sm text-red-800">Pending Issues</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-blue-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl mb-1">👤</div>
            <div className="text-sm">Add Resident</div>
          </button>
          <button className="bg-green-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-sm">Record Payment</div>
          </button>
          <button className="bg-purple-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-sm">Schedule Event</div>
          </button>
          <button className="bg-red-600 text-white p-4 rounded-lg text-center">
            <div className="text-2xl mb-1">🔧</div>
            <div className="text-sm">Report Issue</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <div className="space-y-2">
          {mobileData.residents.slice(0, 3).map((resident: any) => (
            <div key={resident.id} className="bg-white p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {resident.name?.charAt(0) || 'R'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{resident.name}</div>
                  <div className="text-sm text-gray-600">Room {resident.room_number}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(resident.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MobileResidents = () => (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search residents..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute left-3 top-3 text-gray-400">
          🔍
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto">
        {['All', 'Active', 'Inactive', 'Medical'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Residents List */}
      <div className="space-y-3">
        {mobileData.residents.map((resident: any) => (
          <div key={resident.id} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {resident.name?.charAt(0) || 'R'}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{resident.name}</div>
                <div className="text-sm text-gray-600">Room {resident.room_number}</div>
                <div className="text-xs text-gray-500">
                  Admitted: {new Date(resident.admission_date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Active
                </span>
                <button className="text-blue-600 text-sm">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MobilePayments = () => (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            ${mobileData.payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0).toFixed(0)}
          </div>
          <div className="text-sm text-green-800">Total Collected</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-lg font-bold text-red-600">
            {mobileData.payments.filter((p: any) => p.status === 'pending').length}
          </div>
          <div className="text-sm text-red-800">Pending</div>
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Recent Payments</h3>
        {mobileData.payments.slice(0, 5).map((payment: any) => (
          <div key={payment.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">${payment.amount}</div>
                <div className="text-sm text-gray-600">Resident ID: {payment.resident_id}</div>
                <div className="text-xs text-gray-500">
                  Due: {new Date(payment.due_date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MobileSchedule = () => (
    <div className="space-y-4">
      {/* Today's Events */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3">Today's Events</h3>
        <div className="space-y-2">
          {mobileData.events
            .filter((event: any) => {
              const eventDate = new Date(event.start_time).toDateString();
              const today = new Date().toDateString();
              return eventDate === today;
            })
            .slice(0, 3)
            .map((event: any) => (
              <div key={event.id} className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
        {mobileData.events
          .filter((event: any) => new Date(event.start_time) > new Date())
          .slice(0, 5)
          .map((event: any) => (
            <div key={event.id} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-600">{event.location}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.start_time).toLocaleDateString()} at{' '}
                    {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const MobileMaintenance = () => (
    <div className="space-y-4">
      {/* Priority Issues */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="font-semibold text-red-900 mb-3">Priority Issues</h3>
        <div className="space-y-2">
          {mobileData.maintenance
            .filter((m: any) => m.priority === 'urgent')
            .slice(0, 3)
            .map((issue: any) => (
              <div key={issue.id} className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{issue.title}</div>
                    <div className="text-sm text-gray-600">{issue.location}</div>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    Urgent
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* All Issues */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">All Maintenance Requests</h3>
        {mobileData.maintenance.map((issue: any) => (
          <div key={issue.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{issue.title}</div>
                <div className="text-sm text-gray-600">{issue.location}</div>
                <div className="text-xs text-gray-500">
                  {new Date(issue.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  issue.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {issue.priority}
                </span>
                <div className="text-xs text-gray-500 mt-1">{issue.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MobileInventory = () => (
    <div className="space-y-4">
      {/* Low Stock Alert */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-semibold text-orange-900 mb-3">Low Stock Items</h3>
        <div className="space-y-2">
          {mobileData.inventory
            .filter((item: any) => item.quantity <= (item.min_stock || 5))
            .slice(0, 3)
            .map((item: any) => (
              <div key={item.id} className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    Low Stock
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">All Inventory Items</h3>
        {mobileData.inventory.map((item: any) => (
          <div key={item.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-600">{item.category}</div>
                <div className="text-xs text-gray-500">SKU: {item.sku}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{item.quantity}</div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.quantity <= (item.min_stock || 5) ? 'bg-red-100 text-red-800' :
                  item.quantity <= (item.max_stock || 10) ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.quantity <= (item.min_stock || 5) ? 'Low' :
                   item.quantity <= (item.max_stock || 10) ? 'Medium' : 'Good'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MobileSettings = () => (
    <div className="space-y-4">
      {/* Sync Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Sync Status</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Sync</span>
            <span className="text-sm text-gray-900">
              {lastSync.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className={`text-sm ${
              syncStatus === 'synced' ? 'text-green-600' :
              syncStatus === 'syncing' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {syncStatus === 'synced' ? 'Synced' :
               syncStatus === 'syncing' ? 'Syncing...' : 'Error'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Connection</span>
            <span className={`text-sm ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
              {isOffline ? 'Offline' : 'Online'}
            </span>
          </div>
        </div>
        <button
          onClick={loadMobileData}
          disabled={syncStatus === 'syncing'}
          className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* App Settings */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">App Settings</h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <span className="text-sm text-gray-700">Push Notifications</span>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
          </label>
          <label className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <span className="text-sm text-gray-700">Auto Sync</span>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
          </label>
          <label className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <span className="text-sm text-gray-700">Offline Mode</span>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
          </label>
        </div>
      </div>

      {/* Data Usage */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-900 mb-3">Data Usage</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Residents</span>
            <span className="text-gray-900">{mobileData.residents.length} records</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payments</span>
            <span className="text-gray-900">{mobileData.payments.length} records</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Events</span>
            <span className="text-gray-900">{mobileData.events.length} records</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Inventory</span>
            <span className="text-gray-900">{mobileData.inventory.length} records</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Maintenance</span>
            <span className="text-gray-900">{mobileData.maintenance.length} records</span>
          </div>
        </div>
      </div>
    </div>
  );

  const screens: MobileScreen[] = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊', component: <MobileDashboard /> },
    { id: 'residents', title: 'Residents', icon: '👥', component: <MobileResidents /> },
    { id: 'payments', title: 'Payments', icon: '💰', component: <MobilePayments /> },
    { id: 'schedule', title: 'Schedule', icon: '📅', component: <MobileSchedule /> },
    { id: 'maintenance', title: 'Maintenance', icon: '🔧', component: <MobileMaintenance /> },
    { id: 'inventory', title: 'Inventory', icon: '📦', component: <MobileInventory /> },
    { id: 'settings', title: 'Settings', icon: '⚙️', component: <MobileSettings /> }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Mobile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Forward Horizon</h2>
              <p className="text-sm opacity-90">Mobile App</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Screen Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {screens.find(screen => screen.id === activeScreen)?.component}
        </div>

        {/* Mobile Navigation */}
        <div className="bg-white border-t border-gray-200 p-2">
          <div className="flex justify-around">
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  activeScreen === screen.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-xl mb-1">{screen.icon}</span>
                <span className="text-xs">{screen.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 