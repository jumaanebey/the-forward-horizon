"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface AnalyticsData {
  residents: {
    total: number;
    byProgram: { [key: string]: number };
    byStatus: { [key: string]: number };
    averageAge: number;
    genderDistribution: { [key: string]: number };
    recentAdditions: number;
  };
  payments: {
    totalOutstanding: number;
    totalCollected: number;
    byType: { [key: string]: number };
    monthlyTrend: { [key: string]: number };
    overdueCount: number;
  };
  schedules: {
    totalEvents: number;
    byType: { [key: string]: number };
    completionRate: number;
    upcomingEvents: number;
  };
  occupancy: {
    currentRate: number;
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
  };
}

interface AdvancedAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdvancedAnalytics({ isOpen, onClose }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'residents' | 'financial' | 'operations'>('overview');
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen, dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch residents data
      const { data: residents, error: residentsError } = await supabase
        .from('residents')
        .select('*');

      if (residentsError) {
        toast.error('Failed to fetch residents data');
        return;
      }

      // Fetch payments data
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*');

      if (paymentsError) {
        toast.error('Failed to fetch payments data');
        return;
      }

      // Fetch schedule events data
      const { data: events, error: eventsError } = await supabase
        .from('schedule_events')
        .select('*');

      if (eventsError) {
        toast.error('Failed to fetch events data');
        return;
      }

      // Process analytics data
      const processedData = processAnalyticsData(residents || [], payments || [], events || []);
      setAnalytics(processedData);
    } catch (error) {
      toast.error('Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (residents: any[], payments: any[], events: any[]): AnalyticsData => {
    // Process residents data
    const byProgram: { [key: string]: number } = {};
    const byStatus: { [key: string]: number } = {};
    const genderDistribution: { [key: string]: number } = {};
    let totalAge = 0;
    let ageCount = 0;

    residents.forEach(resident => {
      // Program distribution
      const program = resident.program || 'Unknown';
      byProgram[program] = (byProgram[program] || 0) + 1;

      // Status distribution
      const status = resident.status || 'Active';
      byStatus[status] = (byStatus[status] || 0) + 1;

      // Age calculation
      if (resident.dob) {
        const age = new Date().getFullYear() - new Date(resident.dob).getFullYear();
        totalAge += age;
        ageCount++;
      }
    });

    // Process payments data
    const byType: { [key: string]: number } = {};
    const monthlyTrend: { [key: string]: number } = {};
    let totalOutstanding = 0;
    let totalCollected = 0;
    let overdueCount = 0;

    payments.forEach(payment => {
      // Payment type distribution
      byType[payment.payment_type] = (byType[payment.payment_type] || 0) + payment.amount;

      // Outstanding vs collected
      if (payment.status === 'completed') {
        totalCollected += payment.amount;
      } else if (payment.status === 'pending') {
        totalOutstanding += payment.amount;
        if (new Date(payment.due_date) < new Date()) {
          overdueCount++;
        }
      }

      // Monthly trend
      const month = new Date(payment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyTrend[month] = (monthlyTrend[month] || 0) + payment.amount;
    });

    // Process events data
    const eventsByType: { [key: string]: number } = {};
    let completedEvents = 0;

    events.forEach(event => {
      eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;
      if (event.status === 'completed') {
        completedEvents++;
      }
    });

    // Calculate occupancy (assuming 20 total rooms for demo)
    const totalRooms = 20;
    const occupiedRooms = residents.length;
    const availableRooms = totalRooms - occupiedRooms;

    return {
      residents: {
        total: residents.length,
        byProgram,
        byStatus,
        averageAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0,
        genderDistribution,
        recentAdditions: residents.filter(r => {
          const daysSinceAdded = (new Date().getTime() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceAdded <= parseInt(dateRange);
        }).length
      },
      payments: {
        totalOutstanding,
        totalCollected,
        byType,
        monthlyTrend,
        overdueCount
      },
      schedules: {
        totalEvents: events.length,
        byType: eventsByType,
        completionRate: events.length > 0 ? Math.round((completedEvents / events.length) * 100) : 0,
        upcomingEvents: events.filter(e => new Date(e.start_time) > new Date() && e.status === 'scheduled').length
      },
      occupancy: {
        currentRate: Math.round((occupiedRooms / totalRooms) * 100),
        totalRooms,
        occupiedRooms,
        availableRooms
      }
    };
  };

  const renderChart = (data: { [key: string]: number }, title: string, colors: string[] = []) => {
    const entries = Object.entries(data);
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {entries.map(([key, value], index) => {
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            const color = colors[index % colors.length] || 'bg-blue-500';
            
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMetricCard = (title: string, value: string | number, subtitle: string, color: string = 'blue') => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      purple: 'bg-purple-50 text-purple-600'
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'residents', label: 'Residents', icon: '👥' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'operations', label: 'Operations', icon: '⚙️' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
            <p className="text-gray-600">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
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
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          ) : analytics ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {renderMetricCard(
                      'Total Residents',
                      analytics.residents.total,
                      'Currently in facility',
                      'blue'
                    )}
                    {renderMetricCard(
                      'Occupancy Rate',
                      `${analytics.occupancy.currentRate}%`,
                      `${analytics.occupancy.occupiedRooms}/${analytics.occupancy.totalRooms} rooms`,
                      'green'
                    )}
                    {renderMetricCard(
                      'Outstanding Payments',
                      `$${analytics.payments.totalOutstanding.toLocaleString()}`,
                      `${analytics.payments.overdueCount} overdue`,
                      'red'
                    )}
                    {renderMetricCard(
                      'Event Completion',
                      `${analytics.schedules.completionRate}%`,
                      `${analytics.schedules.upcomingEvents} upcoming`,
                      'purple'
                    )}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderChart(
                      analytics.residents.byProgram,
                      'Residents by Program',
                      ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500']
                    )}
                    {renderChart(
                      analytics.payments.byType,
                      'Payments by Type',
                      ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500']
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'residents' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderMetricCard(
                      'Average Age',
                      analytics.residents.averageAge,
                      'years old',
                      'blue'
                    )}
                    {renderMetricCard(
                      'Recent Additions',
                      analytics.residents.recentAdditions,
                      `in last ${dateRange} days`,
                      'green'
                    )}
                    {renderMetricCard(
                      'Available Rooms',
                      analytics.occupancy.availableRooms,
                      'rooms available',
                      'yellow'
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderChart(
                      analytics.residents.byProgram,
                      'Program Distribution',
                      ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500']
                    )}
                    {renderChart(
                      analytics.residents.byStatus,
                      'Status Distribution',
                      ['bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-gray-500']
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderMetricCard(
                      'Total Collected',
                      `$${analytics.payments.totalCollected.toLocaleString()}`,
                      'All time',
                      'green'
                    )}
                    {renderMetricCard(
                      'Total Outstanding',
                      `$${analytics.payments.totalOutstanding.toLocaleString()}`,
                      `${analytics.payments.overdueCount} overdue`,
                      'red'
                    )}
                    {renderMetricCard(
                      'Collection Rate',
                      `${analytics.payments.totalCollected > 0 ? Math.round((analytics.payments.totalCollected / (analytics.payments.totalCollected + analytics.payments.totalOutstanding)) * 100) : 0}%`,
                      'Payment success rate',
                      'blue'
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderChart(
                      analytics.payments.byType,
                      'Payment Distribution',
                      ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500']
                    )}
                    {renderChart(
                      analytics.payments.monthlyTrend,
                      'Monthly Payment Trend',
                      ['bg-blue-500']
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'operations' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderMetricCard(
                      'Total Events',
                      analytics.schedules.totalEvents,
                      'All time',
                      'blue'
                    )}
                    {renderMetricCard(
                      'Completion Rate',
                      `${analytics.schedules.completionRate}%`,
                      'Events completed',
                      'green'
                    )}
                    {renderMetricCard(
                      'Upcoming Events',
                      analytics.schedules.upcomingEvents,
                      'Scheduled',
                      'yellow'
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderChart(
                      analytics.schedules.byType,
                      'Event Types',
                      ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500']
                    )}
                    {renderChart(
                      analytics.occupancy,
                      'Room Occupancy',
                      ['bg-green-500', 'bg-gray-500']
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No analytics data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 