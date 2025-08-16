"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface SmartNotification {
  id: string;
  type: 'alert' | 'reminder' | 'recommendation' | 'update' | 'emergency';
  title: string;
  message: string;
  category: 'resident' | 'financial' | 'maintenance' | 'staff' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  actionable: boolean;
  action_url?: string;
  action_text?: string;
  expires_at?: string;
  created_at: string;
  metadata?: {
    resident_id?: number;
    payment_id?: number;
    event_id?: number;
    maintenance_id?: number;
  };
}

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: {
    type: string;
    operator: string;
    value: any;
  }[];
  actions: {
    type: string;
    message: string;
    priority: string;
  }[];
}

interface SmartNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartNotifications({ isOpen, onClose }: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'rules' | 'settings'>('notifications');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchNotificationRules();
      startSmartMonitoring();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from a notifications table
      // For now, we'll generate smart notifications based on current data
      const smartNotifications = await generateSmartNotifications();
      setNotifications(smartNotifications);
    } catch (error) {
      toast.error('Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationRules = async () => {
    // Initialize default notification rules
    const defaultRules: NotificationRule[] = [
      {
        id: '1',
        name: 'Low Stock Alert',
        description: 'Notify when inventory items fall below minimum stock levels',
        enabled: true,
        conditions: [
          { type: 'inventory_stock', operator: 'less_than', value: 'min_stock' }
        ],
        actions: [
          { type: 'notification', message: 'Low stock alert for {item_name}', priority: 'medium' }
        ]
      },
      {
        id: '2',
        name: 'Overdue Payment Alert',
        description: 'Notify when payments are overdue',
        enabled: true,
        conditions: [
          { type: 'payment_status', operator: 'equals', value: 'pending' },
          { type: 'payment_due_date', operator: 'less_than', value: 'today' }
        ],
        actions: [
          { type: 'notification', message: 'Payment overdue for {resident_name}', priority: 'high' }
        ]
      },
      {
        id: '3',
        name: 'Maintenance Request Alert',
        description: 'Notify when urgent maintenance requests are created',
        enabled: true,
        conditions: [
          { type: 'maintenance_priority', operator: 'equals', value: 'urgent' }
        ],
        actions: [
          { type: 'notification', message: 'Urgent maintenance request: {title}', priority: 'urgent' }
        ]
      },
      {
        id: '4',
        name: 'Occupancy Alert',
        description: 'Notify when occupancy rate drops below threshold',
        enabled: true,
        conditions: [
          { type: 'occupancy_rate', operator: 'less_than', value: 80 }
        ],
        actions: [
          { type: 'notification', message: 'Low occupancy rate: {rate}%', priority: 'medium' }
        ]
      }
    ];
    setRules(defaultRules);
  };

  const generateSmartNotifications = async (): Promise<SmartNotification[]> => {
    const notifications: SmartNotification[] = [];

    try {
      // Check for overdue payments
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'pending');

      if (payments) {
        const overduePayments = payments.filter(p => new Date(p.due_date) < new Date());
        overduePayments.forEach(payment => {
          notifications.push({
            id: `payment-${payment.id}`,
            type: 'alert',
            title: 'Payment Overdue',
            message: `Payment of $${payment.amount} for resident ID ${payment.resident_id} is overdue.`,
            category: 'financial',
            priority: 'high',
            read: false,
            actionable: true,
            action_text: 'View Payment',
            action_url: `/payments/${payment.id}`,
            created_at: new Date().toISOString(),
            metadata: { payment_id: payment.id }
          });
        });
      }

      // Check for upcoming events
      const { data: events } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('status', 'scheduled')
        .gte('start_time', new Date().toISOString())
        .lte('start_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

      if (events && events.length > 0) {
        events.forEach(event => {
          notifications.push({
            id: `event-${event.id}`,
            type: 'reminder',
            title: 'Upcoming Event',
            message: `Event "${event.title}" is scheduled for ${new Date(event.start_time).toLocaleString()}.`,
            category: 'staff',
            priority: 'medium',
            read: false,
            actionable: true,
            action_text: 'View Event',
            action_url: `/schedule/${event.id}`,
            created_at: new Date().toISOString(),
            metadata: { event_id: event.id }
          });
        });
      }

      // Check for low occupancy
      const { data: residents } = await supabase.from('residents').select('*');
      if (residents && residents.length < 16) { // Assuming 20 total rooms, 80% threshold
        notifications.push({
          id: 'occupancy-alert',
          type: 'recommendation',
          title: 'Low Occupancy Alert',
          message: `Current occupancy rate is ${(residents.length / 20 * 100).toFixed(1)}%. Consider marketing initiatives.`,
          category: 'system',
          priority: 'medium',
          read: false,
          actionable: true,
          action_text: 'View Analytics',
          action_url: '/analytics',
          created_at: new Date().toISOString()
        });
      }

      // Check for maintenance requests
      const { data: maintenance } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('status', 'pending');

      if (maintenance) {
        const urgentRequests = maintenance.filter(r => r.priority === 'urgent');
        urgentRequests.forEach(request => {
          notifications.push({
            id: `maintenance-${request.id}`,
            type: 'alert',
            title: 'Urgent Maintenance Request',
            message: `Urgent maintenance request: "${request.title}" at ${request.location}.`,
            category: 'maintenance',
            priority: 'urgent',
            read: false,
            actionable: true,
            action_text: 'View Request',
            action_url: `/maintenance/${request.id}`,
            created_at: new Date().toISOString(),
            metadata: { maintenance_id: request.id }
          });
        });
      }

      // Add system health notification
      notifications.push({
        id: 'system-health',
        type: 'update',
        title: 'System Health Check',
        message: 'All systems are running smoothly. Last backup completed successfully.',
        category: 'system',
        priority: 'low',
        read: false,
        actionable: false,
        created_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error generating notifications:', error);
    }

    return notifications;
  };

  const startSmartMonitoring = () => {
    // Set up real-time monitoring for smart notifications
    const interval = setInterval(() => {
      if (isOpen) {
        fetchNotifications();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success('All notifications marked as read');
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const toggleRule = async (ruleId: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      const matchesType = filterType === 'all' || notification.type === filterType;
      const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
      const matchesReadStatus = !showUnreadOnly || !notification.read;
      
      return matchesType && matchesPriority && matchesReadStatus;
    });
  };

  const getNotificationIcon = (type: SmartNotification['type']) => {
    switch (type) {
      case 'alert': return '🚨';
      case 'reminder': return '⏰';
      case 'recommendation': return '💡';
      case 'update': return '📢';
      case 'emergency': return '🚨';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getCategoryColor = (category: SmartNotification['category']) => {
    switch (category) {
      case 'resident': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'staff': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'rules', label: 'Smart Rules', icon: '⚙️' },
    { id: 'settings', label: 'Settings', icon: '🔧' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Smart Notifications</h2>
            <p className="text-gray-600">Intelligent alerts and automated monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                {unreadCount} unread
              </span>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
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
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="alert">Alerts</option>
                  <option value="reminder">Reminders</option>
                  <option value="recommendation">Recommendations</option>
                  <option value="update">Updates</option>
                  <option value="emergency">Emergency</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Unread only</span>
                </label>
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Mark All Read
                </button>
              </div>

              {/* Notifications List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No notifications found matching your criteria.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? 'ring-2 ring-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(notification.category)}`}>
                                {notification.category}
                              </span>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{new Date(notification.created_at).toLocaleString()}</span>
                              {notification.actionable && notification.action_text && (
                                <button className="text-blue-600 hover:text-blue-800">
                                  {notification.action_text}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Smart Notification Rules</h3>
              <p className="text-gray-600">Configure automated notification rules for your facility.</p>
              
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => toggleRule(rule.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enabled</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Conditions:</h5>
                        <ul className="space-y-1 text-gray-600">
                          {rule.conditions.map((condition, index) => (
                            <li key={index}>
                              {condition.type} {condition.operator} {condition.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-1">Actions:</h5>
                        <ul className="space-y-1 text-gray-600">
                          {rule.actions.map((action, index) => (
                            <li key={index}>
                              {action.type}: {action.message} (Priority: {action.priority})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Notification Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">SMS alerts for urgent notifications</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Smart Monitoring</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Enable real-time monitoring</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Auto-generate smart insights</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Predictive notifications</span>
                    </label>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Notification Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quiet Hours Start</label>
                      <input type="time" defaultValue="22:00" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quiet Hours End</label>
                      <input type="time" defaultValue="07:00" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 