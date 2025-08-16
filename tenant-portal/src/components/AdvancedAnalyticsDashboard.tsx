'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Home, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  occupancy: {
    current: number;
    previous: number;
    trend: number;
  };
  revenue: {
    current: number;
    previous: number;
    trend: number;
  };
  residents: {
    total: number;
    newThisMonth: number;
    graduated: number;
  };
  payments: {
    collected: number;
    pending: number;
    overdue: number;
  };
  programs: {
    veterans: number;
    recovery: number;
    reentry: number;
    general: number;
  };
  performance: {
    successRate: number;
    avgStayDuration: number;
    satisfactionScore: number;
  };
}

export default function AdvancedAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    occupancy: { current: 0, previous: 0, trend: 0 },
    revenue: { current: 0, previous: 0, trend: 0 },
    residents: { total: 0, newThisMonth: 0, graduated: 0 },
    payments: { collected: 0, pending: 0, overdue: 0 },
    programs: { veterans: 0, recovery: 0, reentry: 0, general: 0 },
    performance: { successRate: 0, avgStayDuration: 0, satisfactionScore: 0 }
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading real data
    setTimeout(() => {
      setAnalyticsData({
        occupancy: {
          current: 78,
          previous: 72,
          trend: 8.3
        },
        revenue: {
          current: 45600,
          previous: 43200,
          trend: 5.6
        },
        residents: {
          total: 26,
          newThisMonth: 4,
          graduated: 2
        },
        payments: {
          collected: 45600,
          pending: 3200,
          overdue: 800
        },
        programs: {
          veterans: 8,
          recovery: 12,
          reentry: 4,
          general: 2
        },
        performance: {
          successRate: 87,
          avgStayDuration: 8.5,
          satisfactionScore: 4.6
        }
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (trend < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time insights into Forward Horizon's performance and impact</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.occupancy.current}%</p>
                <div className="flex items-center mt-2">
                  {getTrendIcon(analyticsData.occupancy.trend)}
                  <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.occupancy.trend)}`}>
                    {analyticsData.occupancy.trend > 0 ? '+' : ''}{analyticsData.occupancy.trend}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analyticsData.revenue.current.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {getTrendIcon(analyticsData.revenue.trend)}
                  <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.revenue.trend)}`}>
                    {analyticsData.revenue.trend > 0 ? '+' : ''}{analyticsData.revenue.trend}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Residents</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.residents.total}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">+{analyticsData.residents.newThisMonth} new</span>
                  <span className="text-sm text-gray-500 ml-2">this month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.successRate}%</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">Graduation rate</span>
                  <span className="text-sm text-gray-500 ml-2">of residents</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Program Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Distribution</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.programs).map(([program, count]) => (
                <div key={program} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      program === 'veterans' ? 'bg-blue-500' :
                      program === 'recovery' ? 'bg-green-500' :
                      program === 'reentry' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{program}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ width: `${(count / analyticsData.residents.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Collected</span>
                </div>
                <span className="text-sm font-medium text-gray-900">${analyticsData.payments.collected.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Pending</span>
                </div>
                <span className="text-sm font-medium text-gray-900">${analyticsData.payments.pending.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Overdue</span>
                </div>
                <span className="text-sm font-medium text-gray-900">${analyticsData.payments.overdue.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Collection Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {Math.round((analyticsData.payments.collected / (analyticsData.payments.collected + analyticsData.payments.pending + analyticsData.payments.overdue)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.performance.successRate}%</div>
              <p className="text-sm text-gray-600">Residents who successfully complete programs</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Average Stay</h3>
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{analyticsData.performance.avgStayDuration} months</div>
              <p className="text-sm text-gray-600">Average duration of stay</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Satisfaction Score</h3>
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{analyticsData.performance.satisfactionScore}/5</div>
              <p className="text-sm text-gray-600">Resident satisfaction rating</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New resident enrolled</p>
                <p className="text-sm text-gray-600">John Smith joined the recovery program</p>
              </div>
              <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Payment received</p>
                <p className="text-sm text-gray-600">$800 monthly rent payment processed</p>
              </div>
              <span className="text-sm text-gray-500 ml-auto">4 hours ago</span>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Program completion</p>
                <p className="text-sm text-gray-600">Sarah Johnson graduated from veterans program</p>
              </div>
              <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}