'use client';
import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Star, 
  Clock, 
  Mail, 
  Phone, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface LeadScore {
  leadId: string;
  name: string;
  email: string;
  inquiryType: string;
  score: number;
  factors: string[];
  priority: 'high' | 'medium' | 'low';
  lastActivity: string;
  nextAction: string;
}

export default function LeadScoringSystem() {
  const [leads, setLeads] = useState<LeadScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadScores();
  }, []);

  const fetchLeadScores = async () => {
    try {
      const response = await fetch('/api/leads/scoring');
      const data = await response.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error('Error fetching lead scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (lead: any): number => {
    let score = 0;
    const factors: string[] = [];

    // Base score for inquiry type
    switch (lead.inquiry_type) {
      case 'veterans':
        score += 25;
        factors.push('Veterans program (+25)');
        break;
      case 'recovery':
        score += 20;
        factors.push('Recovery program (+20)');
        break;
      case 'reentry':
        score += 15;
        factors.push('Re-entry program (+15)');
        break;
    }

    // Engagement factors
    if (lead.sequence_step > 0) {
      score += lead.sequence_step * 5;
      factors.push(`Email sequence step ${lead.sequence_step} (+${lead.sequence_step * 5})`);
    }

    // Recency factor
    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCreated <= 1) {
      score += 20;
      factors.push('Created today (+20)');
    } else if (daysSinceCreated <= 3) {
      score += 15;
      factors.push('Created this week (+15)');
    } else if (daysSinceCreated <= 7) {
      score += 10;
      factors.push('Created this month (+10)');
    }

    // Status factors
    switch (lead.status) {
      case 'new':
        score += 10;
        factors.push('New lead (+10)');
        break;
      case 'contacted':
        score += 15;
        factors.push('Contacted (+15)');
        break;
      case 'qualified':
        score += 25;
        factors.push('Qualified (+25)');
        break;
    }

    // Phone number bonus
    if (lead.phone) {
      score += 5;
      factors.push('Has phone number (+5)');
    }

    return score;
  };

  const getPriority = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lead Scoring System</h2>
            <p className="text-gray-600">Automatically prioritize leads based on engagement and qualification</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {leads.filter(l => l.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {leads.filter(l => l.priority === 'medium').length}
              </div>
              <div className="text-sm text-gray-600">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {leads.filter(l => l.priority === 'low').length}
              </div>
              <div className="text-sm text-gray-600">Low Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Program Type</h3>
              <p className="text-sm text-gray-600">Veterans: +25, Recovery: +20, Re-entry: +15</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Engagement</h3>
              <p className="text-sm text-gray-600">Each sequence step: +5 points</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Recency</h3>
              <p className="text-sm text-gray-600">Today: +20, This week: +15, This month: +10</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Info</h3>
              <p className="text-sm text-gray-600">Phone number: +5, Qualified: +25</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Scores Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lead Priority Queue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads
                .sort((a, b) => b.score - a.score)
                .map((lead) => (
                <tr key={lead.leadId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lead.name}
                      </div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </div>
                    <div className="text-xs text-gray-500">
                      {lead.factors.length} factors
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                      {lead.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.inquiryType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.lastActivity).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.nextAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leads.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No leads to score</h3>
            <p className="mt-1 text-sm text-gray-500">
              Lead scoring will appear once you have leads in your system.
            </p>
          </div>
        )}
      </div>

      {/* Scoring Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">High Priority Actions</h3>
          <div className="space-y-3">
            {leads
              .filter(l => l.priority === 'high')
              .slice(0, 5)
              .map((lead) => (
              <div key={lead.leadId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{lead.name}</div>
                  <div className="text-sm text-gray-600">{lead.nextAction}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{lead.score}</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="font-semibold">
                {leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">High Priority Rate</span>
              <span className="font-semibold">
                {leads.length > 0 ? Math.round((leads.filter(l => l.priority === 'high').length / leads.length) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Top Program</span>
              <span className="font-semibold">
                {leads.length > 0 ? 
                  Object.entries(
                    leads.reduce((acc, l) => {
                      acc[l.inquiryType] = (acc[l.inquiryType] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A' : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
