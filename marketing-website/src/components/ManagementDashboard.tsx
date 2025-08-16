// Management Dashboard - Full access interface for staff, managers, and admins
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  Home, 
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  FileText,
  Brain,
  BarChart3,
  Zap,
  Building
} from 'lucide-react';
import { CRMManager } from '@/lib/crm';
import { User } from '@/lib/simple-auth';
import AISuccessPredictor from './AISuccessPredictor';
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard';
import AutomatedWorkflows from './AutomatedWorkflows';
import TaskManagement from './TaskManagement';
import LeadManagement from './LeadManagement';
import ResidentManagement from './ResidentManagement';
import FinancialOverview from './FinancialOverview';
import HousingInventory from './HousingInventory';

interface ManagementDashboardProps {
  user: User;
}

interface OperationalMetrics {
  totalResidents: number;
  occupancyRate: number;
  monthlyRevenue: number;
  pendingApplications: number;
  staffCount: number;
  incidentsThisMonth: number;
  totalLeads: number;
  activeTasks: number;
  overdueTasks: number;
  completedToday: number;
  conversionRate: number;
  leadsThisWeek: number;
}

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  leadName?: string;
  type: string;
}

export default function ManagementDashboard({ user }: ManagementDashboardProps) {
  const [metrics, setMetrics] = useState<OperationalMetrics>({
    totalResidents: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
    pendingApplications: 0,
    staffCount: 2,
    incidentsThisMonth: 0,
    totalLeads: 0,
    activeTasks: 0,
    overdueTasks: 0,
    completedToday: 0,
    conversionRate: 0,
    leadsThisWeek: 0
  });

  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, [user.id]);

  const loadDashboardData = async () => {
    try {
      // Load CRM statistics
      const crmStats = await CRMManager.getCRMStats(user.id);
      
      // Load today's tasks
      const tasks = await CRMManager.getTodaysTasks(user.id);
      
      setMetrics(prev => ({
        ...prev,
        ...crmStats
      }));

      setTodaysTasks(tasks.map(task => ({
        id: task.id,
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate || '',
        type: task.taskType
      })));

      // Mock recent activity - replace with real data
      setRecentActivity([
        {
          type: 'lead_created',
          description: 'New lead from Google Ads campaign',
          timestamp: '2 hours ago',
          user: 'System'
        },
        {
          type: 'task_completed',
          description: 'Follow-up call completed',
          timestamp: '4 hours ago',
          user: user.firstName
        },
        {
          type: 'status_updated',
          description: 'Lead status changed to Qualified',
          timestamp: '6 hours ago',
          user: user.firstName
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canAccess = (resource: string, action: string = 'view') => {
    // For now, basic role-based access
    if (user.role === 'admin') return true;
    if (user.role === 'manager') return resource !== 'system';
    if (user.role === 'staff') return !['financial', 'staff'].includes(resource);
    return false;
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-resident':
        setActiveTab('residents');
        // Could also trigger a modal or specific action
        break;
      case 'log-call':
        setActiveTab('leads');
        // Could trigger a call logging modal
        break;
      case 'schedule-event':
        setActiveTab('tasks');
        // Could trigger calendar/event modal
        break;
      case 'generate-report':
        setActiveTab('analytics');
        // Could trigger report generation
        break;
      default:
        console.log(`Quick action: ${action}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Management Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.firstName}</p>
          </div>
          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Residents</p>
                  <p className="text-2xl font-bold">{metrics.totalResidents}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{metrics.occupancyRate}%</p>
                </div>
                <Home className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {canAccess('financial') && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Leads</p>
                  <p className="text-2xl font-bold">{metrics.totalLeads}</p>
                </div>
                <UserPlus className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CRM Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Tasks</p>
                  <p className="text-2xl font-bold">{metrics.activeTasks}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Tasks</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.overdueTasks}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.completedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            {canAccess('residents') && <TabsTrigger value="residents">Residents</TabsTrigger>}
            <TabsTrigger value="housing" className="flex items-center space-x-1">
              <Building className="w-4 h-4" />
              <span>Housing</span>
            </TabsTrigger>
            {canAccess('financial') && <TabsTrigger value="financial">Financial</TabsTrigger>}
            <TabsTrigger value="ai-insights" className="flex items-center space-x-1">
              <Brain className="w-4 h-4" />
              <span>AI Insights</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>Workflows</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Today's Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Today's Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todaysTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tasks scheduled for today</p>
                  ) : (
                    todaysTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{task.title}</p>
                          {task.dueDate && (
                            <p className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                        <Badge className={getPriorityColor(task.priority)} variant="secondary">
                          {task.priority}
                        </Badge>
                      </div>
                    ))
                  )}
                  {todaysTasks.length > 5 && (
                    <Button variant="outline" size="sm" className="w-full">
                      View All Tasks ({todaysTasks.length})
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp} by {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col hover:bg-blue-50 transition-colors" 
                    onClick={() => handleQuickAction('add-resident')}
                  >
                    <UserPlus className="w-6 h-6 mb-2" />
                    Add Resident
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col hover:bg-green-50 transition-colors" 
                    onClick={() => handleQuickAction('log-call')}
                  >
                    <Phone className="w-6 h-6 mb-2" />
                    Log Call
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col hover:bg-purple-50 transition-colors" 
                    onClick={() => handleQuickAction('schedule-event')}
                  >
                    <Calendar className="w-6 h-6 mb-2" />
                    Schedule Event
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col hover:bg-orange-50 transition-colors" 
                    onClick={() => handleQuickAction('generate-report')}
                  >
                    <FileText className="w-6 h-6 mb-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagement />
          </TabsContent>

          <TabsContent value="leads">
            <LeadManagement />
          </TabsContent>

          {canAccess('residents') && (
            <TabsContent value="residents">
              <ResidentManagement />
            </TabsContent>
          )}

          <TabsContent value="housing">
            <HousingInventory />
          </TabsContent>

          {canAccess('financial') && (
            <TabsContent value="financial">
              <FinancialOverview />
            </TabsContent>
          )}

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights">
            <AISuccessPredictor />
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics">
            <AdvancedAnalyticsDashboard />
          </TabsContent>

          {/* Automated Workflows Tab */}
          <TabsContent value="workflows">
            <AutomatedWorkflows />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}