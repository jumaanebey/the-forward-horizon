'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SmartLeadAttraction from './SmartLeadAttraction';
import { AILeadEngine, LeadData as AILeadData, LeadScore, AIInsights } from '@/lib/ai-lead-engine';
import { 
  Plus, 
  Phone, 
  Mail, 
  User,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare,
  Brain
} from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'application_sent' | 'approved' | 'declined' | 'waitlist';
  source: 'website' | 'referral' | 'social_media' | 'google_ads' | 'walk_in' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expectedMoveIn: string;
  housingType: 'transitional' | 'permanent' | 'emergency';
  monthlyIncome?: number;
  notes: string;
  createdAt: string;
  lastContact?: string;
  assignedTo: string;
}

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showAddLead, setShowAddLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'website' as Lead['source'],
    priority: 'medium' as Lead['priority'],
    expectedMoveIn: '',
    housingType: 'transitional' as Lead['housingType'],
    monthlyIncome: '',
    notes: '',
    assignedTo: 'Sarah Johnson'
  });
  
  const [leadEngine] = useState(() => AILeadEngine.getInstance());
  const [aiAnalysisResults, setAiAnalysisResults] = useState<Map<string, { score: LeadScore; insights: AIInsights }>>(new Map());

  useEffect(() => {
    // Load demo leads
    setLeads([
      {
        id: '1',
        firstName: 'John',
        lastName: 'Williams',
        email: 'john.williams@email.com',
        phone: '(555) 123-4567',
        status: 'new',
        source: 'website',
        priority: 'high',
        expectedMoveIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        housingType: 'transitional',
        monthlyIncome: 2500,
        notes: 'Recently discharged veteran, needs transitional housing support',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Sarah Johnson'
      },
      {
        id: '2',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@email.com',
        phone: '(555) 234-5678',
        status: 'contacted',
        source: 'referral',
        priority: 'medium',
        expectedMoveIn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        housingType: 'transitional',
        monthlyIncome: 1800,
        notes: 'Single mother with two children, referred by social services',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Mike Chen'
      },
      {
        id: '3',
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.johnson@email.com',
        phone: '(555) 345-6789',
        status: 'qualified',
        source: 'google_ads',
        priority: 'high',
        expectedMoveIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        housingType: 'permanent',
        monthlyIncome: 3200,
        notes: 'Stable employment, looking for permanent supportive housing',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Sarah Johnson'
      },
      {
        id: '4',
        firstName: 'Lisa',
        lastName: 'Chen',
        email: 'lisa.chen@email.com',
        phone: '(555) 456-7890',
        status: 'application_sent',
        source: 'social_media',
        priority: 'medium',
        expectedMoveIn: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        housingType: 'transitional',
        monthlyIncome: 2100,
        notes: 'Recently started new job, application documents submitted',
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'Lisa Brown'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'application_sent': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      case 'waitlist': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return '🌐';
      case 'referral': return '👥';
      case 'social_media': return '📱';
      case 'google_ads': return '🎯';
      case 'walk_in': return '🚶';
      default: return '📝';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    approved: leads.filter(l => l.status === 'approved').length,
    thisWeek: leads.filter(l => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(l.createdAt) > weekAgo;
    }).length
  };

  const handleAddLead = () => {
    const lead: Lead = {
      id: Date.now().toString(),
      ...newLead,
      monthlyIncome: newLead.monthlyIncome ? parseInt(newLead.monthlyIncome) : undefined,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setLeads([lead, ...leads]);
    setNewLead({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      source: 'website',
      priority: 'medium',
      expectedMoveIn: '',
      housingType: 'transitional',
      monthlyIncome: '',
      notes: '',
      assignedTo: 'Sarah Johnson'
    });
    setShowAddLead(false);
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { 
        ...lead, 
        status: newStatus,
        lastContact: new Date().toISOString()
      } : lead
    ));
  };

  const handleAILeadQualified = async (leadData: AILeadData, analysis: { score: LeadScore; insights: AIInsights }) => {
    // Convert AI lead to regular lead format and add to leads list
    const newLead: Lead = {
      id: Date.now().toString(),
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      status: analysis.score.qualificationLevel === 'priority' ? 'qualified' : 
              analysis.score.qualificationLevel === 'hot' ? 'contacted' : 'new',
      source: leadData.source,
      priority: analysis.score.urgencyLevel === 'urgent' ? 'urgent' :
                analysis.score.urgencyLevel === 'high' ? 'high' : 'medium',
      expectedMoveIn: leadData.timeline || new Date(Date.now() + analysis.score.estimatedTimeToConversion * 24 * 60 * 60 * 1000).toISOString(),
      housingType: leadData.inquiryType === 'veterans-housing' ? 'transitional' :
                   leadData.inquiryType === 'recovery-housing' ? 'transitional' : 'transitional',
      monthlyIncome: leadData.monthlyIncome,
      notes: `AI Analysis: ${analysis.score.overallScore}/100 score. ${analysis.insights.personalizedApproach}`,
      createdAt: new Date().toISOString(),
      assignedTo: 'AI Auto-Assignment'
    };

    // Store AI analysis results
    const newResults = new Map(aiAnalysisResults);
    newResults.set(newLead.id, analysis);
    setAiAnalysisResults(newResults);

    // Add to leads list
    setLeads(prev => [newLead, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Lead Management</h2>
          <p className="text-gray-600">Track and manage potential residents with AI-powered insights</p>
        </div>
        <Button onClick={() => setShowAddLead(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </Button>
      </div>

      {/* AI Lead Management Tabs */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leads">Lead Pipeline</TabsTrigger>
          <TabsTrigger value="ai-attraction" className="flex items-center space-x-1">
            <Brain className="w-4 h-4" />
            <span>AI Qualification & Attraction</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-6">

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{leadStats.total}</p>
              </div>
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Leads</p>
                <p className="text-2xl font-bold text-blue-600">{leadStats.new}</p>
              </div>
              <Plus className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-green-600">{leadStats.qualified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-emerald-600">{leadStats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">{leadStats.thisWeek}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="application_sent">Application Sent</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="waitlist">Waitlist</option>
          </select>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social_media">Social Media</option>
            <option value="google_ads">Google Ads</option>
            <option value="walk_in">Walk-in</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{lead.firstName} {lead.lastName}</h3>
                      <Badge className={getStatusColor(lead.status)} variant="outline">
                        {lead.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(lead.priority)} variant="outline">
                        {lead.priority}
                      </Badge>
                      <span className="text-sm">{getSourceIcon(lead.source)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <User className="w-3 h-3" />
                          <span>Assigned to: {lead.assignedTo}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>Move-in: {new Date(lead.expectedMoveIn).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>Type: {lead.housingType}</span>
                        </div>
                        {lead.monthlyIncome && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <DollarSign className="w-3 h-3" />
                            <span>Income: ${lead.monthlyIncome.toLocaleString()}/month</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {lead.notes && (
                      <p className="text-gray-600 text-sm mb-2">{lead.notes}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      {lead.lastContact && (
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>Last contact: {new Date(lead.lastContact).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        className="text-xs px-2 py-1 border border-gray-300 rounded bg-white"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="application_sent">Application Sent</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                        <option value="waitlist">Waitlist</option>
                      </select>
                    </div>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLeads.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No leads found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <Input
                    value={newLead.firstName}
                    onChange={(e) => setNewLead({...newLead, firstName: e.target.value})}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <Input
                    value={newLead.lastName}
                    onChange={(e) => setNewLead({...newLead, lastName: e.target.value})}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={newLead.phone}
                    onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({...newLead, source: e.target.value as Lead['source']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social_media">Social Media</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="walk_in">Walk-in</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={newLead.priority}
                    onChange={(e) => setNewLead({...newLead, priority: e.target.value as Lead['priority']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Housing Type</label>
                  <select
                    value={newLead.housingType}
                    onChange={(e) => setNewLead({...newLead, housingType: e.target.value as Lead['housingType']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="transitional">Transitional</option>
                    <option value="permanent">Permanent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expected Move-in Date</label>
                  <Input
                    type="date"
                    value={newLead.expectedMoveIn}
                    onChange={(e) => setNewLead({...newLead, expectedMoveIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Income</label>
                  <Input
                    type="number"
                    value={newLead.monthlyIncome}
                    onChange={(e) => setNewLead({...newLead, monthlyIncome: e.target.value})}
                    placeholder="2500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <select
                  value={newLead.assignedTo}
                  onChange={(e) => setNewLead({...newLead, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Mike Chen">Mike Chen</option>
                  <option value="Lisa Brown">Lisa Brown</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newLead.notes}
                  onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                  placeholder="Additional notes about the lead..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleAddLead} className="flex-1">Add Lead</Button>
                <Button variant="outline" onClick={() => setShowAddLead(false)} className="flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
        </TabsContent>

        <TabsContent value="ai-attraction">
          <SmartLeadAttraction onLeadQualified={handleAILeadQualified} />
        </TabsContent>
      </Tabs>
    </div>
  );
}