'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  firstName: string;
  email: string;
  inquiryType: string;
  sequenceStep: number;
  status: 'active' | 'converted' | 'inactive';
  createdAt: string;
  lastEmailSent?: string;
}

export default function EmailSequencesAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    emailsSentToday: 0
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // In production, this would have proper authentication
      const response = await fetch('/api/cron/email-sequences', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET || 'dev-secret'}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
        setStats({
          totalLeads: data.totalLeads || 0,
          activeLeads: data.activeLeads || 0,
          emailsSentToday: 0 // Would be calculated from today's email logs
        });
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerEmailSequence = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cron/email-sequences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET || 'dev-secret'}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`✅ Email sequence completed!\n${result.emailsSent} emails sent\n${result.actionItemsCreated} action items created`);
        fetchLeads(); // Refresh data
      } else {
        alert('❌ Failed to trigger email sequence');
      }
    } catch (error) {
      console.error('Error triggering sequence:', error);
      alert('❌ Error triggering email sequence');
    } finally {
      setLoading(false);
    }
  };

  const getSequenceInfo = (inquiryType: string, step: number) => {
    const sequences = {
      'veteran-housing': [
        { day: 0, title: 'Welcome Email + Benefits Guide' },
        { day: 1, title: 'Next Steps: Application Process' },
        { day: 3, title: 'Follow-up: Housing Still Available' },
        { day: 7, title: 'Final Notice: Reservation Expires' }
      ],
      'sober-living': [
        { day: 0, title: 'Welcome Email + Recovery Guide' },
        { day: 1, title: 'Day 2: House Rules & Structure' },
        { day: 4, title: 'Support Network Waiting' }
      ],
      'Re-entry-housing': [
        { day: 0, title: 'Welcome Email + Planning Kit' },
        { day: 2, title: 'Week 1: Document Action Plan' },
        { day: 5, title: 'Employment Opportunities' }
      ]
    };

    const sequence = sequences[inquiryType as keyof typeof sequences] || [];
    const currentStep = sequence[step];
    
    return {
      current: currentStep?.title || 'Sequence Complete',
      total: sequence.length,
      isComplete: step >= sequence.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading email sequences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Sequence Management</h1>
          <p className="text-gray-600">Monitor and manage automated email workflows for leads</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active in Sequences</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emails Sent Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emailsSentToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={triggerEmailSequence}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Run Email Sequences Now'}
            </button>
            <button
              onClick={fetchLeads}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50"
            >
              Refresh Data
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Email sequences automatically run daily at 9:00 AM. Use "Run Now" for testing or manual execution.
          </p>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lead Management</h2>
          </div>
          
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📭</span>
              <p className="text-gray-600">No leads in email sequences yet</p>
              <p className="text-sm text-gray-500 mt-2">Leads will appear here after form submissions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sequence Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => {
                    const sequenceInfo = getSequenceInfo(lead.inquiryType, lead.sequenceStep);
                    return (
                      <tr key={lead.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.firstName}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {lead.inquiryType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              Step {lead.sequenceStep}/{sequenceInfo.total}
                            </div>
                            <div className="text-xs text-gray-500">{sequenceInfo.current}</div>
                            {sequenceInfo.isComplete && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                Complete
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.status === 'active' ? 'bg-green-100 text-green-800' :
                            lead.status === 'converted' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.lastEmailSent ? new Date(lead.lastEmailSent).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Email Sequence Templates Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Sequence Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🇺🇸 Veterans Housing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Day 0: Benefits Guide + Welcome</li>
                <li>Day 1: Application Process</li>
                <li>Day 3: Follow-up Reminder</li>
                <li>Day 7: Final Notice</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🌟 Recovery Housing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Day 0: Recovery Guide + Welcome</li>
                <li>Day 1: House Rules & Structure</li>
                <li>Day 4: Support Network</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">🔑 Re-entry Housing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Day 0: Planning Kit + Welcome</li>
                <li>Day 2: Document Action Plan</li>
                <li>Day 5: Employment Opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}