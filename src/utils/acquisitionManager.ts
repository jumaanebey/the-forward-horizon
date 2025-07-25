// Acquisition Manager for Forward Horizon - Lead Generation, Marketing, and Conversion

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: 'website' | 'social_media' | 'referral' | 'advertising' | 'event' | 'direct';
  status: 'new' | 'contacted' | 'qualified' | 'toured' | 'interested' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  interests: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: 'immediate' | '1_month' | '3_months' | '6_months' | 'flexible';
  familyMembers: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }[];
  preferences: {
    roomType: 'private' | 'semi_private' | 'shared';
    careLevel: 'independent' | 'assisted' | 'memory_care' | 'skilled_nursing';
    amenities: string[];
    location: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastContact: Date;
  nextFollowUp: Date;
}

interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'social_media' | 'ppc' | 'content' | 'event' | 'referral';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  targetAudience: {
    ageRange: string;
    location: string;
    interests: string[];
    budget: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    costPerClick: number;
    costPerConversion: number;
    roi: number;
  };
  content: {
    title: string;
    description: string;
    images: string[];
    callToAction: string;
  };
}

interface VirtualTour {
  id: string;
  title: string;
  description: string;
  type: '360_degree' | 'video' | 'interactive' | 'photo_gallery';
  facilityId: string;
  rooms: {
    id: string;
    name: string;
    type: string;
    images: string[];
    description: string;
    features: string[];
    pricing: number;
  }[];
  amenities: {
    id: string;
    name: string;
    description: string;
    images: string[];
  }[];
  staff: {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
  }[];
  testimonials: {
    id: string;
    name: string;
    relationship: string;
    content: string;
    rating: number;
    image: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface FacilityShowcase {
  id: string;
  facilityId: string;
  name: string;
  description: string;
  highlights: string[];
  images: {
    id: string;
    url: string;
    caption: string;
    category: 'exterior' | 'interior' | 'rooms' | 'amenities' | 'activities';
  }[];
  amenities: {
    category: string;
    items: string[];
  }[];
  services: {
    category: string;
    services: string[];
  }[];
  pricing: {
    roomType: string;
    basePrice: number;
    currency: string;
    includes: string[];
  }[];
  availability: {
    roomType: string;
    available: number;
    total: number;
  }[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  hours: {
    day: string;
    open: string;
    close: string;
  }[];
}

interface ConversionFunnel {
  id: string;
  name: string;
  stages: {
    name: string;
    description: string;
    conversionRate: number;
    avgTimeInStage: number;
    actions: string[];
  }[];
  metrics: {
    totalLeads: number;
    qualifiedLeads: number;
    tours: number;
    conversions: number;
    overallConversionRate: number;
    avgTimeToConversion: number;
    totalRevenue: number;
  };
}

class AcquisitionManager {
  private static instance: AcquisitionManager;
  private leads: Map<string, Lead> = new Map();
  private campaigns: Map<string, MarketingCampaign> = new Map();
  private virtualTours: Map<string, VirtualTour> = new Map();
  private showcases: Map<string, FacilityShowcase> = new Map();
  private funnels: Map<string, ConversionFunnel> = new Map();

  static getInstance(): AcquisitionManager {
    if (!AcquisitionManager.instance) {
      AcquisitionManager.instance = new AcquisitionManager();
    }
    return AcquisitionManager.instance;
  }

  constructor() {
    this.initializeSampleData();
  }

  // Lead Management
  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    const lead: Lead = {
      id: this.generateId(),
      firstName: leadData.firstName || '',
      lastName: leadData.lastName || '',
      email: leadData.email || '',
      phone: leadData.phone || '',
      source: leadData.source || 'website',
      status: 'new',
      priority: 'medium',
      notes: leadData.notes || '',
      interests: leadData.interests || [],
      budget: {
        min: leadData.budget?.min || 0,
        max: leadData.budget?.max || 0,
        currency: leadData.budget?.currency || 'USD'
      },
      timeline: leadData.timeline || 'flexible',
      familyMembers: leadData.familyMembers || [],
      preferences: {
        roomType: 'private',
        careLevel: 'independent',
        amenities: [],
        location: ''
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastContact: new Date(),
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ...leadData
    };

    this.leads.set(lead.id, lead);
    return lead;
  }

  async getLead(leadId: string): Promise<Lead | null> {
    return this.leads.get(leadId) || null;
  }

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead | null> {
    const lead = this.leads.get(leadId);
    if (!lead) return null;

    const updatedLead = {
      ...lead,
      ...updates,
      updatedAt: new Date()
    };

    this.leads.set(leadId, updatedLead);
    return updatedLead;
  }

  async listLeads(filters?: {
    status?: string;
    source?: string;
    priority?: string;
    dateRange?: { start: Date; end: Date };
  }): Promise<Lead[]> {
    let leads = Array.from(this.leads.values());

    if (filters) {
      if (filters.status) {
        leads = leads.filter(l => l.status === filters.status);
      }
      if (filters.source) {
        leads = leads.filter(l => l.source === filters.source);
      }
      if (filters.priority) {
        leads = leads.filter(l => l.priority === filters.priority);
      }
      if (filters.dateRange) {
        leads = leads.filter(l => 
          l.createdAt >= filters.dateRange!.start && 
          l.createdAt <= filters.dateRange!.end
        );
      }
    }

    return leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateLeadStatus(leadId: string, status: Lead['status'], notes?: string): Promise<Lead | null> {
    const lead = this.leads.get(leadId);
    if (!lead) return null;

    const updates: Partial<Lead> = {
      status,
      lastContact: new Date(),
      updatedAt: new Date()
    };

    if (notes) {
      updates.notes = `${lead.notes}\n${new Date().toLocaleString()}: ${notes}`;
    }

    // Set next follow-up based on status
    switch (status) {
      case 'contacted':
        updates.nextFollowUp = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
        break;
      case 'qualified':
        updates.nextFollowUp = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day
        break;
      case 'toured':
        updates.nextFollowUp = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days
        break;
      case 'interested':
        updates.nextFollowUp = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day
        break;
    }

    return this.updateLead(leadId, updates);
  }

  // Marketing Campaigns
  async createCampaign(campaignData: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const campaign: MarketingCampaign = {
      id: this.generateId(),
      name: campaignData.name || 'New Campaign',
      type: campaignData.type || 'email',
      status: 'draft',
      budget: campaignData.budget || 0,
      spent: 0,
      startDate: campaignData.startDate || new Date(),
      endDate: campaignData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      targetAudience: {
        ageRange: '65+',
        location: 'Local',
        interests: ['senior living', 'assisted living'],
        budget: 'Medium'
      },
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        costPerClick: 0,
        costPerConversion: 0,
        roi: 0
      },
      content: {
        title: '',
        description: '',
        images: [],
        callToAction: 'Schedule a Tour'
      },
      ...campaignData
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async getCampaign(campaignId: string): Promise<MarketingCampaign | null> {
    return this.campaigns.get(campaignId) || null;
  }

  async updateCampaign(campaignId: string, updates: Partial<MarketingCampaign>): Promise<MarketingCampaign | null> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    const updatedCampaign = {
      ...campaign,
      ...updates
    };

    this.campaigns.set(campaignId, updatedCampaign);
    return updatedCampaign;
  }

  async listCampaigns(): Promise<MarketingCampaign[]> {
    return Array.from(this.campaigns.values()).sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  // Virtual Tours
  async createVirtualTour(tourData: Partial<VirtualTour>): Promise<VirtualTour> {
    const tour: VirtualTour = {
      id: this.generateId(),
      title: tourData.title || 'Virtual Tour',
      description: tourData.description || '',
      type: tourData.type || '360_degree',
      facilityId: tourData.facilityId || '',
      rooms: tourData.rooms || [],
      amenities: tourData.amenities || [],
      staff: tourData.staff || [],
      testimonials: tourData.testimonials || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...tourData
    };

    this.virtualTours.set(tour.id, tour);
    return tour;
  }

  async getVirtualTour(tourId: string): Promise<VirtualTour | null> {
    return this.virtualTours.get(tourId) || null;
  }

  async listVirtualTours(): Promise<VirtualTour[]> {
    return Array.from(this.virtualTours.values());
  }

  // Facility Showcases
  async createShowcase(showcaseData: Partial<FacilityShowcase>): Promise<FacilityShowcase> {
    const showcase: FacilityShowcase = {
      id: this.generateId(),
      facilityId: showcaseData.facilityId || '',
      name: showcaseData.name || 'Facility Showcase',
      description: showcaseData.description || '',
      highlights: showcaseData.highlights || [],
      images: showcaseData.images || [],
      amenities: showcaseData.amenities || [],
      services: showcaseData.services || [],
      pricing: showcaseData.pricing || [],
      availability: showcaseData.availability || [],
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: { lat: 0, lng: 0 }
      },
      contact: {
        phone: '',
        email: '',
        website: ''
      },
      hours: [],
      ...showcaseData
    };

    this.showcases.set(showcase.id, showcase);
    return showcase;
  }

  async getShowcase(showcaseId: string): Promise<FacilityShowcase | null> {
    return this.showcases.get(showcaseId) || null;
  }

  async listShowcases(): Promise<FacilityShowcase[]> {
    return Array.from(this.showcases.values());
  }

  // Conversion Funnel
  async createFunnel(funnelData: Partial<ConversionFunnel>): Promise<ConversionFunnel> {
    const funnel: ConversionFunnel = {
      id: this.generateId(),
      name: funnelData.name || 'Lead Conversion Funnel',
      stages: [
        {
          name: 'Lead Generation',
          description: 'Website visitors and form submissions',
          conversionRate: 100,
          avgTimeInStage: 0,
          actions: ['Website visit', 'Form submission', 'Phone call']
        },
        {
          name: 'Lead Qualification',
          description: 'Initial contact and needs assessment',
          conversionRate: 60,
          avgTimeInStage: 2,
          actions: ['Phone call', 'Email response', 'Needs assessment']
        },
        {
          name: 'Tour Scheduling',
          description: 'Scheduling and conducting facility tours',
          conversionRate: 40,
          avgTimeInStage: 5,
          actions: ['Tour scheduling', 'Virtual tour', 'In-person tour']
        },
        {
          name: 'Proposal & Negotiation',
          description: 'Presenting options and discussing terms',
          conversionRate: 25,
          avgTimeInStage: 7,
          actions: ['Proposal presentation', 'Pricing discussion', 'Contract review']
        },
        {
          name: 'Conversion',
          description: 'Signed agreement and move-in',
          conversionRate: 15,
          avgTimeInStage: 14,
          actions: ['Contract signing', 'Move-in planning', 'Welcome process']
        }
      ],
      metrics: {
        totalLeads: 0,
        qualifiedLeads: 0,
        tours: 0,
        conversions: 0,
        overallConversionRate: 0,
        avgTimeToConversion: 0,
        totalRevenue: 0
      },
      ...funnelData
    };

    this.funnels.set(funnel.id, funnel);
    return funnel;
  }

  async getFunnel(funnelId: string): Promise<ConversionFunnel | null> {
    return this.funnels.get(funnelId) || null;
  }

  async updateFunnelMetrics(funnelId: string): Promise<ConversionFunnel | null> {
    const funnel = this.funnels.get(funnelId);
    if (!funnel) return null;

    const leads = Array.from(this.leads.values());
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => ['qualified', 'toured', 'interested', 'converted'].includes(l.status)).length;
    const tours = leads.filter(l => ['toured', 'interested', 'converted'].includes(l.status)).length;
    const conversions = leads.filter(l => l.status === 'converted').length;

    const updatedFunnel = {
      ...funnel,
      metrics: {
        totalLeads,
        qualifiedLeads,
        tours,
        conversions,
        overallConversionRate: totalLeads > 0 ? (conversions / totalLeads) * 100 : 0,
        avgTimeToConversion: this.calculateAvgTimeToConversion(leads),
        totalRevenue: conversions * 5000 // Assuming $5000 average revenue per conversion
      }
    };

    this.funnels.set(funnelId, updatedFunnel);
    return updatedFunnel;
  }

  // Analytics and Reporting
  async getAcquisitionAnalytics(): Promise<any> {
    const leads = Array.from(this.leads.values());
    const campaigns = Array.from(this.campaigns.values());

    const leadSources = this.groupBy(leads, 'source');
    const leadStatuses = this.groupBy(leads, 'status');
    const leadPriorities = this.groupBy(leads, 'priority');

    const totalLeads = leads.length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const avgTimeToConversion = this.calculateAvgTimeToConversion(leads);
    const totalRevenue = convertedLeads * 5000; // Assuming $5000 average revenue

    return {
      totalLeads,
      convertedLeads,
      conversionRate,
      avgTimeToConversion,
      totalRevenue,
      leadSources,
      leadStatuses,
      leadPriorities,
      campaignPerformance: campaigns.map(c => ({
        name: c.name,
        type: c.type,
        status: c.status,
        metrics: c.metrics
      }))
    };
  }

  async getLeadAnalytics(leadId: string): Promise<any> {
    const lead = this.leads.get(leadId);
    if (!lead) return null;

    const timeInSystem = Date.now() - lead.createdAt.getTime();
    const daysInSystem = Math.floor(timeInSystem / (1000 * 60 * 60 * 24));

    return {
      lead,
      timeInSystem: daysInSystem,
      statusHistory: this.getStatusHistory(lead),
      nextActions: this.getNextActions(lead),
      conversionProbability: this.calculateConversionProbability(lead)
    };
  }

  // Helper Methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private groupBy(array: any[], key: string): any {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  private calculateAvgTimeToConversion(leads: Lead[]): number {
    const convertedLeads = leads.filter(l => l.status === 'converted');
    if (convertedLeads.length === 0) return 0;

    const totalTime = convertedLeads.reduce((sum, lead) => {
      return sum + (lead.updatedAt.getTime() - lead.createdAt.getTime());
    }, 0);

    return Math.floor(totalTime / convertedLeads.length / (1000 * 60 * 60 * 24)); // Days
  }

  private getStatusHistory(lead: Lead): any[] {
    // This would track status changes over time
    return [
      { status: 'new', date: lead.createdAt },
      { status: lead.status, date: lead.updatedAt }
    ];
  }

  private getNextActions(lead: Lead): string[] {
    switch (lead.status) {
      case 'new':
        return ['Initial contact', 'Needs assessment', 'Qualification'];
      case 'contacted':
        return ['Follow-up call', 'Information sharing', 'Tour scheduling'];
      case 'qualified':
        return ['Tour scheduling', 'Virtual tour', 'In-person visit'];
      case 'toured':
        return ['Follow-up', 'Proposal presentation', 'Pricing discussion'];
      case 'interested':
        return ['Contract review', 'Negotiation', 'Move-in planning'];
      case 'converted':
        return ['Welcome process', 'Onboarding', 'Family orientation'];
      default:
        return ['Re-engagement', 'New approach', 'Referral request'];
    }
  }

  private calculateConversionProbability(lead: Lead): number {
    let probability = 50; // Base probability

    // Adjust based on status
    switch (lead.status) {
      case 'converted': probability = 100; break;
      case 'interested': probability = 80; break;
      case 'toured': probability = 60; break;
      case 'qualified': probability = 40; break;
      case 'contacted': probability = 20; break;
      case 'new': probability = 10; break;
      default: probability = 5;
    }

    // Adjust based on priority
    switch (lead.priority) {
      case 'urgent': probability += 20; break;
      case 'high': probability += 10; break;
      case 'medium': probability += 0; break;
      case 'low': probability -= 10; break;
    }

    // Adjust based on timeline
    switch (lead.timeline) {
      case 'immediate': probability += 15; break;
      case '1_month': probability += 10; break;
      case '3_months': probability += 5; break;
      case '6_months': probability += 0; break;
      case 'flexible': probability -= 5; break;
    }

    return Math.min(Math.max(probability, 0), 100);
  }

  private initializeSampleData(): void {
    // Create sample leads
    this.createLead({
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      source: 'website',
      status: 'qualified',
      priority: 'high',
      timeline: '1_month',
      budget: { min: 3000, max: 5000, currency: 'USD' },
      preferences: {
        roomType: 'private',
        careLevel: 'assisted',
        amenities: ['WiFi', 'Meals', 'Transportation'],
        location: 'Downtown'
      }
    });

    this.createLead({
      firstName: 'Mary',
      lastName: 'Johnson',
      email: 'mary.johnson@email.com',
      phone: '+1 (555) 987-6543',
      source: 'referral',
      status: 'toured',
      priority: 'medium',
      timeline: '3_months',
      budget: { min: 4000, max: 6000, currency: 'USD' },
      preferences: {
        roomType: 'semi_private',
        careLevel: 'independent',
        amenities: ['Fitness Center', 'Library', 'Garden'],
        location: 'Suburban'
      }
    });

    // Create sample campaign
    this.createCampaign({
      name: 'Spring Senior Living Campaign',
      type: 'social_media',
      status: 'active',
      budget: 5000,
      content: {
        title: 'Discover Your Perfect Home at Forward Horizon',
        description: 'Experience luxury senior living with personalized care and vibrant community.',
        images: [],
        callToAction: 'Schedule Your Tour Today'
      }
    });

    // Create sample virtual tour
    this.createVirtualTour({
      title: 'Forward Horizon Virtual Experience',
      description: 'Take a 360-degree tour of our beautiful facility and see why families choose us.',
      type: '360_degree',
      facilityId: 'facility-1'
    });

    // Create sample showcase
    this.createShowcase({
      name: 'Forward Horizon Senior Living',
      description: 'Premium senior living community offering personalized care and vibrant lifestyle.',
      highlights: [
        'Luxury accommodations with modern amenities',
        'Personalized care plans for every resident',
        'Vibrant community with daily activities',
        'Professional medical staff available 24/7',
        'Beautiful grounds with walking paths'
      ],
      facilityId: 'facility-1'
    });

    // Create sample funnel
    this.createFunnel({
      name: 'Lead to Resident Conversion'
    });
  }
}

// Export singleton instance
export const acquisitionManager = AcquisitionManager.getInstance();

// Export types
export type { Lead, MarketingCampaign, VirtualTour, FacilityShowcase, ConversionFunnel }; 