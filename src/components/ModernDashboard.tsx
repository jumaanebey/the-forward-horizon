'use client';
import { useState, useEffect } from 'react';
import AIAssistant from './AIAssistant';

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

interface ModernDashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function ModernDashboard({ onNavigate }: ModernDashboardProps) {
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
          value: 0,
          change: 0,
          changeType: 'neutral',
          icon: '👥',
          color: 'blue'
        },
        {
          title: 'Occupancy Rate',
          value: '0%',
          change: 0,
          changeType: 'neutral',
          icon: '🏠',
          color: 'green'
        },
        {
          title: 'Monthly Revenue',
          value: '$0',
          change: 0,
          changeType: 'neutral',
          icon: '💰',
          color: 'purple'
        },
        {
          title: 'Active Programs',
          value: 'In Development',
          change: 0,
          changeType: 'neutral',
          icon: '📋',
          color: 'orange'
        },
        {
          title: 'Staff Members',
          value: 2,
          change: 0,
          changeType: 'neutral',
          icon: '👨‍⚕️',
          color: 'blue'
        },
        {
          title: 'Facility Status',
          value: 'Pre-Opening',
          change: 0,
          changeType: 'neutral',
          icon: '🏗️',
          color: 'red'
        }
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'milestone',
          title: 'Facility Preparation',
          description: 'Facility licensing application submitted',
          timestamp: '3 days ago',
          user: 'Administrative Team'
        },
        {
          id: '2',
          type: 'milestone',
          title: 'Staff Onboarding',
          description: 'Initial staff training program scheduled',
          timestamp: '1 week ago',
          user: 'HR Department'
        },
        {
          id: '3',
          type: 'milestone',
          title: 'Marketing Launch',
          description: 'Website and marketing campaigns activated',
          timestamp: '2 weeks ago',
          user: 'Marketing Team'
        },
        {
          id: '4',
          type: 'milestone',
          title: 'Facility Setup',
          description: 'Initial facility inspection completed',
          timestamp: '3 weeks ago',
          user: 'Operations Team'
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
      {/* Mobile Hero Section */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="px-5 py-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold leading-relaxed">Good Morning! 👋</h1>
              <p className="text-blue-100 text-base mt-2 leading-relaxed">Here's what's happening today</p>
            </div>
            <div className="text-right">
              {currentDate && (
                <>
                  <p className="text-base font-semibold leading-relaxed">
                    {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-blue-200 mt-1 leading-relaxed">
                    {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Welcome back, here's what's happening at Forward Horizon</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-left sm:text-right">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-6">
        {/* Mobile Quick Stats */}
        <div className="lg:hidden mb-7">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold leading-relaxed">Residents</p>
                  <p className="text-2xl font-bold text-gray-900 leading-relaxed">0</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">Facility opening soon</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xl">📈</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold leading-relaxed">Occupancy</p>
                  <p className="text-2xl font-bold text-gray-900 leading-relaxed">72%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">↗ +5.1% from target</p>
            </div>
          </div>
          
          {/* Mobile Quick Actions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 leading-relaxed">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => onNavigate?.('residents')}
                className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 active:bg-blue-200 transition-all duration-150 active:scale-95"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                  <span className="text-blue-600 text-lg">👤</span>
                </div>
                <span className="text-sm font-semibold text-blue-700 leading-relaxed">Add Resident</span>
              </button>
              
              <button 
                onClick={() => onNavigate?.('reports')}
                className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 active:bg-green-200 transition-all duration-150 active:scale-95"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                  <span className="text-green-600 text-lg">📊</span>
                </div>
                <span className="text-sm font-semibold text-green-700 leading-relaxed">Reports</span>
              </button>
              
              <button 
                onClick={() => onNavigate?.('calendar')}
                className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 active:bg-purple-200 transition-all duration-150 active:scale-95"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                  <span className="text-purple-600 text-lg">📅</span>
                </div>
                <span className="text-sm font-semibold text-purple-700 leading-relaxed">Calendar</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Data Visualization */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4 leading-relaxed">Program Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">90-Day Recovery</span>
                  <span className="text-sm font-bold text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">60-Day Intensive</span>
                  <span className="text-sm font-bold text-gray-900">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{width: '35%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">30-Day Detox</span>
                  <span className="text-sm font-bold text-gray-900">20%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Revenue Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4 leading-relaxed">Revenue Trend (Last 6 Months)</h3>
            <div className="flex items-end justify-between h-32 space-x-2">
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{height: '60%'}}></div>
                <span className="text-xs text-gray-500 mt-2 font-medium">Jan</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{height: '75%'}}></div>
                <span className="text-xs text-gray-500 mt-2 font-medium">Feb</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{height: '85%'}}></div>
                <span className="text-xs text-gray-500 mt-2 font-medium">Mar</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{height: '70%'}}></div>
                <span className="text-xs text-gray-500 mt-2 font-medium">Apr</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{height: '90%'}}></div>
                <span className="text-xs text-gray-500 mt-2 font-medium">May</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t" style={{height: '100%'}}></div>
                <span className="text-xs text-green-600 mt-2 font-bold">Jun</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-lg font-bold text-green-600">$284,760</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">vs. Last Month</span>
                <span className="text-xs text-green-600 font-semibold">↗ +12.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Metrics Grid */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${getMetricColorClasses(metric.color)} flex items-center justify-center text-white text-lg sm:text-xl`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
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

        {/* Mobile Activity Feed */}
        <div className="lg:hidden space-y-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">Recent Activity</h2>
            </div>
            <div className="p-5">
              <div className="space-y-5">
                {recentActivity.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${getActivityColor(activity.type)} flex items-center justify-center text-sm`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 leading-relaxed">{activity.title}</p>
                      <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-base text-blue-600 font-semibold bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">View All Activity</button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600">Latest updates from your facility</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${getActivityColor(activity.type)} flex items-center justify-center text-xs sm:text-sm`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                          <h3 className="text-sm font-medium text-gray-900 leading-tight">{activity.title}</h3>
                          <p className="text-xs text-gray-500 sm:ml-2 flex-shrink-0">{activity.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{activity.description}</p>
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

          {/* Desktop Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate?.('residents')}
                  className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Add New Resident</p>
                    <p className="text-xs text-gray-500 truncate">Register a new resident</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('reports')}
                  className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-green-600 text-sm">📊</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Generate Report</p>
                    <p className="text-xs text-gray-500 truncate">Create monthly report</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('calendar')}
                  className="w-full flex items-center p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-purple-600 text-sm">📅</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Schedule Meeting</p>
                    <p className="text-xs text-gray-500 truncate">Book an appointment</p>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
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
      {/* AI Assistant */}
      <AIAssistant 
        businessData={{
          residents: 36,
          occupancyRate: 72.0,
          monthlyRevenue: 284760,
          activePrograms: 18,
          staffMembers: 42,
          recentIncidents: 3
        }}
        onNavigate={onNavigate}
      />
    </div>
  );
}