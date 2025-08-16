'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: 'veteran-housing' | 'sober-living' | 'reentry-housing';
  message: string;
  aiScore: number;
  aiClassification: 'high-priority' | 'medium-priority' | 'low-priority';
  aiInsights: string[];
  status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'inactive';
  sequenceStep: number;
  lastEmailSent: string;
  predictedConversionRate: number;
  recommendedAction: string;
}

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'lead-qualification' | 'follow-up' | 'predictive-analytics' | 'content-generation';
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  actions: string[];
  performance: {
    successRate: number;
    totalExecutions: number;
    lastExecuted: string;
  };
}

interface Prediction {
  id: string;
  type: 'occupancy' | 'revenue' | 'success-rate' | 'churn-risk';
  title: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendation: string;
}

export default function AIAutomationSystem() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState('leads');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);

  useEffect(() => {
    // Load sample data
    const sampleLeads: Lead[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        inquiryType: 'veteran-housing',
        message: 'I am a veteran looking for supportive housing. I have been struggling with PTSD and need a stable environment.',
        aiScore: 92,
        aiClassification: 'high-priority',
        aiInsights: [
          'Veteran status increases priority',
          'Mentioned PTSD indicates need for specialized care',
          'Clear housing need expressed',
          'High likelihood of program completion'
        ],
        status: 'new',
        sequenceStep: 0,
        lastEmailSent: '',
        predictedConversionRate: 85,
        recommendedAction: 'Immediate phone call and veteran program introduction'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 234-5678',
        inquiryType: 'sober-living',
        message: 'I am in recovery and need a sober living environment. I have been clean for 6 months.',
        aiScore: 78,
        aiClassification: 'medium-priority',
        aiInsights: [
          'Demonstrates commitment to recovery',
          '6 months sobriety is positive indicator',
          'Clear understanding of sober living concept',
          'Medium risk of relapse'
        ],
        status: 'contacted',
        sequenceStep: 2,
        lastEmailSent: '2024-01-15',
        predictedConversionRate: 65,
        recommendedAction: 'Send recovery program details and schedule tour'
      },
      {
        id: '3',
        name: 'Mike Davis',
        email: 'mike.davis@email.com',
        phone: '(555) 345-6789',
        inquiryType: 'reentry-housing',
        message: 'Recently released and looking for housing support. Need help with job placement too.',
        aiScore: 85,
        aiClassification: 'high-priority',
        aiInsights: [
          'Recent release indicates immediate need',
          'Job placement request shows motivation',
          'High risk of homelessness without support',
          'Good candidate for reentry program'
        ],
        status: 'scheduled',
        sequenceStep: 3,
        lastEmailSent: '2024-01-14',
        predictedConversionRate: 75,
        recommendedAction: 'Schedule intake interview and job readiness assessment'
      }
    ];

    const sampleWorkflows: AIWorkflow[] = [
      {
        id: '1',
        name: 'Lead Qualification & Scoring',
        description: 'Automatically analyzes incoming leads and assigns priority scores based on AI analysis',
        type: 'lead-qualification',
        status: 'active',
        triggers: ['New lead submission', 'Lead status change'],
        actions: ['Analyze message content', 'Check veteran status', 'Assess urgency indicators', 'Assign priority score'],
        performance: {
          successRate: 94,
          totalExecutions: 156,
          lastExecuted: '2024-01-15 14:30'
        }
      },
      {
        id: '2',
        name: 'Automated Follow-up Sequences',
        description: 'Sends personalized follow-up emails based on lead classification and behavior',
        type: 'follow-up',
        status: 'active',
        triggers: ['Lead classification', 'Time-based triggers', 'Email opens/clicks'],
        actions: ['Generate personalized content', 'Send follow-up emails', 'Update lead status', 'Schedule next action'],
        performance: {
          successRate: 87,
          totalExecutions: 89,
          lastExecuted: '2024-01-15 16:45'
        }
      },
      {
        id: '3',
        name: 'Predictive Analytics Engine',
        description: 'Analyzes patterns to predict occupancy, revenue, and success rates',
        type: 'predictive-analytics',
        status: 'active',
        triggers: ['Daily data updates', 'Weekly analysis'],
        actions: ['Analyze historical data', 'Generate predictions', 'Create recommendations', 'Send alerts'],
        performance: {
          successRate: 91,
          totalExecutions: 23,
          lastExecuted: '2024-01-15 09:00'
        }
      }
    ];

    const samplePredictions: Prediction[] = [
      {
        id: '1',
        type: 'occupancy',
        title: 'Occupancy Rate Prediction',
        currentValue: 78,
        predictedValue: 85,
        confidence: 87,
        timeframe: 'Next 30 days',
        factors: ['Increased lead volume', 'Seasonal trends', 'Marketing campaign success'],
        recommendation: 'Prepare for 7% increase in occupancy. Consider adding 2 more rooms.'
      },
      {
        id: '2',
        type: 'revenue',
        title: 'Revenue Forecast',
        currentValue: 45600,
        predictedValue: 49200,
        confidence: 82,
        timeframe: 'Next month',
        factors: ['Higher occupancy rates', 'Payment collection improvements', 'New program enrollments'],
        recommendation: 'Expected 8% revenue increase. Monitor payment processing efficiency.'
      },
      {
        id: '3',
        type: 'success-rate',
        title: 'Program Success Rate',
        currentValue: 87,
        predictedValue: 91,
        confidence: 79,
        timeframe: 'Next quarter',
        factors: ['Improved support programs', 'Better resident matching', 'Enhanced staff training'],
        recommendation: 'Focus on veteran program success rates. Consider additional counseling resources.'
      },
      {
        id: '4',
        type: 'churn-risk',
        title: 'Churn Risk Assessment',
        currentValue: 12,
        predictedValue: 8,
        confidence: 85,
        timeframe: 'Next 60 days',
        factors: ['Improved satisfaction scores', 'Better conflict resolution', 'Enhanced community programs'],
        recommendation: 'Low churn risk expected. Continue current support programs.'
      }
    ];

    setLeads(sampleLeads);
    setWorkflows(sampleWorkflows);
    setPredictions(samplePredictions);
  }, []);

  const getPriorityColor = (classification: string) => {
    switch (classification) {
      case 'high-priority': return 'bg-red-100 text-red-800';
      case 'medium-priority': return 'bg-yellow-100 text-yellow-800';
      case 'low-priority': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const processLeadWithAI = async (leadId: string) => {
    setAiProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setLeads(leads.map(lead => 
        lead.id === leadId 
          ? { ...lead, aiScore: Math.floor(Math.random() * 30) + 70 }
          : lead
      ));
      setAiProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              AI Automation System
            </h1>
            <p className="text-gray-600 mt-2">Intelligent lead qualification, predictive analytics, and automated workflows</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Run AI Analysis</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Score Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{workflows.filter(w => w.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'leads', name: 'AI Lead Analysis', icon: Users },
                { id: 'workflows', name: 'Automated Workflows', icon: Zap },
                { id: 'predictions', name: 'Predictive Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* AI Lead Analysis */}
            {activeTab === 'leads' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Lead Analysis</h3>
                  <button
                    onClick={() => processLeadWithAI('1')}
                    disabled={aiProcessing}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {aiProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    <span>{aiProcessing ? 'Processing...' : 'Re-analyze'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{lead.name}</h4>
                          <p className="text-sm text-gray-600">{lead.email} • {lead.phone}</p>
                          <p className="text-sm text-gray-600 capitalize">{lead.inquiryType.replace('-', ' ')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.aiClassification)}`}>
                            {lead.aiClassification.replace('-', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">AI Score</p>
                          <p className="text-2xl font-bold text-purple-600">{lead.aiScore}/100</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                          <p className="text-2xl font-bold text-green-600">{lead.predictedConversionRate}%</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Sequence Step</p>
                          <p className="text-2xl font-bold text-blue-600">{lead.sequenceStep}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">AI Insights:</p>
                        <div className="flex flex-wrap gap-2">
                          {lead.aiInsights.map((insight, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {insight}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Recommended Action:</p>
                          <p className="text-sm text-gray-600">{lead.recommendedAction}</p>
                        </div>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Automated Workflows */}
            {activeTab === 'workflows' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Automated Workflows</h3>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Create Workflow
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{workflow.name}</h4>
                          <p className="text-sm text-gray-600">{workflow.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {workflow.status}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Triggers:</p>
                          <div className="flex flex-wrap gap-1">
                            {workflow.triggers.map((trigger, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Actions:</p>
                          <div className="flex flex-wrap gap-1">
                            {workflow.actions.map((action, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Success Rate:</span>
                            <span className="font-medium text-green-600">{workflow.performance.successRate}%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Total Executions:</span>
                            <span className="font-medium">{workflow.performance.totalExecutions}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Predictive Analytics */}
            {activeTab === 'predictions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Generate New Predictions
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {predictions.map((prediction) => (
                    <div key={prediction.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{prediction.title}</h4>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Confidence</p>
                          <p className="text-lg font-bold text-blue-600">{prediction.confidence}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Current</p>
                          <p className="text-xl font-bold text-gray-900">
                            {prediction.type === 'revenue' ? '$' : ''}{prediction.currentValue.toLocaleString()}
                            {prediction.type === 'success-rate' || prediction.type === 'churn-risk' ? '%' : ''}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Predicted</p>
                          <p className="text-xl font-bold text-blue-600">
                            {prediction.type === 'revenue' ? '$' : ''}{prediction.predictedValue.toLocaleString()}
                            {prediction.type === 'success-rate' || prediction.type === 'churn-risk' ? '%' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">Key Factors:</p>
                        <div className="flex flex-wrap gap-1">
                          {prediction.factors.map((factor, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-900 mb-1">Recommendation:</p>
                        <p className="text-sm text-gray-600">{prediction.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Lead Analysis: {selectedLead.name}</h2>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Message</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLead.message}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">AI Analysis</p>
                        <div className="space-y-2">
                          {selectedLead.aiInsights.map((insight, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                    <div className="space-y-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-purple-900 mb-2">Recommended Action</p>
                        <p className="text-purple-800">{selectedLead.recommendedAction}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">Next Steps</p>
                        <ul className="text-blue-800 text-sm space-y-1">
                          <li>• Send personalized welcome email</li>
                          <li>• Schedule initial consultation</li>
                          <li>• Prepare program materials</li>
                          <li>• Assign case manager</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
