"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'toured' | 'interested' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeline: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
}

interface MarketingCampaign {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  metrics: {
    clicks: number;
    conversions: number;
  };
}

interface VirtualTour {
  id: string;
  title: string;
  type: string;
  description: string;
  rooms: any[];
  amenities: any[];
  testimonials: any[];
}

interface FacilityShowcase {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  availability: any[];
}

interface ConversionFunnel {
  id: string;
  name: string;
  stages: any[];
  metrics: {
    totalLeads: number;
    qualifiedLeads: number;
    tours: number;
    conversions: number;
  };
}

interface AcquisitionHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AcquisitionHub({ isOpen, onClose }: AcquisitionHubProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'campaigns' | 'tours' | 'showcase' | 'funnel'>('overview');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [virtualTours, setVirtualTours] = useState<VirtualTour[]>([]);
  const [showcases, setShowcases] = useState<FacilityShowcase[]>([]);
  const [funnel, setFunnel] = useState<ConversionFunnel | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate loading data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockLeads: Lead[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-0123',
          source: 'website',
          status: 'qualified',
          priority: 'high',
          timeline: 'within_30_days',
          budget: { min: 3000, max: 5000, currency: 'USD' }
        }
      ];

      const mockCampaigns: MarketingCampaign[] = [
        {
          id: '1',
          name: 'Summer Campaign',
          type: 'social_media',
          status: 'active',
          budget: 5000,
          spent: 2500,
          metrics: { clicks: 150, conversions: 12 }
        }
      ];

      const mockAnalytics = {
        totalLeads: 45,
        convertedLeads: 8,
        conversionRate: 17.8,
        totalRevenue: 125000
      };

      setLeads(mockLeads);
      setCampaigns(mockCampaigns);
      setAnalytics(mockAnalytics);

    } catch (error) {
      toast.error('Failed to load acquisition data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (leadData: any) => {
    try {
      const newLead: Lead = {
        id: Date.now().toString(),
        ...leadData
      };
      setLeads(prev => [newLead, ...prev]);
      setShowCreateLead(false);
      toast.success('Lead created successfully');
    } catch (error) {
      toast.error('Failed to create lead');
    }
  };

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      const newCampaign: MarketingCampaign = {
        id: Date.now().toString(),
        ...campaignData,
        status: 'draft',
        spent: 0,
        metrics: { clicks: 0, conversions: 0 }
      };
      setCampaigns(prev => [newCampaign, ...prev]);
      setShowCreateCampaign(false);
      toast.success('Campaign created successfully');
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: Lead['status'], notes?: string) => {
    try {
      const updatedLead = leads.find(lead => lead.id === leadId);
      if (updatedLead) {
        updatedLead.status = status;
        setLeads(prev => prev.map(lead => lead.id === leadId ? updatedLead : lead));
        toast.success('Lead status updated');
      }
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'text-green-600 bg-green-100';
      case 'interested': return 'text-blue-600 bg-blue-100';
      case 'toured': return 'text-purple-600 bg-purple-100';
      case 'qualified': return 'text-yellow-600 bg-yellow-100';
      case 'contacted': return 'text-orange-600 bg-orange-100';
      case 'new': return 'text-gray-600 bg-gray-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'text-blue-600 bg-blue-100';
      case 'social_media': return 'text-purple-600 bg-purple-100';
      case 'referral': return 'text-green-600 bg-green-100';
      case 'advertising': return 'text-orange-600 bg-orange-100';
      case 'event': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'leads', label: 'Leads', icon: '👥' },
    { id: 'campaigns', label: 'Campaigns', icon: '📢' },
    { id: 'tours', label: 'Virtual Tours', icon: '🏠' },
    { id: 'showcase', label: 'Showcase', icon: '✨' },
    { id: 'funnel', label: 'Conversion', icon: '📈' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Acquisition Hub</h2>
            <p className="text-gray-600">Lead generation, marketing campaigns, and conversion tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Acquisition Overview</h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading acquisition data...</p>
                </div>
              ) : analytics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Leads</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.totalLeads}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Conversions</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.convertedLeads}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${analytics.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Lead Management</h3>
                <button
                  onClick={() => setShowCreateLead(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Lead
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading leads...</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lead
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timeline
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Budget
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.firstName} {lead.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{lead.email}</div>
                                <div className="text-sm text-gray-500">{lead.phone}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceColor(lead.source)}`}>
                                {lead.source.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                                {lead.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lead.timeline.replace('_', ' ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${lead.budget.min.toLocaleString()} - ${lead.budget.max.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                View
                              </button>
                              <select
                                onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                                value={lead.status}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="toured">Toured</option>
                                <option value="interested">Interested</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Marketing Campaigns</h3>
                <button
                  onClick={() => setShowCreateCampaign(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Create Campaign
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading campaigns...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white p-6 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Type</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">{campaign.type.replace('_', ' ')}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="text-sm font-medium text-gray-900">
                            ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Performance</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Clicks:</span>
                              <span className="font-medium text-gray-900 ml-1">{campaign.metrics.clicks}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Conversions:</span>
                              <span className="font-medium text-gray-900 ml-1">{campaign.metrics.conversions}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-3">
                          <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                            View Details
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tours' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Virtual Tours</h3>
              <p className="text-gray-600">Virtual tour management features coming soon...</p>
            </div>
          )}

          {activeTab === 'showcase' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Facility Showcase</h3>
              <p className="text-gray-600">Facility showcase features coming soon...</p>
            </div>
          )}

          {activeTab === 'funnel' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
              <p className="text-gray-600">Conversion funnel analytics coming soon...</p>
            </div>
          )}
        </div>

        {/* Create Lead Modal */}
        {showCreateLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Lead</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateLead({
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  source: formData.get('source') as string,
                  priority: formData.get('priority') as string,
                  timeline: formData.get('timeline') as string,
                  budget: {
                    min: parseInt(formData.get('budgetMin') as string),
                    max: parseInt(formData.get('budgetMax') as string),
                    currency: 'USD'
                  }
                });
              }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateLead(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Campaign Modal */}
        {showCreateCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Marketing Campaign</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateCampaign({
                  name: formData.get('name') as string,
                  type: formData.get('type') as string,
                  budget: parseInt(formData.get('budget') as string)
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select name="type" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="email">Email</option>
                      <option value="social_media">Social Media</option>
                      <option value="ppc">PPC</option>
                      <option value="content">Content</option>
                      <option value="event">Event</option>
                      <option value="referral">Referral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <input
                      type="number"
                      name="budget"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateCampaign(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 