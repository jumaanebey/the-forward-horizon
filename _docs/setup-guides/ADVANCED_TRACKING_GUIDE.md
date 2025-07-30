# Advanced Tracking and Attribution System

## Overview
Comprehensive tracking system for Forward Horizon to measure marketing effectiveness, lead quality, and operational performance.

## Marketing Attribution Framework

### 1. UTM Parameter Strategy
```
Campaign Structure:
utm_source: google-ads | facebook-ads | instagram-ads | organic | referral
utm_medium: cpc | social | email | organic | referral
utm_campaign: veterans-q1 | recovery-housing | reentry-support
utm_content: ad-variant-a | testimonial-video | benefits-guide
utm_term: veterans-housing | recovery-program | (specific keywords)

Example URLs:
https://theforwardhorizon.com/veterans-housing?utm_source=facebook-ads&utm_medium=social&utm_campaign=veterans-q1&utm_content=testimonial-video&utm_term=stable-housing
```

### 2. Cross-Platform Tracking Implementation

#### Facebook Pixel Configuration
```javascript
// Facebook Pixel Advanced Setup
fbq('init', 'YOUR_PIXEL_ID', {
  em: 'hashed_email@example.com', // Customer information for better matching
  ph: 'hashed_phone_number', // Hashed phone number
  external_id: 'unique_user_id' // Your internal user ID
});

// Enhanced conversion tracking
fbq('track', 'Lead', {
  content_name: 'Veterans Benefits Guide',
  content_category: 'lead_magnet',
  content_ids: ['veterans-guide'],
  value: 25.00,
  currency: 'USD',
  predicted_ltv: 1200, // Predicted lifetime value
  source_url: window.location.href,
  utm_source: getUrlParameter('utm_source'),
  utm_campaign: getUrlParameter('utm_campaign')
});

// Custom events for better attribution
fbq('trackCustom', 'GuideDownload', {
  guide_type: 'veterans',
  lead_score: calculateLeadScore(),
  timestamp: Date.now()
});
```

#### Google Analytics 4 Setup
```javascript
// Google Analytics 4 Configuration
gtag('config', 'GA_MEASUREMENT_ID', {
  send_page_view: false, // We'll send custom page views
  custom_map: {
    'custom_parameter_1': 'lead_source',
    'custom_parameter_2': 'lead_quality'
  }
});

// Enhanced conversion tracking
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
  'value': 25.0,
  'currency': 'USD',
  'transaction_id': generateTransactionId(),
  'custom_parameter_1': leadSource,
  'custom_parameter_2': leadScore
});

// Lead quality scoring
gtag('event', 'lead_generated', {
  'event_category': 'lead_generation',
  'event_label': programType,
  'value': leadScore,
  'custom_dimensions': {
    'lead_source': utmSource,
    'lead_medium': utmMedium,
    'lead_campaign': utmCampaign,
    'program_interest': programType,
    'lead_score': leadScore
  }
});
```

### 3. Lead Scoring Algorithm
```typescript
interface LeadScoringCriteria {
  programMatch: number;
  urgencyIndicators: number;
  contactInfo: number;
  engagement: number;
  demographics: number;
}

function calculateLeadScore(leadData: any): number {
  let score = 0;
  
  // Program match (25 points max)
  if (leadData.programInterest === 'veterans') score += 25;
  else if (leadData.programInterest === 'recovery') score += 20;
  else if (leadData.programInterest === 'reentry') score += 15;
  else score += 10;
  
  // Urgency indicators (20 points max)
  if (leadData.notes?.includes('immediate') || leadData.notes?.includes('urgent')) score += 20;
  if (leadData.notes?.includes('homeless') || leadData.notes?.includes('unsafe')) score += 15;
  if (leadData.notes?.includes('soon') || leadData.notes?.includes('need help')) score += 10;
  
  // Contact information quality (15 points max)
  if (leadData.phone && leadData.email) score += 15;
  else if (leadData.phone || leadData.email) score += 10;
  else score += 5;
  
  // Engagement level (25 points max)
  if (leadData.timeOnPage > 300) score += 15; // 5+ minutes
  if (leadData.pagesViewed > 3) score += 10;
  if (leadData.returnVisitor) score += 5;
  
  // Demographics (15 points max)
  if (leadData.age >= 25 && leadData.age <= 55) score += 10;
  if (leadData.location === 'local') score += 5; // Within 50 miles
  
  return Math.min(score, 100); // Cap at 100
}
```

## Conversion Funnel Tracking

### 1. Funnel Stage Definitions
```typescript
enum FunnelStage {
  AWARENESS = 'awareness', // Ad impression/click
  INTEREST = 'interest', // Landing page visit
  CONSIDERATION = 'consideration', // Guide download
  INTENT = 'intent', // Phone call/email
  EVALUATION = 'evaluation', // Facility tour/interview
  CONVERSION = 'conversion' // Program enrollment
}

// Track funnel progression
function trackFunnelStage(stage: FunnelStage, leadId: string, metadata: any) {
  // Google Analytics
  gtag('event', 'funnel_progression', {
    'event_category': 'conversion_funnel',
    'event_label': stage,
    'lead_id': leadId,
    'timestamp': Date.now(),
    ...metadata
  });
  
  // Facebook Pixel
  fbq('trackCustom', 'FunnelProgression', {
    stage: stage,
    lead_id: leadId,
    value: getFunnelStageValue(stage),
    ...metadata
  });
  
  // Internal tracking
  saveFunnelEvent({
    leadId,
    stage,
    timestamp: new Date(),
    metadata
  });
}
```

### 2. Attribution Modeling

#### First-Touch Attribution
```typescript
interface AttributionData {
  firstTouch: {
    source: string;
    medium: string;
    campaign: string;
    timestamp: Date;
  };
  lastTouch: {
    source: string;
    medium: string;
    campaign: string;
    timestamp: Date;
  };
  touchpoints: TouchPoint[];
}

function trackTouchpoint(leadId: string, touchpoint: TouchPoint) {
  const attribution = getAttributionData(leadId);
  
  if (!attribution.firstTouch) {
    attribution.firstTouch = touchpoint;
  }
  
  attribution.lastTouch = touchpoint;
  attribution.touchpoints.push(touchpoint);
  
  saveAttributionData(leadId, attribution);
}
```

#### Multi-Touch Attribution
```typescript
function calculateAttributionWeight(touchpoints: TouchPoint[]): AttributionWeight[] {
  const weights: AttributionWeight[] = [];
  const totalTouchpoints = touchpoints.length;
  
  touchpoints.forEach((touchpoint, index) => {
    let weight = 0;
    
    // Linear attribution: equal weight to all touchpoints
    if (attributionModel === 'linear') {
      weight = 1 / totalTouchpoints;
    }
    
    // Time-decay: more recent touchpoints get higher weight
    else if (attributionModel === 'time-decay') {
      const daysSince = (Date.now() - touchpoint.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      weight = Math.exp(-daysSince * 0.1); // Exponential decay
    }
    
    // Position-based: 40% first, 40% last, 20% middle
    else if (attributionModel === 'position-based') {
      if (index === 0) weight = 0.4; // First touch
      else if (index === totalTouchpoints - 1) weight = 0.4; // Last touch
      else weight = 0.2 / (totalTouchpoints - 2); // Middle touches
    }
    
    weights.push({
      touchpoint,
      weight,
      attributedValue: weight * conversionValue
    });
  });
  
  return weights;
}
```

## ROI and Performance Tracking

### 1. Customer Lifetime Value (CLV) Calculation
```typescript
interface ResidentFinancials {
  monthlyPayment: number;
  averageStayDuration: number; // in months
  programCompletionRate: number;
  referralValue: number;
}

function calculateCLV(programType: string): number {
  const financials = getResidentFinancials(programType);
  
  const directRevenue = financials.monthlyPayment * financials.averageStayDuration;
  const completionBonus = directRevenue * 0.1 * financials.programCompletionRate;
  const referralRevenue = financials.referralValue;
  
  return directRevenue + completionBonus + referralRevenue;
}

// Program-specific CLV
const clvByProgram = {
  veterans: 8400, // $700/month × 12 months average stay
  recovery: 7200, // $600/month × 12 months average stay
  reentry: 6000, // $500/month × 12 months average stay
  general: 5400 // $450/month × 12 months average stay
};
```

### 2. Marketing ROI Calculation
```typescript
interface CampaignPerformance {
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenue: number;
}

function calculateROI(performance: CampaignPerformance): ROIMetrics {
  const ctr = performance.clicks / performance.impressions;
  const conversionRate = performance.conversions / performance.leads;
  const costPerLead = performance.spend / performance.leads;
  const costPerAcquisition = performance.spend / performance.conversions;
  const roi = (performance.revenue - performance.spend) / performance.spend * 100;
  const roas = performance.revenue / performance.spend;
  
  return {
    ctr,
    conversionRate,
    costPerLead,
    costPerAcquisition,
    roi,
    roas,
    efficiency: performance.revenue / performance.clicks
  };
}
```

## Real-Time Dashboard Integration

### 1. Data Pipeline
```typescript
// Real-time data aggregation
class AnalyticsPipeline {
  async aggregateMetrics(timeframe: string): Promise<DashboardMetrics> {
    const [
      leadMetrics,
      conversionMetrics,
      revenueMetrics,
      campaignMetrics
    ] = await Promise.all([
      this.getLeadMetrics(timeframe),
      this.getConversionMetrics(timeframe),
      this.getRevenueMetrics(timeframe),
      this.getCampaignMetrics(timeframe)
    ]);
    
    return {
      leads: leadMetrics,
      conversions: conversionMetrics,
      revenue: revenueMetrics,
      campaigns: campaignMetrics,
      lastUpdated: new Date()
    };
  }
  
  async getLeadMetrics(timeframe: string) {
    const leads = await this.supabase
      .from('leads')
      .select('*')
      .gte('created_at', this.getTimeframeStart(timeframe));
    
    return {
      total: leads.length,
      bySource: this.groupBy(leads, 'source'),
      byProgram: this.groupBy(leads, 'program_interest'),
      qualityScore: this.calculateAverageLeadScore(leads)
    };
  }
}
```

### 2. Alert System
```typescript
interface AlertCondition {
  metric: string;
  threshold: number;
  direction: 'above' | 'below';
  timeframe: string;
}

class AlertSystem {
  async checkAlerts(): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const conditions: AlertCondition[] = [
      { metric: 'cost_per_lead', threshold: 30, direction: 'above', timeframe: '24h' },
      { metric: 'conversion_rate', threshold: 5, direction: 'below', timeframe: '7d' },
      { metric: 'lead_quality_score', threshold: 60, direction: 'below', timeframe: '24h' }
    ];
    
    for (const condition of conditions) {
      const currentValue = await this.getMetricValue(condition.metric, condition.timeframe);
      
      if (
        (condition.direction === 'above' && currentValue > condition.threshold) ||
        (condition.direction === 'below' && currentValue < condition.threshold)
      ) {
        alerts.push({
          type: 'threshold_breach',
          metric: condition.metric,
          currentValue,
          threshold: condition.threshold,
          severity: this.calculateSeverity(currentValue, condition.threshold),
          timestamp: new Date()
        });
      }
    }
    
    return alerts;
  }
}
```

## Privacy and Compliance

### 1. HIPAA Compliance
```typescript
// Data anonymization for analytics
function anonymizeAnalyticsData(data: any): any {
  const anonymized = { ...data };
  
  // Remove PII
  delete anonymized.firstName;
  delete anonymized.lastName;
  delete anonymized.email;
  delete anonymized.phone;
  delete anonymized.address;
  
  // Hash identifying information
  anonymized.hashedId = hashFunction(data.id);
  anonymized.demographicGroup = getDemographicGroup(data.age, data.zipCode);
  
  return anonymized;
}

// Secure data transmission
function secureAnalyticsTransmission(data: any) {
  return {
    data: encrypt(JSON.stringify(data)),
    timestamp: Date.now(),
    checksum: generateChecksum(data)
  };
}
```

### 2. Data Retention Policy
```typescript
interface DataRetentionPolicy {
  analyticsData: '2 years';
  leadData: '7 years';
  campaignData: '3 years';
  sessionData: '30 days';
}

class DataRetentionManager {
  async cleanupExpiredData(): Promise<void> {
    const cutoffDates = {
      analytics: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
      leads: new Date(Date.now() - 7 * 365 * 24 * 60 * 60 * 1000),
      campaigns: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000),
      sessions: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    };
    
    await Promise.all([
      this.supabase.from('analytics_events').delete().lt('created_at', cutoffDates.analytics),
      this.supabase.from('lead_activities').delete().lt('created_at', cutoffDates.leads),
      this.supabase.from('campaign_data').delete().lt('created_at', cutoffDates.campaigns),
      this.supabase.from('user_sessions').delete().lt('created_at', cutoffDates.sessions)
    ]);
  }
}
```

## Implementation Checklist

### Phase 1: Basic Tracking (Week 1)
- [ ] UTM parameter implementation
- [ ] Facebook Pixel setup
- [ ] Google Analytics 4 configuration
- [ ] Basic conversion tracking

### Phase 2: Advanced Attribution (Week 2-3)
- [ ] Lead scoring algorithm
- [ ] Multi-touch attribution
- [ ] Funnel tracking implementation
- [ ] ROI calculation system

### Phase 3: Real-Time Dashboard (Week 4)
- [ ] Analytics pipeline setup
- [ ] Dashboard integration
- [ ] Alert system configuration
- [ ] Performance optimization

### Phase 4: Compliance & Optimization (Week 5)
- [ ] HIPAA compliance review
- [ ] Data retention implementation
- [ ] Privacy controls
- [ ] System testing and optimization

This comprehensive tracking system provides Forward Horizon with enterprise-level analytics capabilities while maintaining compliance with healthcare privacy regulations.