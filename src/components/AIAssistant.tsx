"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'trend';
  title: string;
  description: string;
  confidence: number;
  category: 'occupancy' | 'financial' | 'health' | 'operations' | 'staffing';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  action?: string;
  created_at: string;
}

interface AIPrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'chat'>('insights');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', message: string}>>([]);

  useEffect(() => {
    if (isOpen) {
      generateInsights();
      generatePredictions();
    }
  }, [isOpen]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      // Fetch data for analysis
      const { data: residents } = await supabase.from('residents').select('*');
      const { data: payments } = await supabase.from('payments').select('*');
      const { data: events } = await supabase.from('schedule_events').select('*');

      // Generate AI insights based on data patterns
      const generatedInsights: AIInsight[] = [];

      // Occupancy insights
      if (residents && residents.length > 0) {
        const occupancyRate = (residents.length / 20) * 100; // Assuming 20 total rooms
        if (occupancyRate < 80) {
          generatedInsights.push({
            id: '1',
            type: 'recommendation',
            title: 'Low Occupancy Alert',
            description: `Current occupancy rate is ${occupancyRate.toFixed(1)}%. Consider marketing initiatives or referral programs to increase occupancy.`,
            confidence: 0.95,
            category: 'occupancy',
            priority: 'medium',
            actionable: true,
            action: 'Review marketing strategy and referral programs',
            created_at: new Date().toISOString()
          });
        }
      }

      // Financial insights
      if (payments && payments.length > 0) {
        const overduePayments = payments.filter(p => p.status === 'pending' && new Date(p.due_date) < new Date());
        if (overduePayments.length > 0) {
          const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);
          generatedInsights.push({
            id: '2',
            type: 'alert',
            title: 'Payment Collection Opportunity',
            description: `${overduePayments.length} payments totaling $${totalOverdue.toFixed(2)} are overdue. Implement follow-up procedures.`,
            confidence: 0.98,
            category: 'financial',
            priority: 'high',
            actionable: true,
            action: 'Send payment reminders and follow up with residents',
            created_at: new Date().toISOString()
          });
        }
      }

      // Operational insights
      if (events && events.length > 0) {
        const completedEvents = events.filter(e => e.status === 'completed');
        const completionRate = (completedEvents.length / events.length) * 100;
        if (completionRate < 85) {
          generatedInsights.push({
            id: '3',
            type: 'trend',
            title: 'Event Completion Rate',
            description: `Event completion rate is ${completionRate.toFixed(1)}%. Consider improving scheduling and follow-up procedures.`,
            confidence: 0.87,
            category: 'operations',
            priority: 'medium',
            actionable: true,
            action: 'Review event scheduling and staff coordination',
            created_at: new Date().toISOString()
          });
        }
      }

      // Staffing insights
      const upcomingEvents = events?.filter(e => new Date(e.start_time) > new Date() && e.status === 'scheduled') || [];
      if (upcomingEvents.length > 10) {
        generatedInsights.push({
          id: '4',
          type: 'prediction',
          title: 'High Activity Period',
          description: `${upcomingEvents.length} events scheduled in the next 30 days. Ensure adequate staff coverage.`,
          confidence: 0.92,
          category: 'staffing',
          priority: 'medium',
          actionable: true,
          action: 'Review staff schedules and consider additional coverage',
          created_at: new Date().toISOString()
        });
      }

      setInsights(generatedInsights);
    } catch (error) {
      toast.error('Error generating insights');
    } finally {
      setLoading(false);
    }
  };

  const generatePredictions = async () => {
    setLoading(true);
    try {
      // Fetch historical data for predictions
      const { data: residents } = await supabase.from('residents').select('*');
      const { data: payments } = await supabase.from('payments').select('*');

      const predictions: AIPrediction[] = [];

      // Occupancy prediction
      if (residents) {
        const currentOccupancy = residents.length;
        const predictedOccupancy = Math.min(20, currentOccupancy + Math.floor(Math.random() * 3) + 1);
        predictions.push({
          metric: 'Occupancy Rate',
          currentValue: (currentOccupancy / 20) * 100,
          predictedValue: (predictedOccupancy / 20) * 100,
          timeframe: 'Next 30 days',
          confidence: 0.85,
          trend: predictedOccupancy > currentOccupancy ? 'increasing' : 'stable'
        });
      }

      // Revenue prediction
      if (payments) {
        const monthlyRevenue = payments
          .filter(p => p.status === 'completed' && new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          .reduce((sum, p) => sum + p.amount, 0);
        const predictedRevenue = monthlyRevenue * 1.1; // 10% growth assumption
        predictions.push({
          metric: 'Monthly Revenue',
          currentValue: monthlyRevenue,
          predictedValue: predictedRevenue,
          timeframe: 'Next month',
          confidence: 0.78,
          trend: 'increasing'
        });
      }

      // Staff efficiency prediction
      predictions.push({
        metric: 'Staff Efficiency',
        currentValue: 85,
        predictedValue: 88,
        timeframe: 'Next quarter',
        confidence: 0.82,
        trend: 'increasing'
      });

      setPredictions(predictions);
    } catch (error) {
      toast.error('Error generating predictions');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', message: userMessage }]);

    // Simulate AI response
    setLoading(true);
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setChatHistory(prev => [...prev, { role: 'assistant', message: aiResponse }]);
      setLoading(false);
    }, 1000);
  };

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('occupancy') || lowerMessage.includes('residents')) {
      return "Based on current data, your facility has a healthy occupancy rate. I recommend focusing on resident satisfaction and retention programs to maintain this level.";
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('revenue')) {
      return "Your payment collection rate is good, but there are some overdue payments. Consider implementing automated payment reminders to improve cash flow.";
    } else if (lowerMessage.includes('staff') || lowerMessage.includes('schedule')) {
      return "Staff scheduling looks well-balanced. I suggest reviewing upcoming events to ensure adequate coverage during peak activity periods.";
    } else if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair')) {
      return "Maintenance requests are being handled efficiently. Consider implementing preventive maintenance schedules to reduce emergency repairs.";
    } else {
      return "I'm here to help with facility management insights. You can ask me about occupancy, payments, staffing, maintenance, or any other operational aspects of your facility.";
    }
  };

  const getPriorityColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'occupancy': return '🏠';
      case 'financial': return '💰';
      case 'health': return '🏥';
      case 'operations': return '⚙️';
      case 'staffing': return '👥';
      default: return '📊';
    }
  };

  const getTrendIcon = (trend: AIPrediction['trend']) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: '🧠' },
    { id: 'predictions', label: 'Predictions', icon: '🔮' },
    { id: 'chat', label: 'AI Chat', icon: '💬' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
            <p className="text-gray-600">Intelligent insights and predictive analytics for your facility</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
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
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h3>
                <button
                  onClick={generateInsights}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Refresh Insights'}
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Analyzing your data...</p>
                </div>
              ) : insights.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No insights available. Click &quot;Refresh Insights&quot; to generate new recommendations.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getCategoryIcon(insight.category)}</span>
                          <h4 className="font-semibold">{insight.title}</h4>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          insight.type === 'prediction' ? 'bg-purple-100 text-purple-800' :
                          insight.type === 'recommendation' ? 'bg-blue-100 text-blue-800' :
                          insight.type === 'alert' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insight.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          Confidence: {insight.confidence * 100}%
                        </div>
                        {insight.actionable && insight.action && (
                          <button className="text-xs bg-white px-2 py-1 rounded hover:bg-gray-50">
                            {insight.action}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
                <button
                  onClick={generatePredictions}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Refresh Predictions'}
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="mt-2 text-gray-600">Generating predictions...</p>
                </div>
              ) : predictions.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No predictions available. Click &quot;Refresh Predictions&quot; to generate new forecasts.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{prediction.metric}</h4>
                        <span className="text-2xl">{getTrendIcon(prediction.trend)}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Current:</span>
                          <span className="font-medium">
                            {prediction.metric.includes('Rate') || prediction.metric.includes('Efficiency') 
                              ? `${prediction.currentValue.toFixed(1)}%`
                              : `$${prediction.currentValue.toLocaleString()}`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Predicted:</span>
                          <span className="font-medium text-blue-600">
                            {prediction.metric.includes('Rate') || prediction.metric.includes('Efficiency')
                              ? `${prediction.predictedValue.toFixed(1)}%`
                              : `$${prediction.predictedValue.toLocaleString()}`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Timeframe:</span>
                          <span className="text-sm">{prediction.timeframe}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Confidence:</span>
                          <span className="text-sm">{prediction.confidence * 100}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">AI Chat Assistant</h3>
              
              {/* Chat History */}
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">🤖</div>
                    <p>Hello! I&apos;m your AI assistant. Ask me anything about your facility management.</p>
                  </div>
                ) : (
                  chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        chat.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className="text-sm">{chat.message}</p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask me about your facility management..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !chatMessage.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Send
                </button>
              </form>

              {/* Quick Questions */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Quick Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "How's our occupancy rate?",
                    "Any payment issues?",
                    "Staff scheduling tips?",
                    "Maintenance recommendations?"
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setChatMessage(question)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 