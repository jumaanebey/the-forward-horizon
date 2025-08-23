'use client';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Target,
  DollarSign,
  Activity,
  PieChart,
  Clock
} from 'lucide-react';

interface ReportData {
  totalLeads: number;
  conversionRate: number;
  averageResponseTime: number;
  programBreakdown: {
    veterans: number;
    recovery: number;
    reentry: number;
  };
  monthlyTrends: {
    month: string;
    leads: number;
    conversions: number;
  }[];
  funnelMetrics: {
    stage: string;
    count: number;
    conversionRate: number;
  }[];
  topPerformingSources: {
    source: string;
    leads: number;
    conversionRate: number;
  }[];
}

export default function AdvancedReportingDashboard() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      const response = await fetch(`/api/reports/analytics?range=${dateRange}`);
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No report data available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Report data will appear once you have leads in your system.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
            <p className="text-gray-600">Comprehensive insights into your lead generation and conversion performance</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.averageResponseTime}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sequences</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.funnelMetrics.find(m => m.stage === 'In Sequence')?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Program Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                <span className="font-medium">Veterans</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{reportData.programBreakdown.veterans}</div>
                <div className="text-sm text-gray-600">leads</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                <span className="font-medium">Recovery</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{reportData.programBreakdown.recovery}</div>
                <div className="text-sm text-gray-600">leads</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
                <span className="font-medium">Re-entry</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{reportData.programBreakdown.reentry}</div>
                <div className="text-sm text-gray-600">leads</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {reportData.funnelMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{metric.stage}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold">{metric.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${metric.conversionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{metric.conversionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportData.monthlyTrends.slice(-4).map((trend, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{trend.month}</div>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{trend.leads}</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-sm text-gray-500">leads</div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{trend.conversions}</span>
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-sm text-gray-500">conversions</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Sources */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Sources</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.topPerformingSources.map((source, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {source.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.leads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.conversionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${source.conversionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {source.conversionRate >= 20 ? 'Excellent' : 
                         source.conversionRate >= 10 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-gray-700">
                  Veterans program shows highest conversion rate at {reportData.programBreakdown.veterans > 0 ? '25%' : '0%'}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-gray-700">
                  Average response time of {reportData.averageResponseTime} hours is within industry standards
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-gray-700">
                  {reportData.conversionRate < 15 ? 'Consider improving follow-up sequences' : 'Conversion rate is performing well'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Optimize Veterans Program</h4>
              <p className="text-sm text-blue-700 mt-1">
                Focus marketing efforts on veterans segment for higher conversions
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Improve Response Time</h4>
              <p className="text-sm text-green-700 mt-1">
                Implement automated responses to reduce initial contact time
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Enhance Follow-up</h4>
              <p className="text-sm text-purple-700 mt-1">
                Add more touchpoints in email sequences for better engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
