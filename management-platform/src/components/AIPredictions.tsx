"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { aiEngine, PredictionResult, Recommendation, AnomalyDetection } from "../utils/aiEngine";

interface AIPredictionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIPredictions({ isOpen, onClose }: AIPredictionsProps) {
  const [activeTab, setActiveTab] = useState<'predictions' | 'recommendations' | 'anomalies' | 'nlp'>('predictions');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [nlpQuery, setNlpQuery] = useState('');
  const [nlpResults, setNlpResults] = useState<any>(null);
  const [modelPerformance, setModelPerformance] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      loadData();
      loadModelPerformance();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [occupancyPred, revenuePred, staffingPred, maintenancePreds] = await Promise.all([
        aiEngine.predictOccupancy(30),
        aiEngine.predictRevenue(6),
        aiEngine.predictStaffingNeeds(4),
        aiEngine.predictMaintenanceNeeds('facility-1')
      ]);

      setPredictions([
        { ...occupancyPred, id: 'occupancy', title: 'Occupancy Rate' },
        { ...revenuePred, id: 'revenue', title: 'Revenue Forecast' },
        { ...staffingPred, id: 'staffing', title: 'Staffing Needs' },
        ...maintenancePreds.map((pred, index) => ({ ...pred, id: `maintenance-${index}`, title: `Equipment ${index + 1}` }))
      ]);

      const recs = await aiEngine.generateRecommendations();
      setRecommendations(recs);

      const anoms = await aiEngine.detectAnomalies();
      setAnomalies(anoms);

    } catch (error) {
      toast.error('Failed to load AI predictions');
    } finally {
      setLoading(false);
    }
  };

  const loadModelPerformance = async () => {
    try {
      const performance = {
        occupancy: await aiEngine.getPredictionAccuracy('occupancy'),
        revenue: await aiEngine.getPredictionAccuracy('revenue'),
        staffing: await aiEngine.getPredictionAccuracy('staffing')
      };
      setModelPerformance(performance);
    } catch (error) {
      console.error('Failed to load model performance:', error);
    }
  };

  const handleNLPQuery = async () => {
    if (!nlpQuery.trim()) return;

    setLoading(true);
    try {
      const results = await aiEngine.searchWithNLP(nlpQuery);
      const insights = await aiEngine.generateInsights(nlpQuery);
      setNlpResults({ results, insights });
    } catch (error) {
      toast.error('Failed to process query');
    } finally {
      setLoading(false);
    }
  };

  const getPredictionColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'predictions', label: 'Predictions', icon: '🔮' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
    { id: 'anomalies', label: 'Anomalies', icon: '⚠️' },
    { id: 'nlp', label: 'AI Chat', icon: '🤖' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Predictions & Insights</h2>
            <p className="text-gray-600">Advanced machine learning predictions and smart recommendations</p>
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
          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
                <div className="text-sm text-gray-600">
                  Model Accuracy: {Object.values(modelPerformance).length > 0 ? 
                    `${(Object.values(modelPerformance).reduce((a: number, b: number) => a + b, 0) / Object.values(modelPerformance).length * 100).toFixed(1)}%` : 
                    'Calculating...'
                  }
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Generating predictions...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {predictions.map((prediction) => (
                    <div key={prediction.id} className="bg-white p-6 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{prediction.title}</h4>
                        <span className={`text-sm font-medium ${getPredictionColor(prediction.trend)}`}>
                          {prediction.trend}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {typeof prediction.prediction === 'number' 
                              ? prediction.prediction.toLocaleString()
                              : prediction.prediction
                            }
                          </p>
                          <p className="text-sm text-gray-600">{prediction.timeframe}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Confidence</span>
                          <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                            {(prediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${prediction.confidence * 100}%` }}
                          ></div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Key Factors:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {prediction.factors.map((factor, index) => (
                              <li key={index}>• {factor}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Smart Recommendations</h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Generating recommendations...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((recommendation) => (
                    <div key={recommendation.id} className="bg-white p-6 rounded-lg border shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                              {recommendation.priority}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              recommendation.impact === 'high' ? 'bg-purple-100 text-purple-800' :
                              recommendation.impact === 'medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {recommendation.impact} impact
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{recommendation.description}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getConfidenceColor(recommendation.confidence)}`}>
                            {(recommendation.confidence * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Action Items:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {recommendation.actionItems.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          {recommendation.estimatedSavings && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-green-800">Estimated Savings</p>
                              <p className="text-lg font-bold text-green-600">
                                ${recommendation.estimatedSavings.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'anomalies' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Anomaly Detection</h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Detecting anomalies...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {anomalies.map((anomaly) => (
                    <div key={anomaly.id} className={`p-6 rounded-lg border-l-4 ${getSeverityColor(anomaly.severity)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{anomaly.description}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                              {anomaly.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Detected: {anomaly.detectedAt.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getConfidenceColor(anomaly.confidence)}`}>
                            {(anomaly.confidence * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {anomaly.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Data:</p>
                          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                            {JSON.stringify(anomaly.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'nlp' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">AI Chat & Natural Language Processing</h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={nlpQuery}
                    onChange={(e) => setNlpQuery(e.target.value)}
                    placeholder="Ask me anything about your facility data..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleNLPQuery()}
                  />
                  <button
                    onClick={handleNLPQuery}
                    disabled={loading || !nlpQuery.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Ask AI'}
                  </button>
                </div>

                {nlpResults && (
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3">AI Response</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Insights:</p>
                        <p className="text-gray-600">{nlpResults.insights}</p>
                      </div>

                      {nlpResults.results.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Related Data:</p>
                          <div className="space-y-2">
                            {nlpResults.results.map((result: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-3 rounded">
                                <p className="text-sm font-medium">{result.type}</p>
                                <p className="text-sm text-gray-600">{result.data}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Example Queries:</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>• &quot;Predict occupancy for next month&quot;</p>
                    <p>• &quot;Show me revenue trends&quot;</p>
                    <p>• &quot;Recommend ways to improve efficiency&quot;</p>
                    <p>• &quot;Analyze staff performance&quot;</p>
                    <p>• &quot;What are the maintenance needs?&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 