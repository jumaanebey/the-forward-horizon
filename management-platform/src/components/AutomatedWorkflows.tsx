'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  Mail,
  FileText,
  Phone,
  Bot,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Activity,
  Target
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  category: 'admissions' | 'interventions' | 'communications' | 'compliance';
  triggerCount: number;
  successRate: number;
  lastRun: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  steps: Omit<WorkflowStep, 'id'>[];
}

export default function AutomatedWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    
    // Mock workflow data
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'New Resident Onboarding',
        description: 'Automated welcome sequence for new residents',
        status: 'active',
        category: 'admissions',
        triggerCount: 23,
        successRate: 94,
        lastRun: '2025-08-01T10:30:00Z',
        createdAt: '2025-07-01T00:00:00Z',
        updatedAt: '2025-07-15T00:00:00Z',
        steps: [
          {
            id: 's1',
            type: 'trigger',
            name: 'New Resident Added',
            description: 'Triggers when a new resident is admitted',
            config: { event: 'resident.created' },
            position: { x: 100, y: 100 }
          },
          {
            id: 's2',
            type: 'action',
            name: 'Send Welcome Email',
            description: 'Sends personalized welcome email to resident',
            config: { template: 'welcome_email', delay: '0' },
            position: { x: 300, y: 100 }
          },
          {
            id: 's3',
            type: 'delay',
            name: 'Wait 24 Hours',
            description: 'Waits 24 hours before next action',
            config: { duration: '24h' },
            position: { x: 500, y: 100 }
          },
          {
            id: 's4',
            type: 'action',
            name: 'Schedule Orientation',
            description: 'Automatically schedules orientation meeting',
            config: { calendar: 'orientation', duration: '60min' },
            position: { x: 700, y: 100 }
          }
        ]
      },
      {
        id: '2',
        name: 'Risk Assessment Monitor',
        description: 'Monitors residents for risk indicators and triggers interventions',
        status: 'active',
        category: 'interventions',
        triggerCount: 12,
        successRate: 87,
        lastRun: '2025-08-01T14:45:00Z',
        createdAt: '2025-06-15T00:00:00Z',
        updatedAt: '2025-07-20T00:00:00Z',
        steps: [
          {
            id: 's1',
            type: 'trigger',
            name: 'Daily Risk Check',
            description: 'Runs daily assessment of resident risk factors',
            config: { schedule: 'daily', time: '09:00' },
            position: { x: 100, y: 100 }
          },
          {
            id: 's2',
            type: 'condition',
            name: 'High Risk Detected',
            description: 'Checks if risk score exceeds threshold',
            config: { field: 'risk_score', operator: '>', value: 75 },
            position: { x: 300, y: 100 }
          },
          {
            id: 's3',
            type: 'action',
            name: 'Alert Case Manager',
            description: 'Sends urgent alert to assigned case manager',
            config: { method: 'email_sms', priority: 'high' },
            position: { x: 500, y: 100 }
          }
        ]
      },
      {
        id: '3',
        name: 'Compliance Documentation',
        description: 'Ensures all required documentation is completed on time',
        status: 'active',
        category: 'compliance',
        triggerCount: 45,
        successRate: 98,
        lastRun: '2025-08-01T08:00:00Z',
        createdAt: '2025-05-01T00:00:00Z',
        updatedAt: '2025-07-10T00:00:00Z',
        steps: [
          {
            id: 's1',
            type: 'trigger',
            name: 'Document Due Soon',
            description: 'Triggers 7 days before document expiration',
            config: { field: 'document_expiry', threshold: '7days' },
            position: { x: 100, y: 100 }
          },
          {
            id: 's2',
            type: 'action',
            name: 'Reminder Notification',
            description: 'Sends reminder to staff and resident',
            config: { recipients: ['staff', 'resident'], template: 'doc_reminder' },
            position: { x: 300, y: 100 }
          }
        ]
      }
    ];

    const mockTemplates: WorkflowTemplate[] = [
      {
        id: 't1',
        name: 'Crisis Intervention Protocol',
        description: 'Automated response for crisis situations',
        category: 'interventions',
        icon: <AlertCircle className="w-5 h-5" />,
        steps: [
          {
            type: 'trigger',
            name: 'Crisis Alert',
            description: 'Triggered by crisis incident report',
            config: { event: 'crisis.reported' },
            position: { x: 100, y: 100 }
          },
          {
            type: 'action',
            name: 'Emergency Contacts',
            description: 'Notify emergency contacts immediately',
            config: { method: 'phone_sms', contacts: 'emergency' },
            position: { x: 300, y: 100 }
          }
        ]
      },
      {
        id: 't2',
        name: 'Progress Milestone Celebration',
        description: 'Recognizes and celebrates resident achievements',
        category: 'communications',
        icon: <Target className="w-5 h-5" />,
        steps: [
          {
            type: 'trigger',
            name: 'Milestone Reached',
            description: 'Triggered when resident reaches program milestone',
            config: { event: 'milestone.achieved' },
            position: { x: 100, y: 100 }
          },
          {
            type: 'action',
            name: 'Congratulations Message',
            description: 'Send personalized congratulations',
            config: { template: 'milestone_congrats' },
            position: { x: 300, y: 100 }
          }
        ]
      }
    ];

    setWorkflows(mockWorkflows);
    setTemplates(mockTemplates);
    setLoading(false);
  };

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100 border-green-300';
      case 'paused': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'draft': return 'text-gray-700 bg-gray-100 border-gray-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'admissions': return <Users className="w-4 h-4" />;
      case 'interventions': return <AlertCircle className="w-4 h-4" />;
      case 'communications': return <Mail className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const createFromTemplate = (template: WorkflowTemplate) => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description,
      status: 'draft',
      category: template.category as any,
      triggerCount: 0,
      successRate: 0,
      lastRun: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: template.steps.map((step, index) => ({
        ...step,
        id: `s${index + 1}`
      }))
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setIsCreating(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Bot className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
              <p className="text-lg font-medium">Loading Workflows...</p>
              <p className="text-gray-600">Initializing automation engine</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <Zap className="w-6 h-6 text-purple-600" />
            <span>Automated Workflows</span>
          </h2>
          <p className="text-gray-600">Streamline operations with intelligent automation</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Create Workflow</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-blue-600">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows.reduce((sum, w) => sum + w.triggerCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Time Saved</p>
                <p className="text-2xl font-bold text-orange-600">24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Templates */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Choose a Template</span>
              <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => createFromTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {getCategoryIcon(workflow.category)}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{workflow.name}</h3>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge className={getStatusColor(workflow.status)} variant="outline">
                        {workflow.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {workflow.triggerCount} executions
                      </span>
                      <span className="text-xs text-gray-500">
                        {workflow.successRate}% success rate
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWorkflowStatus(workflow.id)}
                    className="flex items-center space-x-1"
                  >
                    {workflow.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Activate</span>
                      </>
                    )}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="p-2">
                    <Settings className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="p-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Builder Preview */}
      {selectedWorkflow && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Workflow: {selectedWorkflow.name}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedWorkflow(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 overflow-x-auto pb-4">
                {selectedWorkflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-2 flex-shrink-0">
                    <div className="p-3 border rounded-lg bg-white min-w-[160px]">
                      <div className="flex items-center justify-center mb-2">
                        {step.type === 'trigger' && <Zap className="w-5 h-5 text-green-600" />}
                        {step.type === 'condition' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                        {step.type === 'action' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        {step.type === 'delay' && <Clock className="w-5 h-5 text-purple-600" />}
                      </div>
                      <h4 className="font-medium text-sm text-center">{step.name}</h4>
                      <p className="text-xs text-gray-600 text-center mt-1">{step.description}</p>
                    </div>
                    
                    {index < selectedWorkflow.steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(selectedWorkflow.status)} variant="outline">
                    {selectedWorkflow.status.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Created: {new Date(selectedWorkflow.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit Workflow
                  </Button>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    Test Run
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}