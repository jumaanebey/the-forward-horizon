'use client';
import { useState, useEffect } from 'react';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

interface Activity {
  id: string;
  type: 'admission' | 'discharge' | 'payment' | 'incident' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export default function ModernDashboard() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Set current date on client side to avoid SSR hydration mismatch
    setCurrentDate(new Date());
    
    // Simulate data loading
    setTimeout(() => {
      setMetrics([
        {
          title: 'Total Residents',
          value: 124,
          change: 8.2,
          changeType: 'increase',
          icon: '👥',
          color: 'blue'
        },
        {
          title: 'Occupancy Rate',
          value: '89.2%',
          change: 5.1,
          changeType: 'increase',
          icon: '🏠',
          color: 'green'
        },
        {
          title: 'Monthly Revenue',
          value: '$284,760',
          change: 12.3,
          changeType: 'increase',
          icon: '💰',
          color: 'purple'
        },
        {
          title: 'Active Programs',
          value: 18,
          change: -2.1,
          changeType: 'decrease',
          icon: '📋',
          color: 'orange'
        },
        {
          title: 'Staff Members',
          value: 42,
          change: 0,
          changeType: 'neutral',
          icon: '👨‍⚕️',
          color: 'blue'
        },
        {
          title: 'Incidents (30d)',
          value: 3,
          change: -25.0,
          changeType: 'decrease',
          icon: '⚠️',
          color: 'red'
        }
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'admission',
          title: 'New Resident Admission',
          description: 'Sarah Johnson admitted to Room B-204',
          timestamp: '2 hours ago',
          user: 'Dr. Smith'
        },
        {
          id: '2',
          type: 'milestone',
          title: 'Program Milestone',
          description: 'Mike Brown completed 30-day milestone',
          timestamp: '4 hours ago',
          user: 'Counselor Davis'
        },
        {
          id: '3',
          type: 'payment',
          title: 'Payment Received',
          description: '$3,200 payment processed for Room A-101',
          timestamp: '6 hours ago',
          user: 'Finance Team'
        },
        {
          id: '4',
          type: 'discharge',
          title: 'Successful Discharge',
          description: 'Emily Chen completed 90-day program',
          timestamp: '1 day ago',
          user: 'Dr. Wilson'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getMetricColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      admission: '✅',
      discharge: '🎓',
      payment: '💳',
      incident: '⚠️',
      milestone: '🎯'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const getActivityColor = (type: string) => {
    const colors = {
      admission: 'bg-green-100 text-green-800',
      discharge: 'bg-blue-100 text-blue-800',
      payment: 'bg-purple-100 text-purple-800',
      incident: 'bg-red-100 text-red-800',
      milestone: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, here's what's happening at Forward Horizon</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {currentDate ? (
                  <>
                    <p className="text-sm font-medium text-gray-900">
                      {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </>
                ) : (
                  <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getMetricColorClasses(metric.color)} flex items-center justify-center text-white text-xl`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    metric.changeType === 'increase' ? 'bg-green-100 text-green-800' :
                    metric.changeType === 'decrease' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {metric.changeType === 'increase' && '↗'}
                    {metric.changeType === 'decrease' && '↘'}
                    {metric.changeType === 'neutral' && '→'}
                    {metric.change !== 0 ? `${Math.abs(metric.change)}%` : 'No change'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs last month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600">Latest updates from your facility</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getActivityColor(activity.type)} flex items-center justify-center text-sm`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        {activity.user && (
                          <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Add New Resident</p>
                    <p className="text-xs text-gray-500">Register a new resident</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm">📊</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Generate Report</p>
                    <p className="text-xs text-gray-500">Create monthly report</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm">📅</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Schedule Meeting</p>
                    <p className="text-xs text-gray-500">Book an appointment</p>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Healthy</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-yellow-600">Running</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}