"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp: number;
}

interface PushNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PushNotifications({ isOpen, onClose }: PushNotificationsProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'history' | 'test'>('settings');

  useEffect(() => {
    if (isOpen) {
      checkNotificationSupport();
      loadNotificationHistory();
    }
  }, [isOpen]);

  const checkNotificationSupport = () => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        await registerServiceWorker();
        await subscribeToPush();
        toast.success('Push notifications enabled!');
      } else {
        toast.error('Permission denied for push notifications');
      }
    } catch (error) {
      toast.error('Failed to enable push notifications');
    } finally {
      setLoading(false);
    }
  };

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '')
      });
      
      setSubscription(subscription);
      
      // In a real app, you'd send this subscription to your server
      console.log('Push subscription:', subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      throw error;
    }
  };

  const unsubscribeFromPush = async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
      toast.success('Unsubscribed from push notifications');
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const loadNotificationHistory = () => {
    // Load from localStorage in a real app
    const stored = localStorage.getItem('pushNotificationHistory');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  };

  const sendTestNotification = async () => {
    if (permission !== 'granted') {
      toast.error('Notification permission not granted');
      return;
    }

    const testNotification: PushNotification = {
      id: Date.now().toString(),
      title: 'Test Notification',
      body: 'This is a test push notification from Forward Horizon!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'test-notification',
      timestamp: Date.now(),
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    try {
      const notification = new Notification(testNotification.title, {
        body: testNotification.body,
        icon: testNotification.icon,
        badge: testNotification.badge,
        tag: testNotification.tag,
        data: testNotification.data,
        actions: testNotification.actions,
        requireInteraction: testNotification.requireInteraction,
        silent: testNotification.silent
      });

      // Add to history
      const updatedNotifications = [testNotification, ...notifications].slice(0, 50);
      setNotifications(updatedNotifications);
      localStorage.setItem('pushNotificationHistory', JSON.stringify(updatedNotifications));

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        toast.success('Notification clicked!');
      };

      // Handle action clicks
      notification.onactionclick = (event) => {
        if (event.action === 'view') {
          toast.success('View Details clicked!');
        } else if (event.action === 'dismiss') {
          notification.close();
          toast.success('Notification dismissed!');
        }
      };

      toast.success('Test notification sent!');
    } catch (error) {
      toast.error('Failed to send test notification');
    }
  };

  const clearNotificationHistory = () => {
    setNotifications([]);
    localStorage.removeItem('pushNotificationHistory');
    toast.success('Notification history cleared');
  };

  const getPermissionStatusColor = (status: NotificationPermission) => {
    switch (status) {
      case 'granted': return 'text-green-600';
      case 'denied': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getPermissionStatusText = (status: NotificationPermission) => {
    switch (status) {
      case 'granted': return 'Enabled';
      case 'denied': return 'Disabled';
      default: return 'Not Set';
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'test', label: 'Test', icon: '🧪' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Push Notifications</h2>
            <p className="text-gray-600">Mobile notification settings and management</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Support Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">System Support</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Push Notifications</span>
                    <span className={`text-sm font-medium ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
                      {isSupported ? 'Supported' : 'Not Supported'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Service Worker</span>
                    <span className={`text-sm font-medium ${'serviceWorker' in navigator ? 'text-green-600' : 'text-red-600'}`}>
                      {'serviceWorker' in navigator ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Permission Status</span>
                    <span className={`text-sm font-medium ${getPermissionStatusColor(permission)}`}>
                      {getPermissionStatusText(permission)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Permission Management */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Permission Management</h3>
                {permission === 'default' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Enable push notifications to receive real-time updates about your facility.
                    </p>
                    <button
                      onClick={requestPermission}
                      disabled={loading || !isSupported}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Enabling...' : 'Enable Push Notifications'}
                    </button>
                  </div>
                )}
                {permission === 'granted' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Push notifications are enabled</span>
                    </div>
                    <button
                      onClick={unsubscribeFromPush}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Disable Push Notifications
                    </button>
                  </div>
                )}
                {permission === 'denied' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600 font-medium">Push notifications are disabled</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      To enable push notifications, please update your browser settings and try again.
                    </p>
                  </div>
                )}
              </div>

              {/* Notification Preferences */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Notification Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Resident Updates</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Payment Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Maintenance Requests</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Schedule Reminders</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Low Stock Alerts</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  </label>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Advanced Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Sound Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Vibration</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Require Interaction</span>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Notification History</h3>
                <button
                  onClick={clearNotificationHistory}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Clear History
                </button>
              </div>
              
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No notification history available.
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{new Date(notification.timestamp).toLocaleString()}</span>
                            {notification.tag && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full">{notification.tag}</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex space-x-1">
                              {notification.actions.map((action) => (
                                <button
                                  key={action.action}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                                >
                                  {action.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Test Push Notifications</h3>
                <p className="text-sm text-blue-800">
                  Send a test notification to verify your push notification setup is working correctly.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={sendTestNotification}
                  disabled={permission !== 'granted'}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Send Test Notification
                </button>

                {permission !== 'granted' && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-800 font-medium">Permission Required</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      You need to grant notification permission to send test notifications.
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Test Notification Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Custom title and message</li>
                    <li>• Action buttons (View Details, Dismiss)</li>
                    <li>• Click handling</li>
                    <li>• Action button handling</li>
                    <li>• History tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 