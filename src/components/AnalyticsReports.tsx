'use client';
import { useState, useEffect } from 'react';

interface AnalyticsData {
  occupancyRate: {
    current: number;
    trend: number;
    data: { month: string; rate: number }[];
  };
  revenue: {
    monthly: number;
    yearly: number;
    trend: number;
    data: { month: string; amount: number }[];
  };
  programEffectiveness: {
    completionRate: number;
    averageStay: number;
    successRate: number;
    data: { program: string; completion: number; success: number }[];
  };
  staffMetrics: {
    totalStaff: number;
    activeStaff: number;
    overtimeHours: number;
    turnoverRate: number;
  };
  incidentReports: {
    total: number;
    resolved: number;
    pending: number;
    byType: { type: string; count: number }[];
  };
}

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'operational' | 'clinical' | 'compliance';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  lastGenerated: string;
  status: 'scheduled' | 'generating' | 'completed' | 'failed';
}

export default function AnalyticsReports() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockAnalytics: AnalyticsData = {
        occupancyRate: {
          current: 0,
          trend: 0,
          data: [
            { month: 'Jul', rate: 0 },
            { month: 'Aug', rate: 0 },
            { month: 'Sep', rate: 0 },
            { month: 'Oct', rate: 0 },
            { month: 'Nov', rate: 0 },
            { month: 'Dec', rate: 0 }
          ]
        },
        revenue: {
          monthly: 0,
          yearly: 0,
          trend: 0,
          data: [
            { month: 'Jul', amount: 0 },
            { month: 'Aug', amount: 0 },
            { month: 'Sep', amount: 0 },
            { month: 'Oct', amount: 0 },
            { month: 'Nov', amount: 0 },
            { month: 'Dec', amount: 0 }
          ]
        },
        programEffectiveness: {
          completionRate: 0,
          averageStay: 0,
          successRate: 0,
          data: [
            { program: 'Programs in Development', completion: 0, success: 0 },
            { program: 'Awaiting First Residents', completion: 0, success: 0 },
            { program: 'Opening Soon', completion: 0, success: 0 }
          ]
        },
        staffMetrics: {
          totalStaff: 2,
          activeStaff: 2,
          overtimeHours: 0,
          turnoverRate: 0
        },
        incidentReports: {
          total: 0,
          resolved: 0,
          pending: 0,
          byType: [
            { type: 'No incidents yet', count: 0 },
            { type: 'Facility opening soon', count: 0 }
          ]
        }
      };

      const mockReports: Report[] = [
        {
          id: '1',
          name: 'Monthly Financial Summary',
          description: 'Comprehensive financial report including revenue, expenses, and profitability analysis',
          type: 'financial',
          frequency: 'monthly',
          lastGenerated: '2024-01-01',
          status: 'completed'
        },
        {
          id: '2',
          name: 'Program Outcomes Report',
          description: 'Analysis of program effectiveness, completion rates, and patient outcomes',
          type: 'clinical',
          frequency: 'quarterly',
          lastGenerated: '2024-01-15',
          status: 'completed'
        },
        {
          id: '3',
          name: 'Staff Performance Metrics',
          description: 'Staff productivity, overtime analysis, and workforce management insights',
          type: 'operational',
          frequency: 'monthly',
          lastGenerated: '2024-01-20',
          status: 'completed'
        },
        {
          id: '4',
          name: 'Compliance Audit Report',
          description: 'Regulatory compliance status, certifications, and quality assurance metrics',
          type: 'compliance',
          frequency: 'quarterly',
          lastGenerated: '2024-01-10',
          status: 'generating'
        },
        {
          id: '5',
          name: 'Daily Operations Dashboard',
          description: 'Real-time operational metrics, occupancy, incidents, and daily performance',
          type: 'operational',
          frequency: 'daily',
          lastGenerated: '2024-01-25',
          status: 'scheduled'
        },
        {
          id: '6',
          name: 'Annual Business Review',
          description: 'Comprehensive yearly analysis of all facility operations and financial performance',
          type: 'financial',
          frequency: 'yearly',
          lastGenerated: '2023-12-31',
          status: 'completed'
        }
      ];

      setAnalytics(mockAnalytics);
      setReports(mockReports);
      setLoading(false);
    }, 900);
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800';
      case 'operational': return 'bg-blue-100 text-blue-800';
      case 'clinical': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateCSVReport = (report: Report, analyticsData: AnalyticsData) => {
    let csvContent = '';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    switch (report.type) {
      case 'financial':
        csvContent = `Financial Report - ${report.name}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
        csvContent += `Month,Revenue,Occupancy Rate\n`;
        analyticsData.revenue.data.forEach((item, index) => {
          const occupancyData = analyticsData.occupancyRate.data[index];
          csvContent += `${item.month},${item.amount},${occupancyData?.rate || 0}%\n`;
        });
        csvContent += `\nSummary\n`;
        csvContent += `Total Monthly Revenue,${formatCurrency(analyticsData.revenue.monthly)}\n`;
        csvContent += `Yearly Revenue,${formatCurrency(analyticsData.revenue.yearly)}\n`;
        csvContent += `Current Occupancy Rate,${analyticsData.occupancyRate.current}%\n`;
        break;
        
      case 'operational':
        csvContent = `Operational Report - ${report.name}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
        csvContent += `Metric,Value\n`;
        csvContent += `Total Staff,${analyticsData.staffMetrics.totalStaff}\n`;
        csvContent += `Active Staff,${analyticsData.staffMetrics.activeStaff}\n`;
        csvContent += `Overtime Hours,${analyticsData.staffMetrics.overtimeHours}\n`;
        csvContent += `Staff Turnover Rate,${analyticsData.staffMetrics.turnoverRate}%\n`;
        csvContent += `\nIncident Reports\n`;
        csvContent += `Type,Count\n`;
        analyticsData.incidentReports.byType.forEach(incident => {
          csvContent += `${incident.type},${incident.count}\n`;
        });
        break;
        
      case 'clinical':
        csvContent = `Clinical Report - ${report.name}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
        csvContent += `Program,Completion Rate,Success Rate\n`;
        analyticsData.programEffectiveness.data.forEach(program => {
          csvContent += `${program.program},${program.completion}%,${program.success}%\n`;
        });
        csvContent += `\nOverall Metrics\n`;
        csvContent += `Average Completion Rate,${analyticsData.programEffectiveness.completionRate}%\n`;
        csvContent += `Average Stay Duration,${analyticsData.programEffectiveness.averageStay} days\n`;
        csvContent += `Overall Success Rate,${analyticsData.programEffectiveness.successRate}%\n`;
        break;
        
      case 'compliance':
        csvContent = `Compliance Report - ${report.name}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
        csvContent += `Compliance Area,Status,Notes\n`;
        csvContent += `Incident Resolution Rate,${Math.round((analyticsData.incidentReports.resolved / analyticsData.incidentReports.total) * 100)}%,${analyticsData.incidentReports.resolved} of ${analyticsData.incidentReports.total} resolved\n`;
        csvContent += `Staff Certification,Compliant,All active staff properly certified\n`;
        csvContent += `Safety Protocols,Compliant,All safety measures in place\n`;
        csvContent += `Documentation,Compliant,All required documentation current\n`;
        break;
        
      default:
        csvContent = `General Report - ${report.name}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
        csvContent += `This report contains general facility information and metrics.\n`;
    }
    
    return csvContent;
  };

  const generateHTMLReport = (report: Report, analyticsData: AnalyticsData) => {
    const timestamp = new Date().toLocaleDateString();
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${report.name} - Forward Horizon</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #1f2937; font-size: 28px; margin: 0; }
        .subtitle { color: #6b7280; font-size: 16px; margin: 5px 0 0 0; }
        .section { margin: 30px 0; }
        .section h2 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background-color: #f9fafb; font-weight: 600; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1f2937; }
        .metric-label { font-size: 14px; color: #6b7280; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${report.name}</h1>
        <p class="subtitle">Forward Horizon Management System • Generated: ${timestamp}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <div class="metric">
            <div class="metric-value">${analyticsData.occupancyRate.current}%</div>
            <div class="metric-label">Occupancy Rate</div>
        </div>
        <div class="metric">
            <div class="metric-value">${formatCurrency(analyticsData.revenue.monthly)}</div>
            <div class="metric-label">Monthly Revenue</div>
        </div>
        <div class="metric">
            <div class="metric-value">${analyticsData.programEffectiveness.successRate}%</div>
            <div class="metric-label">Program Success Rate</div>
        </div>
    </div>

    ${report.type === 'financial' ? `
    <div class="section">
        <h2>Financial Performance</h2>
        <table>
            <thead>
                <tr><th>Month</th><th>Revenue</th><th>Growth</th></tr>
            </thead>
            <tbody>
                ${analyticsData.revenue.data.map(item => `
                    <tr><td>${item.month}</td><td>${formatCurrency(item.amount)}</td><td>+${analyticsData.revenue.trend}%</td></tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    ${report.type === 'clinical' ? `
    <div class="section">
        <h2>Program Effectiveness</h2>
        <table>
            <thead>
                <tr><th>Program</th><th>Completion Rate</th><th>Success Rate</th></tr>
            </thead>
            <tbody>
                ${analyticsData.programEffectiveness.data.map(program => `
                    <tr><td>${program.program}</td><td>${program.completion}%</td><td>${program.success}%</td></tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    ${report.type === 'operational' ? `
    <div class="section">
        <h2>Operational Metrics</h2>
        <table>
            <thead>
                <tr><th>Metric</th><th>Value</th></tr>
            </thead>
            <tbody>
                <tr><td>Total Staff</td><td>${analyticsData.staffMetrics.totalStaff}</td></tr>
                <tr><td>Active Staff</td><td>${analyticsData.staffMetrics.activeStaff}</td></tr>
                <tr><td>Overtime Hours</td><td>${analyticsData.staffMetrics.overtimeHours}</td></tr>
                <tr><td>Turnover Rate</td><td>${analyticsData.staffMetrics.turnoverRate}%</td></tr>
            </tbody>
        </table>
    </div>
    ` : ''}

    <div class="section">
        <h2>Incident Summary</h2>
        <table>
            <thead>
                <tr><th>Incident Type</th><th>Count</th></tr>
            </thead>
            <tbody>
                ${analyticsData.incidentReports.byType.map(incident => `
                    <tr><td>${incident.type}</td><td>${incident.count}</td></tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>This report was generated automatically by the Forward Horizon Management System.</p>
        <p>For questions about this report, please contact the facility administration.</p>
    </div>
</body>
</html>`;
  };

  const downloadReport = (report: Report, format: 'csv' | 'html') => {
    if (!analytics) return;
    
    let content: string;
    let mimeType: string;
    let filename: string;
    
    if (format === 'csv') {
      content = generateCSVReport(report, analytics);
      mimeType = 'text/csv';
      filename = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      content = generateHTMLReport(report, analytics);
      mimeType = 'text/html';
      filename = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-1">Comprehensive analytics and automated reporting for facility performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="2years">Last 2 Years</option>
            </select>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'dashboard', label: 'Analytics Dashboard' },
              { id: 'reports', label: 'Generated Reports' },
              { id: 'insights', label: 'Key Insights' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.occupancyRate.current}%</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +{analytics.occupancyRate.trend}%
                      </div>
                      <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.monthly)}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +{analytics.revenue.trend}%
                      </div>
                      <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Program Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.programEffectiveness.successRate}%</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +3.2%
                      </div>
                      <span className="text-xs text-gray-500 ml-2">vs last quarter</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Incident Resolution</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round((analytics.incidentReports.resolved / analytics.incidentReports.total) * 100)}%</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center text-green-600 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        +5.8%
                      </div>
                      <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                  <div className="text-sm text-gray-500">Last 6 months</div>
                </div>
                <div className="space-y-4">
                  {analytics.revenue.data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{item.month}</span>
                      <div className="flex items-center flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(item.amount / 300000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Effectiveness */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Program Effectiveness</h3>
                  <div className="text-sm text-gray-500">Completion vs Success</div>
                </div>
                <div className="space-y-4">
                  {analytics.programEffectiveness.data.map((program, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{program.program}</span>
                        <div className="flex space-x-4 text-xs">
                          <span className="text-blue-600">Completion: {program.completion}%</span>
                          <span className="text-green-600">Success: {program.success}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${program.completion}%` }}
                          ></div>
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${program.success}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Incident Reports */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Incident Reports by Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {analytics.incidentReports.byType.map((incident, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{incident.count}</div>
                    <div className="text-sm text-gray-600">{incident.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generated Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getReportTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getReportStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium text-gray-900 capitalize">{report.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Generated:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(report.lastGenerated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <button 
                          onClick={() => downloadReport(report, 'csv')}
                          className="w-full px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                        >
                          Download CSV
                        </button>
                      </div>
                      <div className="flex-1 relative">
                        <button 
                          onClick={() => downloadReport(report, 'html')}
                          className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Download Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Insights */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Revenue Growth</h4>
                      <p className="text-sm text-gray-600">Monthly revenue increased by 12.3% compared to last month, indicating strong financial performance.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">High Occupancy</h4>
                      <p className="text-sm text-gray-600">Current occupancy rate of 89.2% suggests optimal capacity utilization and strong demand.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Program Success</h4>
                      <p className="text-sm text-gray-600">90-Day Recovery Program shows highest success rate at 88.4%, indicating effective treatment protocols.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Staff Overtime Management</h4>
                      <p className="text-sm text-gray-600">Consider hiring additional staff to reduce overtime hours (124 hours) and improve work-life balance.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Incident Prevention</h4>
                      <p className="text-sm text-gray-600">Focus on medical emergency preparedness training to reduce the most common incident type.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Program Expansion</h4>
                      <p className="text-sm text-gray-600">Consider expanding 90-Day Recovery Program capacity due to high success rate and demand.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">↗ 15.2%</div>
                  <div className="text-sm font-medium text-gray-900">Revenue Growth</div>
                  <div className="text-xs text-gray-600">6-month trend</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">↗ 8.7%</div>
                  <div className="text-sm font-medium text-gray-900">Occupancy Rate</div>
                  <div className="text-xs text-gray-600">6-month trend</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">↗ 5.3%</div>
                  <div className="text-sm font-medium text-gray-900">Success Rate</div>
                  <div className="text-xs text-gray-600">6-month trend</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Generate New Report</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">Select a report type to generate and download:</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {reports.filter(r => r.status === 'completed').map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-medium text-gray-900 mb-2">{report.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            downloadReport(report, 'csv');
                            setShowReportModal(false);
                          }}
                          className="flex-1 px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100"
                        >
                          CSV
                        </button>
                        <button
                          onClick={() => {
                            downloadReport(report, 'html');
                            setShowReportModal(false);
                          }}
                          className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                        >
                          HTML Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="w-full px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}