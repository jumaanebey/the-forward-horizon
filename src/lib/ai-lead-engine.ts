'use client';

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: 'veterans-housing' | 'recovery-housing' | 'reentry-support' | 'general';
  message: string;
  source: 'website' | 'referral' | 'social_media' | 'google_ads' | 'walk_in';
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  housingNeeds?: string;
  timeline?: string;
  monthlyIncome?: number;
  hasChildren?: boolean;
  veteranStatus?: boolean;
  substanceHistory?: boolean;
  criminalHistory?: boolean;
  currentHousing?: 'homeless' | 'temporary' | 'unstable' | 'stable';
}

export interface LeadScore {
  overallScore: number; // 0-100
  qualificationLevel: 'unqualified' | 'cold' | 'warm' | 'hot' | 'priority';
  conversionProbability: number; // 0-100
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  recommendedActions: string[];
  riskFactors: string[];
  strengths: string[];
  nextSteps: string[];
  estimatedTimeToConversion: number; // days
  assignedPriority: number; // 1-10
}

export interface AIInsights {
  sentimentScore: number; // -1 to 1
  intentStrength: number; // 0-100
  painPoints: string[];
  motivations: string[];
  objections: string[];
  personalizedApproach: string;
  bestContactTime: string;
  communicationStyle: 'formal' | 'casual' | 'empathetic' | 'direct';
}

export class AILeadEngine {
  private static instance: AILeadEngine;
  
  public static getInstance(): AILeadEngine {
    if (!AILeadEngine.instance) {
      AILeadEngine.instance = new AILeadEngine();
    }
    return AILeadEngine.instance;
  }

  // AI-powered lead qualification
  async qualifyLead(leadData: LeadData): Promise<{ score: LeadScore; insights: AIInsights }> {
    try {
      // Simulate AI analysis (in production, this would call OpenAI/Claude API)
      const score = await this.calculateLeadScore(leadData);
      const insights = await this.generateAIInsights(leadData);
      
      // Log for tracking and improvement
      this.logLeadAnalysis(leadData, score, insights);
      
      return { score, insights };
    } catch (error) {
      console.error('Lead qualification error:', error);
      return this.getFallbackScore(leadData);
    }
  }

  private async calculateLeadScore(leadData: LeadData): Promise<LeadScore> {
    let baseScore = 50;
    const factors = {
      urgency: 0,
      fit: 0,
      intent: 0,
      capacity: 0,
      source: 0
    };

    // Analyze urgency indicators
    factors.urgency = this.analyzeUrgency(leadData);
    
    // Program fit analysis
    factors.fit = this.analyzeProgramFit(leadData);
    
    // Intent strength analysis
    factors.intent = this.analyzeIntent(leadData);
    
    // Financial capacity analysis
    factors.capacity = this.analyzeCapacity(leadData);
    
    // Source quality analysis
    factors.source = this.analyzeSource(leadData);

    // Calculate weighted score
    const overallScore = Math.min(100, Math.max(0, 
      baseScore + 
      (factors.urgency * 0.25) + 
      (factors.fit * 0.30) + 
      (factors.intent * 0.20) + 
      (factors.capacity * 0.15) + 
      (factors.source * 0.10)
    ));

    // Determine qualification level
    const qualificationLevel = this.getQualificationLevel(overallScore);
    
    // Generate recommendations
    const recommendedActions = this.generateRecommendations(leadData, overallScore);
    const riskFactors = this.identifyRiskFactors(leadData);
    const strengths = this.identifyStrengths(leadData);
    const nextSteps = this.generateNextSteps(leadData, overallScore);

    return {
      overallScore: Math.round(overallScore),
      qualificationLevel,
      conversionProbability: Math.round(overallScore * 0.8), // Slightly lower than overall score
      urgencyLevel: this.mapUrgencyLevel(factors.urgency),
      recommendedActions,
      riskFactors,
      strengths,
      nextSteps,
      estimatedTimeToConversion: this.estimateConversionTime(overallScore, leadData),
      assignedPriority: Math.ceil(overallScore / 10)
    };
  }

  private analyzeUrgency(leadData: LeadData): number {
    let urgencyScore = 0;
    
    // Housing situation urgency
    switch (leadData.currentHousing) {
      case 'homeless': urgencyScore += 40; break;
      case 'temporary': urgencyScore += 30; break;
      case 'unstable': urgencyScore += 20; break;
      case 'stable': urgencyScore += 5; break;
    }
    
    // Timeline urgency
    if (leadData.timeline) {
      if (leadData.timeline.includes('immediate') || leadData.timeline.includes('ASAP')) urgencyScore += 25;
      if (leadData.timeline.includes('week')) urgencyScore += 20;
      if (leadData.timeline.includes('month')) urgencyScore += 10;
    }
    
    // Message urgency keywords
    const urgentKeywords = ['urgent', 'emergency', 'desperate', 'immediate', 'ASAP', 'help', 'crisis'];
    const messageText = leadData.message.toLowerCase();
    urgentKeywords.forEach(keyword => {
      if (messageText.includes(keyword)) urgencyScore += 5;
    });
    
    return Math.min(40, urgencyScore);
  }

  private analyzeProgramFit(leadData: LeadData): number {
    let fitScore = 20; // Base fit score
    
    // Program-specific fit analysis
    switch (leadData.inquiryType) {
      case 'veterans-housing':
        if (leadData.veteranStatus) fitScore += 25;
        break;
      case 'recovery-housing':
        if (leadData.substanceHistory) fitScore += 25;
        break;
      case 'reentry-support':
        if (leadData.criminalHistory) fitScore += 25;
        break;
    }
    
    // Demographics fit
    if (leadData.hasChildren && leadData.inquiryType !== 'veterans-housing') fitScore += 10;
    if (leadData.monthlyIncome && leadData.monthlyIncome < 2000) fitScore += 15; // Income-qualified
    
    return Math.min(30, fitScore);
  }

  private analyzeIntent(leadData: LeadData): number {
    let intentScore = 0;
    
    // Message length and detail indicate serious intent
    const messageLength = leadData.message.length;
    if (messageLength > 200) intentScore += 10;
    if (messageLength > 100) intentScore += 5;
    
    // Specific questions indicate research and intent
    const intentKeywords = ['application', 'qualify', 'requirements', 'process', 'when', 'how long', 'cost'];
    const messageText = leadData.message.toLowerCase();
    intentKeywords.forEach(keyword => {
      if (messageText.includes(keyword)) intentScore += 3;
    });
    
    // Phone number provided indicates willingness to be contacted
    if (leadData.phone) intentScore += 10;
    
    // Detailed housing needs indicate serious consideration
    if (leadData.housingNeeds) intentScore += 8;
    
    return Math.min(25, intentScore);
  }

  private analyzeCapacity(leadData: LeadData): number {
    let capacityScore = 10; // Base capacity
    
    // Income analysis
    if (leadData.monthlyIncome) {
      if (leadData.monthlyIncome > 800) capacityScore += 10;
      if (leadData.monthlyIncome > 1200) capacityScore += 5;
      if (leadData.monthlyIncome < 400) capacityScore -= 5;
    }
    
    // Stability factors
    if (!leadData.substanceHistory) capacityScore += 5;
    if (!leadData.criminalHistory) capacityScore += 3;
    if (leadData.currentHousing === 'stable') capacityScore += 5;
    
    return Math.min(15, Math.max(0, capacityScore));
  }

  private analyzeSource(leadData: LeadData): number {
    // Source quality scoring based on conversion rates
    const sourceScores = {
      'referral': 15, // Highest quality
      'google_ads': 12,
      'website': 10,
      'social_media': 8,
      'walk_in': 6
    };
    
    return sourceScores[leadData.source] || 5;
  }

  private async generateAIInsights(leadData: LeadData): Promise<AIInsights> {
    // Analyze message sentiment
    const sentimentScore = this.analyzeSentiment(leadData.message);
    
    // Determine intent strength
    const intentStrength = this.calculateIntentStrength(leadData);
    
    // Extract pain points and motivations
    const painPoints = this.extractPainPoints(leadData);
    const motivations = this.extractMotivations(leadData);
    const objections = this.predictObjections(leadData);
    
    // Generate personalized approach
    const personalizedApproach = this.generatePersonalizedApproach(leadData, sentimentScore);
    
    // Determine best contact strategy
    const bestContactTime = this.determineBestContactTime(leadData);
    const communicationStyle = this.determineCommunicationStyle(leadData, sentimentScore);

    return {
      sentimentScore,
      intentStrength,
      painPoints,
      motivations,
      objections,
      personalizedApproach,
      bestContactTime,
      communicationStyle
    };
  }

  private analyzeSentiment(message: string): number {
    // Simple sentiment analysis (in production, use proper NLP)
    const positiveWords = ['help', 'hope', 'better', 'improve', 'change', 'opportunity', 'grateful'];
    const negativeWords = ['desperate', 'crisis', 'emergency', 'struggling', 'difficult', 'problem'];
    const neutralWords = ['information', 'question', 'inquiry', 'details', 'available'];
    
    const messageText = message.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (messageText.includes(word)) score += 0.1;
    });
    
    negativeWords.forEach(word => {
      if (messageText.includes(word)) score -= 0.1;
    });
    
    return Math.max(-1, Math.min(1, score));
  }

  private calculateIntentStrength(leadData: LeadData): number {
    let strength = 30; // Base intent
    
    // Detailed inquiry increases intent
    if (leadData.message.length > 150) strength += 20;
    if (leadData.housingNeeds) strength += 15;
    if (leadData.timeline) strength += 15;
    if (leadData.monthlyIncome) strength += 10;
    if (leadData.phone) strength += 10;
    
    return Math.min(100, strength);
  }

  private extractPainPoints(leadData: LeadData): string[] {
    const painPoints: string[] = [];
    const messageText = leadData.message.toLowerCase();
    
    // Housing-related pain points
    if (messageText.includes('homeless') || leadData.currentHousing === 'homeless') {
      painPoints.push('Currently experiencing homelessness');
    }
    if (messageText.includes('unsafe') || messageText.includes('dangerous')) {
      painPoints.push('Unsafe current housing situation');
    }
    if (messageText.includes('expensive') || messageText.includes('afford')) {
      painPoints.push('Housing affordability concerns');
    }
    if (messageText.includes('evict') || messageText.includes('kicked out')) {
      painPoints.push('Risk of eviction or displacement');
    }
    
    // Personal pain points
    if (leadData.hasChildren) painPoints.push('Need family-appropriate housing');
    if (leadData.substanceHistory) painPoints.push('Recovery housing needs');
    if (leadData.veteranStatus) painPoints.push('Veteran-specific support needs');
    
    return painPoints;
  }

  private extractMotivations(leadData: LeadData): string[] {
    const motivations: string[] = [];
    const messageText = leadData.message.toLowerCase();
    
    // Stability motivations
    if (messageText.includes('stable') || messageText.includes('permanent')) {
      motivations.push('Seeking housing stability');
    }
    if (messageText.includes('children') || messageText.includes('family')) {
      motivations.push('Providing for family');
    }
    if (messageText.includes('job') || messageText.includes('work') || messageText.includes('employ')) {
      motivations.push('Employment and career goals');
    }
    if (messageText.includes('clean') || messageText.includes('sober') || messageText.includes('recovery')) {
      motivations.push('Maintaining sobriety and recovery');
    }
    if (messageText.includes('independent') || messageText.includes('own place')) {
      motivations.push('Achieving independence');
    }
    
    return motivations;
  }

  private predictObjections(leadData: LeadData): string[] {
    const objections: string[] = [];
    
    // Common objections based on profile
    if (leadData.monthlyIncome && leadData.monthlyIncome < 800) {
      objections.push('Concerns about affordability');
    }
    if (leadData.criminalHistory) {
      objections.push('Worry about background check acceptance');
    }
    if (leadData.hasChildren) {
      objections.push('Questions about child-friendly policies');
    }
    if (leadData.inquiryType === 'general') {
      objections.push('Uncertainty about program fit');
    }
    
    // Always include common objections
    objections.push('Questions about program requirements');
    objections.push('Concerns about wait times');
    
    return objections;
  }

  private generatePersonalizedApproach(leadData: LeadData, sentiment: number): string {
    const approaches = [];
    
    // Approach based on sentiment
    if (sentiment < -0.3) {
      approaches.push('Lead with empathy and immediate support options');
    } else if (sentiment > 0.3) {
      approaches.push('Focus on positive outcomes and success stories');
    } else {
      approaches.push('Provide clear information and next steps');
    }
    
    // Program-specific approaches
    switch (leadData.inquiryType) {
      case 'veterans-housing':
        approaches.push('Emphasize veteran-specific benefits and community');
        break;
      case 'recovery-housing':
        approaches.push('Highlight recovery support and accountability');
        break;
      case 'reentry-support':
        approaches.push('Focus on second chances and community reintegration');
        break;
    }
    
    // Urgency-based approach
    if (leadData.currentHousing === 'homeless') {
      approaches.push('Prioritize immediate placement options');
    }
    
    return approaches.join('. ');
  }

  private determineBestContactTime(leadData: LeadData): string {
    // Smart contact timing based on lead profile
    if (leadData.currentHousing === 'homeless') return 'ASAP - within 2 hours';
    if (leadData.urgency === 'urgent') return 'Same day - within 4 hours';
    if (leadData.source === 'referral') return 'Within 24 hours';
    return 'Within 48 hours - weekday mornings preferred';
  }

  private determineCommunicationStyle(leadData: LeadData, sentiment: number): 'formal' | 'casual' | 'empathetic' | 'direct' {
    if (sentiment < -0.3) return 'empathetic';
    if (leadData.veteranStatus) return 'direct';
    if (leadData.hasChildren) return 'empathetic';
    if (leadData.inquiryType === 'general') return 'casual';
    return 'formal';
  }

  // Helper methods for scoring
  private getQualificationLevel(score: number): 'unqualified' | 'cold' | 'warm' | 'hot' | 'priority' {
    if (score >= 85) return 'priority';
    if (score >= 70) return 'hot';
    if (score >= 50) return 'warm';
    if (score >= 30) return 'cold';
    return 'unqualified';
  }

  private mapUrgencyLevel(urgencyScore: number): 'low' | 'medium' | 'high' | 'urgent' {
    if (urgencyScore >= 30) return 'urgent';
    if (urgencyScore >= 20) return 'high';
    if (urgencyScore >= 10) return 'medium';
    return 'low';
  }

  private generateRecommendations(leadData: LeadData, score: number): string[] {
    const recommendations = [];
    
    if (score >= 80) {
      recommendations.push('Priority follow-up within 2 hours');
      recommendations.push('Schedule immediate phone consultation');
    } else if (score >= 60) {
      recommendations.push('Follow up within 24 hours');
      recommendations.push('Send personalized email with next steps');
    } else if (score >= 40) {
      recommendations.push('Add to nurture sequence');
      recommendations.push('Send program information packet');
    } else {
      recommendations.push('Add to general newsletter');
      recommendations.push('Monitor for engagement signals');
    }
    
    // Specific recommendations based on profile
    if (leadData.currentHousing === 'homeless') {
      recommendations.push('Coordinate emergency placement options');
    }
    if (leadData.hasChildren) {
      recommendations.push('Provide family housing information');
    }
    
    return recommendations;
  }

  private identifyRiskFactors(leadData: LeadData): string[] {
    const risks = [];
    
    if (!leadData.phone) risks.push('No phone contact provided');
    if (leadData.monthlyIncome && leadData.monthlyIncome < 400) risks.push('Very low income level');
    if (leadData.source === 'social_media') risks.push('Social media leads convert lower');
    if (leadData.inquiryType === 'general') risks.push('Unclear program fit');
    
    return risks;
  }

  private identifyStrengths(leadData: LeadData): string[] {
    const strengths = [];
    
    if (leadData.phone) strengths.push('Contact information complete');
    if (leadData.message.length > 100) strengths.push('Detailed inquiry shows genuine interest');
    if (leadData.monthlyIncome && leadData.monthlyIncome > 800) strengths.push('Stable income source');
    if (leadData.source === 'referral') strengths.push('Referral source indicates trust');
    if (leadData.veteranStatus) strengths.push('Eligible for veteran-specific programs');
    
    return strengths;
  }

  private generateNextSteps(leadData: LeadData, score: number): string[] {
    const steps = [];
    
    if (score >= 70) {
      steps.push('1. Immediate phone outreach');
      steps.push('2. Schedule facility tour');
      steps.push('3. Begin application process');
    } else if (score >= 50) {
      steps.push('1. Personalized email follow-up');
      steps.push('2. Phone call within 48 hours');
      steps.push('3. Send program information');
    } else {
      steps.push('1. Add to email nurture sequence');
      steps.push('2. Send program overview');
      steps.push('3. Follow up in 1 week');
    }
    
    return steps;
  }

  private estimateConversionTime(score: number, leadData: LeadData): number {
    let baseDays = 30;
    
    // Score-based adjustment
    if (score >= 80) baseDays = 7;
    else if (score >= 60) baseDays = 14;
    else if (score >= 40) baseDays = 21;
    
    // Urgency adjustment
    if (leadData.currentHousing === 'homeless') baseDays = Math.min(baseDays, 3);
    if (leadData.urgency === 'urgent') baseDays = Math.min(baseDays, 7);
    
    return baseDays;
  }

  private getFallbackScore(leadData: LeadData): { score: LeadScore; insights: AIInsights } {
    // Fallback scoring if AI analysis fails
    return {
      score: {
        overallScore: 50,
        qualificationLevel: 'warm',
        conversionProbability: 40,
        urgencyLevel: 'medium',
        recommendedActions: ['Follow up within 48 hours'],
        riskFactors: ['AI analysis unavailable'],
        strengths: ['Lead submitted inquiry'],
        nextSteps: ['Manual qualification needed'],
        estimatedTimeToConversion: 21,
        assignedPriority: 5
      },
      insights: {
        sentimentScore: 0,
        intentStrength: 50,
        painPoints: ['Manual analysis needed'],
        motivations: ['Seeking housing assistance'],
        objections: ['Unknown'],
        personalizedApproach: 'Standard outreach approach',
        bestContactTime: 'Within 48 hours',
        communicationStyle: 'formal'
      }
    };
  }

  private logLeadAnalysis(leadData: LeadData, score: LeadScore, insights: AIInsights): void {
    // Log for analytics and improvement
    console.log('🤖 AI Lead Analysis:', {
      leadId: `${leadData.firstName}-${Date.now()}`,
      score: score.overallScore,
      qualification: score.qualificationLevel,
      priority: score.assignedPriority,
      urgency: score.urgencyLevel
    });
  }

  // Lead attraction optimization
  async optimizeAttraction(currentMetrics: any): Promise<{
    recommendations: string[];
    optimizations: string[];
    targetAudiences: string[];
    contentSuggestions: string[];
  }> {
    return {
      recommendations: [
        'Increase Google Ads budget for high-converting keywords',
        'Create targeted Facebook campaigns for veterans',
        'Optimize landing pages for mobile conversion',
        'Implement live chat for immediate engagement'
      ],
      optimizations: [
        'Add urgency indicators to forms',
        'Simplify application process',
        'Include success stories prominently',
        'Optimize page load speeds'
      ],
      targetAudiences: [
        'Veterans transitioning to civilian life',
        'Individuals in recovery programs',
        'Recently released individuals',
        'Families with temporary housing needs'
      ],
      contentSuggestions: [
        'Video testimonials from successful residents',
        'Day-in-the-life content showing facility life',
        'FAQ content addressing common concerns',
        'Success story blog posts with photos'
      ]
    };
  }
}