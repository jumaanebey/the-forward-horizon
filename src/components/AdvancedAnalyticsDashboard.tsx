'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign,
  Calendar,
  Activity,
  Target,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  PieChart,
  LineChart,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  occupancyRate: {
    current: number;
    trend: number;
    history: { month: string; rate: number }[];
  };
  financialMetrics: {
    revenue: { current: number; trend: number };
    expenses: { current: number; trend: number };
    profitMargin: { current: number; trend: number };
  };
  residentMetrics: {
    totalResidents: number;
    newAdmissions: number;
    graduations: number;
    averageStay: number;
    successRate: number;
  };
  programEffectiveness: {
    counselingAttendance: number;
    jobPlacementRate: number;
    relapsePrevention: number;
    communityIntegration: number;
  };
  staffMetrics: {
    staffUtilization: number;
    caseloadAverage: number;
    burnoutRisk: number;
  };
}

export default function AdvancedAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockData: AnalyticsData = {
      occupancyRate: {
        current: 87,
        trend: 5.2,
        history: [
          { month: 'Jan', rate: 82 },
          { month: 'Feb', rate: 85 },
          { month: 'Mar', rate: 87 },
          { month: 'Apr', rate: 84 },
          { month: 'May', rate: 87 }
        ]
      },
      financialMetrics: {
        revenue: { current: 145000, trend: 8.3 },
        expenses: { current: 120000, trend: 2.1 },
        profitMargin: { current: 17.2, trend: 3.8 }
      },
      residentMetrics: {
        totalResidents: 45,
        newAdmissions: 8,
        graduations: 6,
        averageStay: 8.5,
        successRate: 78
      },
      programEffectiveness: {
        counselingAttendance: 92,
        jobPlacementRate: 85,
        relapsePrevention: 89,
        communityIntegration: 76
      },
      staffMetrics: {
        staffUtilization: 85,
        caseloadAverage: 12,
        burnoutRisk: 23
      }
    };

    setAnalyticsData(mockData);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
              <p className="text-lg font-medium">Loading Analytics...</p>
              <p className="text-gray-600">Gathering comprehensive insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Advanced Analytics</span>
          </h2>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="px-3 py-1"
              >
                {period === '7d' ? '7 Days' : 
                 period === '30d' ? '30 Days' : 
                 period === '90d' ? '90 Days' : '1 Year'}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-3xl font-bold text-blue-600">{analyticsData.occupancyRate.current}%</p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(analyticsData.occupancyRate.trend)}
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.occupancyRate.trend)}`}>
                  {analyticsData.occupancyRate.trend > 0 ? '+' : ''}{analyticsData.occupancyRate.trend}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                vs last period
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(analyticsData.financialMetrics.revenue.current)}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(analyticsData.financialMetrics.revenue.trend)}
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.financialMetrics.revenue.trend)}`}>
                  {analyticsData.financialMetrics.revenue.trend > 0 ? '+' : ''}{analyticsData.financialMetrics.revenue.trend}%
                </span>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                vs last month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-purple-600">{analyticsData.residentMetrics.successRate}%</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs text-purple-700 bg-purple-50">
                Program Completions
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Stay</p>
                <p className="text-3xl font-bold text-orange-600">{analyticsData.residentMetrics.averageStay} mo</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Resident Duration
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="financial" className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>Financial</span>
          </TabsTrigger>
          <TabsTrigger value="residents" className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>Residents</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>Programs</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span>Staff</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-1">
            <LineChart className="w-4 h-4" />
            <span>Trends</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Month</span>
                    <span className="font-semibold">{formatCurrency(analyticsData.financialMetrics.revenue.current)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Growth</span>
                    <span className={`font-semibold ${getTrendColor(analyticsData.financialMetrics.revenue.trend)}`}>
                      {analyticsData.financialMetrics.revenue.trend > 0 ? '+' : ''}{analyticsData.financialMetrics.revenue.trend}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profit Margin</span>
                    <span className="font-semibold text-green-600">{analyticsData.financialMetrics.profitMargin.current}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expenses Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Staff Costs</span>
                    <span className="font-semibold">{formatCurrency(analyticsData.financialMetrics.expenses.current * 0.65)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Facilities</span>
                    <span className="font-semibold">{formatCurrency(analyticsData.financialMetrics.expenses.current * 0.20)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Programs</span>
                    <span className="font-semibold">{formatCurrency(analyticsData.financialMetrics.expenses.current * 0.15)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cash Flow</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Positive</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Budget Variance</span>
                    <span className="text-green-600 font-semibold">-2.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ROI</span>
                    <span className="text-blue-600 font-semibold">15.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="residents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resident Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Residents</span>
                    <span className="font-semibold text-2xl">{analyticsData.residentMetrics.totalResidents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Admissions (30d)</span>
                    <span className="font-semibold text-blue-600">{analyticsData.residentMetrics.newAdmissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Graduations (30d)</span>
                    <span className="font-semibold text-green-600">{analyticsData.residentMetrics.graduations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-purple-600">{analyticsData.residentMetrics.successRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Age 18-25</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Age 26-35</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Age 36+</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Program Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Counseling Attendance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analyticsData.programEffectiveness.counselingAttendance}%` }}></div>
                      </div>
                      <span className="font-semibold">{analyticsData.programEffectiveness.counselingAttendance}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Job Placement Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analyticsData.programEffectiveness.jobPlacementRate}%` }}></div>
                      </div>
                      <span className="font-semibold">{analyticsData.programEffectiveness.jobPlacementRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Relapse Prevention</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${analyticsData.programEffectiveness.relapsePrevention}%` }}></div>
                      </div>
                      <span className="font-semibold">{analyticsData.programEffectiveness.relapsePrevention}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Community Integration</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${analyticsData.programEffectiveness.communityIntegration}%` }}></div>
                      </div>
                      <span className="font-semibold">{analyticsData.programEffectiveness.communityIntegration}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Program Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-2">
                      <span className="text-2xl font-bold text-green-600">94%</span>
                    </div>
                    <p className="text-sm text-gray-600">Overall Participation Rate</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold">42</p>
                      <p className="text-xs text-gray-600">Active Participants</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">8.3</p>
                      <p className="text-xs text-gray-600">Avg Programs/Resident</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Staff Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-2">
                    <span className="text-xl font-bold text-blue-600">{analyticsData.staffMetrics.staffUtilization}%</span>
                  </div>
                  <p className="text-sm text-gray-600">Current Utilization</p>
                  <Badge variant="outline" className="mt-2">
                    Optimal Range: 80-90%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Caseload Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-2">
                    <span className="text-xl font-bold text-purple-600">{analyticsData.staffMetrics.caseloadAverage}</span>
                  </div>
                  <p className="text-sm text-gray-600">Average Caseload</p>
                  <Badge variant="outline" className="mt-2">
                    Per Staff Member
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Burnout Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-2">
                    <span className="text-xl font-bold text-orange-600">{analyticsData.staffMetrics.burnoutRisk}%</span>
                  </div>
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <Badge variant="outline" className={`mt-2 ${analyticsData.staffMetrics.burnoutRisk > 30 ? 'text-red-700 bg-red-50' : 'text-green-700 bg-green-50'}`}>
                    {analyticsData.staffMetrics.burnoutRisk > 30 ? 'Monitor Closely' : 'Low Risk'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Occupancy Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {analyticsData.occupancyRate.history.map((item, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-12 bg-blue-600 rounded-t"
                      style={{ height: `${(item.rate / 100) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600">{item.month}</span>
                    <span className="text-xs font-medium">{item.rate}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}