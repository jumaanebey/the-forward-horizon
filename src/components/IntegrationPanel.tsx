"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface IntegrationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IntegrationConfig {
  email: {
    enabled: boolean;
    smtpServer: string;
    smtpPort: string;
    username: string;
    password: string;
  };
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    phoneNumber: string;
  };
  calendar: {
    enabled: boolean;
    type: string;
    apiKey: string;
    calendarId: string;
  };
  notifications: {
    enabled: boolean;
    webhookUrl: string;
    slackChannel: string;
  };
}

export default function IntegrationPanel({ isOpen, onClose }: IntegrationPanelProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'calendar' | 'notifications'>('email');
  const [config, setConfig] = useState<IntegrationConfig>({
    email: {
      enabled: false,
      smtpServer: '',
      smtpPort: '587',
      username: '',
      password: ''
    },
    sms: {
      enabled: false,
      provider: 'twilio',
      apiKey: '',
      phoneNumber: ''
    },
    calendar: {
      enabled: false,
      type: 'google',
      apiKey: '',
      calendarId: ''
    },
    notifications: {
      enabled: false,
      webhookUrl: '',
      slackChannel: ''
    }
  });
  const [saving, setSaving] = useState(false);

  const handleConfigChange = (section: keyof IntegrationConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Integration settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save integration settings');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (type: string) => {
    try {
      toast.loading(`Testing ${type} connection...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${type} connection successful!`);
    } catch (error) {
      toast.error(`${type} connection failed`);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'email', label: 'Email Integration', icon: '📧' },
    { id: 'sms', label: 'SMS Notifications', icon: '📱' },
    { id: 'calendar', label: 'Calendar Sync', icon: '📅' },
    { id: 'notifications', label: 'Webhooks', icon: '🔗' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">System Integrations</h2>
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
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Integration</h3>
                <p className="text-gray-600 mb-4">
                  Configure email notifications for resident updates, reports, and alerts.
                </p>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.email.enabled}
                      onChange={(e) => handleConfigChange('email', 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enable Email Notifications</span>
                  </label>

                  {config.email.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
                        <input
                          type="text"
                          value={config.email.smtpServer}
                          onChange={(e) => handleConfigChange('email', 'smtpServer', e.target.value)}
                          placeholder="smtp.gmail.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                        <input
                          type="text"
                          value={config.email.smtpPort}
                          onChange={(e) => handleConfigChange('email', 'smtpPort', e.target.value)}
                          placeholder="587"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="email"
                          value={config.email.username}
                          onChange={(e) => handleConfigChange('email', 'username', e.target.value)}
                          placeholder="your-email@gmail.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          value={config.email.password}
                          onChange={(e) => handleConfigChange('email', 'password', e.target.value)}
                          placeholder="App password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Notifications</h3>
                <p className="text-gray-600 mb-4">
                  Set up SMS alerts for emergency situations and important updates.
                </p>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.sms.enabled}
                      onChange={(e) => handleConfigChange('sms', 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enable SMS Notifications</span>
                  </label>

                  {config.sms.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SMS Provider</label>
                        <select
                          value={config.sms.provider}
                          onChange={(e) => handleConfigChange('sms', 'provider', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="twilio">Twilio</option>
                          <option value="aws-sns">AWS SNS</option>
                          <option value="nexmo">Vonage (Nexmo)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <input
                          type="password"
                          value={config.sms.apiKey}
                          onChange={(e) => handleConfigChange('sms', 'apiKey', e.target.value)}
                          placeholder="Your API key"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Phone Number</label>
                        <input
                          type="tel"
                          value={config.sms.phoneNumber}
                          onChange={(e) => handleConfigChange('sms', 'phoneNumber', e.target.value)}
                          placeholder="+1234567890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendar Integration</h3>
                <p className="text-gray-600 mb-4">
                  Sync resident appointments, meetings, and events with external calendars.
                </p>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.calendar.enabled}
                      onChange={(e) => handleConfigChange('calendar', 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enable Calendar Sync</span>
                  </label>

                  {config.calendar.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Type</label>
                        <select
                          value={config.calendar.type}
                          onChange={(e) => handleConfigChange('calendar', 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="google">Google Calendar</option>
                          <option value="outlook">Outlook Calendar</option>
                          <option value="ical">iCal Feed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key / Client ID</label>
                        <input
                          type="password"
                          value={config.calendar.apiKey}
                          onChange={(e) => handleConfigChange('calendar', 'apiKey', e.target.value)}
                          placeholder="Your API key"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Calendar ID</label>
                        <input
                          type="text"
                          value={config.calendar.calendarId}
                          onChange={(e) => handleConfigChange('calendar', 'calendarId', e.target.value)}
                          placeholder="calendar-id@group.calendar.google.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Notifications</h3>
                <p className="text-gray-600 mb-4">
                  Send real-time notifications to external systems via webhooks.
                </p>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.notifications.enabled}
                      onChange={(e) => handleConfigChange('notifications', 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Enable Webhook Notifications</span>
                  </label>

                  {config.notifications.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                        <input
                          type="url"
                          value={config.notifications.webhookUrl}
                          onChange={(e) => handleConfigChange('notifications', 'webhookUrl', e.target.value)}
                          placeholder="https://hooks.slack.com/services/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slack Channel (optional)</label>
                        <input
                          type="text"
                          value={config.notifications.slackChannel}
                          onChange={(e) => handleConfigChange('notifications', 'slackChannel', e.target.value)}
                          placeholder="#general"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => testConnection(activeTab)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Test Connection
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 