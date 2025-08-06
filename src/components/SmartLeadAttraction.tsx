'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Target, 
  TrendingUp,
  Users,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye,
  MousePointer,
  BarChart3
} from 'lucide-react';
import { AILeadEngine, LeadData, LeadScore, AIInsights } from '@/lib/ai-lead-engine';

interface SmartLeadProps {
  onLeadQualified?: (leadData: LeadData, analysis: { score: LeadScore; insights: AIInsights }) => void;
}

interface AttractionMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgTimeToConversion: number;
  topSources: { source: string; leads: number; quality: number }[];
  hotLeads: number;
  priorityLeads: number;
}

export default function SmartLeadAttraction({ onLeadQualified }: SmartLeadProps) {
  const [leadEngine] = useState(() => AILeadEngine.getInstance());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentAnalysis, setRecentAnalysis] = useState<{ score: LeadScore; insights: AIInsights } | null>(null);
  const [metrics, setMetrics] = useState<AttractionMetrics>({
    totalLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    avgTimeToConversion: 0,
    topSources: [],
    hotLeads: 0,
    priorityLeads: 0
  });
  
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<{
    recommendations: string[];
    optimizations: string[];
    targetAudiences: string[];
    contentSuggestions: string[];
  }>({
    recommendations: [],
    optimizations: [],
    targetAudiences: [],
    contentSuggestions: []
  });

  // Demo form state
  const [demoLead, setDemoLead] = useState<Partial<LeadData>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: '',
    source: 'website'
  });

  useEffect(() => {
    // Load demo metrics
    setMetrics({
      totalLeads: 89,
      qualifiedLeads: 67,
      conversionRate: 75.3,
      avgTimeToConversion: 14,
      topSources: [
        { source: 'referral', leads: 34, quality: 92 },
        { source: 'google_ads', leads: 28, quality: 78 },
        { source: 'website', leads: 19, quality: 71 },
        { source: 'social_media', leads: 8, quality: 58 }
      ],
      hotLeads: 12,
      priorityLeads: 5
    });

    // Load optimization suggestions
    loadOptimizationSuggestions();
  }, []);

  const loadOptimizationSuggestions = async () => {
    try {
      const suggestions = await leadEngine.optimizeAttraction(metrics);
      setOptimizationSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading optimization suggestions:', error);
    }
  };

  const handleDemoAnalysis = async () => {
    if (!demoLead.firstName || !demoLead.message) {
      alert('Please fill in at least first name and message for demo analysis');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const fullLeadData: LeadData = {
        firstName: demoLead.firstName!,
        lastName: demoLead.lastName || '',
        email: demoLead.email || '',
        phone: demoLead.phone,
        inquiryType: demoLead.inquiryType as LeadData['inquiryType'] || 'general',
        message: demoLead.message!,
        source: demoLead.source as LeadData['source'] || 'website',
        currentHousing: 'temporary', // Demo default
        veteranStatus: demoLead.message.toLowerCase().includes('veteran'),
        substanceHistory: demoLead.message.toLowerCase().includes('recovery') || demoLead.message.toLowerCase().includes('sober'),
        hasChildren: demoLead.message.toLowerCase().includes('children') || demoLead.message.toLowerCase().includes('family')
      };

      const analysis = await leadEngine.qualifyLead(fullLeadData);
      setRecentAnalysis(analysis);
      
      // Callback for parent component
      if (onLeadQualified) {
        onLeadQualified(fullLeadData, analysis);
      }
      
    } catch (error) {
      console.error('Demo analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getQualificationBadge = (level: string) => {
    const styles = {
      'priority': 'bg-purple-100 text-purple-800 border-purple-200',
      'hot': 'bg-red-100 text-red-800 border-red-200',
      'warm': 'bg-orange-100 text-orange-800 border-orange-200',
      'cold': 'bg-blue-100 text-blue-800 border-blue-200',
      'unqualified': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return styles[level as keyof typeof styles] || styles.unqualified;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span>Smart Lead Qualification & Attraction</span>
          </h2>
          <p className="text-gray-600">AI-powered lead scoring and optimization</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Zap className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{metrics.totalLeads}</p>
                <p className="text-xs text-green-600">↑ 23% this month</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualified Rate</p>
                <p className="text-2xl font-bold text-green-600">{metrics.conversionRate}%</p>
                <p className="text-xs text-gray-500">{metrics.qualifiedLeads} of {metrics.totalLeads}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.hotLeads}</p>
                <p className="text-xs text-orange-600">Need immediate follow-up</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Priority Leads</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.priorityLeads}</p>
                <p className="text-xs text-purple-600">Highest conversion probability</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Lead Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI Lead Analysis Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <Input
                    value={demoLead.firstName}
                    onChange={(e) => setDemoLead({...demoLead, firstName: e.target.value})}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <Input
                    value={demoLead.lastName}
                    onChange={(e) => setDemoLead({...demoLead, lastName: e.target.value})}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={demoLead.email}
                    onChange={(e) => setDemoLead({...demoLead, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={demoLead.phone}
                    onChange={(e) => setDemoLead({...demoLead, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Inquiry Type</label>
                  <select
                    value={demoLead.inquiryType}
                    onChange={(e) => setDemoLead({...demoLead, inquiryType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="veterans-housing">Veterans Housing</option>
                    <option value="recovery-housing">Recovery Housing</option>
                    <option value="reentry-support">Reentry Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Source</label>
                  <select
                    value={demoLead.source}
                    onChange={(e) => setDemoLead({...demoLead, source: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="social_media">Social Media</option>
                    <option value="walk_in">Walk-in</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={demoLead.message}
                  onChange={(e) => setDemoLead({...demoLead, message: e.target.value})}
                  placeholder="I'm a veteran looking for temporary housing while I get back on my feet. I have a job lined up but need a place to stay for a few months. Can you help me understand the application process?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleDemoAnalysis} 
                disabled={isAnalyzing || !demoLead.firstName || !demoLead.message}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing Lead...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Lead with AI
                  </>
                )}
              </Button>
            </div>

            {/* Analysis Results */}
            <div className="space-y-4">
              {recentAnalysis ? (
                <>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-3 flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4" />
                      <span>AI Analysis Results</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Score:</span>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(recentAnalysis.score.overallScore)}`}>
                          {recentAnalysis.score.overallScore}/100
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Qualification:</span>
                        <Badge className={getQualificationBadge(recentAnalysis.score.qualificationLevel)} variant="outline">
                          {recentAnalysis.score.qualificationLevel.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Conversion Probability:</span>
                        <span className="font-semibold text-green-600">{recentAnalysis.score.conversionProbability}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Urgency:</span>
                        <Badge variant="outline" className={
                          recentAnalysis.score.urgencyLevel === 'urgent' ? 'bg-red-50 text-red-700' :
                          recentAnalysis.score.urgencyLevel === 'high' ? 'bg-orange-50 text-orange-700' :
                          recentAnalysis.score.urgencyLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }>
                          {recentAnalysis.score.urgencyLevel.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Est. Conversion:</span>
                        <span className="font-semibold">{recentAnalysis.score.estimatedTimeToConversion} days</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-semibold mb-2 flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Recommended Actions</span>
                    </h4>
                    <ul className="text-sm space-y-1">
                      {recentAnalysis.score.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg bg-purple-50">
                    <h4 className="font-semibold mb-2 flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>AI Insights</span>
                    </h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium">Best Contact Time:</span>
                        <span className="ml-2">{recentAnalysis.insights.bestContactTime}</span>
                      </div>
                      <div>
                        <span className="font-medium">Communication Style:</span>
                        <span className="ml-2 capitalize">{recentAnalysis.insights.communicationStyle}</span>
                      </div>
                      <div>
                        <span className="font-medium">Personalized Approach:</span>
                        <p className="mt-1 text-xs">{recentAnalysis.insights.personalizedApproach}</p>
                      </div>
                    </div>
                  </div>

                  {recentAnalysis.score.strengths.length > 0 && (
                    <div className="p-4 border rounded-lg bg-green-50">
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Strengths</span>
                      </h4>
                      <ul className="text-sm space-y-1">
                        {recentAnalysis.score.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Fill in the form and click "Analyze Lead" to see AI-powered insights</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Source Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Lead Source Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-gold text-yellow-800' :
                      index === 1 ? 'bg-silver text-gray-700' :
                      index === 2 ? 'bg-bronze text-orange-700' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{source.source.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600">{source.leads} leads</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-sm font-medium ${
                      source.quality >= 80 ? 'bg-green-100 text-green-800' :
                      source.quality >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {source.quality}% quality
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Optimization Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Immediate Actions</h4>
                <ul className="space-y-1">
                  {optimizationSuggestions.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Zap className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Page Optimizations</h4>
                <ul className="space-y-1">
                  {optimizationSuggestions.optimizations.slice(0, 3).map((opt, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <MousePointer className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Target Audiences</h4>
                <div className="flex flex-wrap gap-1">
                  {optimizationSuggestions.targetAudiences.slice(0, 3).map((audience, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}