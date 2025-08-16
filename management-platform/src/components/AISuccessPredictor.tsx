'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target,
  Lightbulb,
  Clock,
  Users
} from 'lucide-react';

interface SuccessPrediction {
  residentId: string;
  residentName: string;
  successProbability: number;
  riskLevel: 'low' | 'medium' | 'high';
  keyFactors: string[];
  recommendations: string[];
  confidenceScore: number;
  timeToGraduation: number; // months
  interventionNeeded: boolean;
}

interface AISuccessPredictorProps {
  residents?: any[];
  onResidentSelect?: (residentId: string) => void;
}

export default function AISuccessPredictor({ residents = [], onResidentSelect }: AISuccessPredictorProps) {
  const [predictions, setPredictions] = useState<SuccessPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview');

  // Mock AI predictions - In production, this would call your AI service
  useEffect(() => {
    generatePredictions();
  }, [residents]);

  const generatePredictions = async () => {
    setLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock predictions based on resident data
    const mockPredictions: SuccessPrediction[] = [
      {
        residentId: '1',
        residentName: 'Marcus Johnson',
        successProbability: 85,
        riskLevel: 'low',
        keyFactors: ['Consistent attendance', 'Strong support network', 'Employment secured'],
        recommendations: ['Continue current programming', 'Consider leadership role'],
        confidenceScore: 92,
        timeToGraduation: 4,
        interventionNeeded: false
      },
      {
        residentId: '2',
        residentName: 'Sarah Williams',
        successProbability: 45,
        riskLevel: 'high',
        keyFactors: ['Missed counseling sessions', 'Family stress', 'No stable employment'],
        recommendations: ['Increase counseling frequency', 'Connect with job placement services', 'Family mediation'],
        confidenceScore: 78,
        timeToGraduation: 8,
        interventionNeeded: true
      },
      {
        residentId: '3',
        residentName: 'David Chen',
        successProbability: 72,
        riskLevel: 'medium',
        keyFactors: ['Good program compliance', 'Peer conflicts', 'Financial challenges'],
        recommendations: ['Mediation with roommates', 'Financial literacy program', 'Stress management'],
        confidenceScore: 85,
        timeToGraduation: 6,
        interventionNeeded: true
      },
      {
        residentId: '4',
        residentName: 'Jennifer Davis',
        successProbability: 91,
        riskLevel: 'low',
        keyFactors: ['Excellent progress', 'Active in community', 'Stable relationships'],
        recommendations: ['Mentor other residents', 'Transition planning focus'],
        confidenceScore: 96,
        timeToGraduation: 3,
        interventionNeeded: false
      }
    ];
    
    setPredictions(mockPredictions);
    setLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'high': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallStats = {
    averageSuccess: Math.round(predictions.reduce((sum, p) => sum + p.successProbability, 0) / predictions.length) || 0,
    highRisk: predictions.filter(p => p.riskLevel === 'high').length,
    needingIntervention: predictions.filter(p => p.interventionNeeded).length,
    onTrack: predictions.filter(p => p.successProbability >= 70).length
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
            <span>AI Success Predictor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Brain className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
              <p className="text-lg font-medium">Analyzing resident data...</p>
              <p className="text-gray-600">AI is processing behavioral patterns and outcomes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{overallStats.averageSuccess}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{overallStats.highRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Need Intervention</p>
                <p className="text-2xl font-bold text-orange-600">{overallStats.needingIntervention}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">On Track</p>
                <p className="text-2xl font-bold text-green-600">{overallStats.onTrack}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main AI Predictor Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Success Predictions</span>
              <Badge variant="outline" className="text-purple-700 border-purple-300">
                Powered by ML
              </Badge>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedView === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('overview')}
              >
                Overview
              </Button>
              <Button
                variant={selectedView === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('detailed')}
              >
                Detailed
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generatePredictions}
                className="text-purple-600"
              >
                <Brain className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {selectedView === 'overview' ? (
            <div className="grid gap-4">
              {predictions.map((prediction) => (
                <div
                  key={prediction.residentId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onResidentSelect?.(prediction.residentId)}
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{prediction.residentName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getRiskColor(prediction.riskLevel)} variant="outline">
                          {prediction.riskLevel.toUpperCase()} RISK
                        </Badge>
                        {prediction.interventionNeeded && (
                          <Badge variant="outline" className="text-orange-700 bg-orange-50">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Intervention Needed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {prediction.successProbability >= 70 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-2xl font-bold ${getSuccessColor(prediction.successProbability)}`}>
                        {prediction.successProbability}%
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {prediction.timeToGraduation} months to completion
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {predictions.map((prediction) => (
                <Card key={prediction.residentId} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Resident Info & Prediction */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{prediction.residentName}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-3xl font-bold ${getSuccessColor(prediction.successProbability)}`}>
                              {prediction.successProbability}%
                            </span>
                            <span className="text-gray-600">Success Probability</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getRiskColor(prediction.riskLevel)} variant="outline">
                              {prediction.riskLevel.toUpperCase()} RISK
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {prediction.confidenceScore}% confidence
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Key Factors */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Key Factors
                        </h4>
                        <ul className="space-y-1">
                          {prediction.keyFactors.map((factor, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-1 text-yellow-600" />
                          AI Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {prediction.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <CheckCircle className="w-3 h-3 mt-1 mr-2 text-green-600 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            Estimated completion: {prediction.timeToGraduation} months
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {prediction.interventionNeeded && (
                      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                          <span className="text-sm font-medium text-orange-800">
                            Immediate intervention recommended
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}