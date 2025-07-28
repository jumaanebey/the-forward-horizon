// Lead Integration System - Connect Marketing Funnel to Management Dashboard
import { supabase } from './supabase';

interface MarketingLead {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  programInterest: 'veterans' | 'recovery' | 'reentry' | 'general';
  leadSource: string; // 'google-ads', 'facebook-ads', 'website', 'referral'
  leadMagnet?: string; // Which PDF they downloaded
  priorityScore?: number;
  specialNeeds?: string[];
  notes?: string;
  status: 'new' | 'contacted' | 'qualified' | 'scheduled' | 'admitted' | 'inactive';
  createdAt?: string;
  lastContactAt?: string;
}

interface LeadActivity {
  leadId: string;
  activityType: 'email_opened' | 'pdf_downloaded' | 'phone_call' | 'email_sent' | 'meeting_scheduled';
  description: string;
  timestamp: string;
  staffId?: string;
}

export class LeadManager {
  
  // Add new lead from marketing funnel
  static async addLead(leadData: Omit<MarketingLead, 'id' | 'createdAt'>): Promise<MarketingLead | null> {
    if (!supabase) {
      console.warn('Supabase not configured - lead saved to localStorage');
      // Fallback to localStorage for development
      const leads = JSON.parse(localStorage.getItem('forward_horizon_leads') || '[]');
      const newLead = { ...leadData, id: Date.now().toString(), createdAt: new Date().toISOString() };
      leads.push(newLead);
      localStorage.setItem('forward_horizon_leads', JSON.stringify(leads));
      return newLead;
    }

    try {
      // First, add to waitlist
      const { data: waitlistEntry, error: waitlistError } = await supabase
        .from('waitlist')
        .insert({
          first_name: leadData.firstName,
          last_name: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone,
          program_type: leadData.programInterest,
          requested_date: new Date().toISOString().split('T')[0],
          priority_score: leadData.priorityScore || this.calculatePriorityScore(leadData),
          special_needs: leadData.specialNeeds || [],
          contact_info: leadData.email,
          status: 'active',
          lead_source: leadData.leadSource
        })
        .select()
        .single();

      if (waitlistError) throw waitlistError;

      // Also create a lead tracking record
      const { data: lead, error: leadError } = await supabase
        .from('leads') // We'll add this table to the schema
        .insert({
          first_name: leadData.firstName,
          last_name: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone,
          program_interest: leadData.programInterest,
          lead_source: leadData.leadSource,
          lead_magnet: leadData.leadMagnet,
          priority_score: leadData.priorityScore || this.calculatePriorityScore(leadData),
          special_needs: leadData.specialNeeds || [],
          notes: leadData.notes,
          status: leadData.status,
          waitlist_id: waitlistEntry.id
        })
        .select()
        .single();

      return lead;
    } catch (error) {
      console.error('Error adding lead:', error);
      return null;
    }
  }

  // Get all leads for dashboard
  static async getLeads(): Promise<MarketingLead[]> {
    if (!supabase) {
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('forward_horizon_leads') || '[]');
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  }

  // Update lead status
  static async updateLeadStatus(leadId: string, status: MarketingLead['status'], notes?: string): Promise<boolean> {
    if (!supabase) {
      // Fallback to localStorage
      const leads = JSON.parse(localStorage.getItem('forward_horizon_leads') || '[]');
      const leadIndex = leads.findIndex((l: MarketingLead) => l.id === leadId);
      if (leadIndex !== -1) {
        leads[leadIndex].status = status;
        leads[leadIndex].lastContactAt = new Date().toISOString();
        if (notes) leads[leadIndex].notes = notes;
        localStorage.setItem('forward_horizon_leads', JSON.stringify(leads));
        return true;
      }
      return false;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status, 
          notes,
          last_contact_at: new Date().toISOString() 
        })
        .eq('id', leadId);

      return !error;
    } catch (error) {
      console.error('Error updating lead:', error);
      return false;
    }
  }

  // Track lead activity
  static async trackActivity(activity: LeadActivity): Promise<void> {
    if (!supabase) {
      console.log('Activity tracked:', activity);
      return;
    }

    try {
      await supabase
        .from('lead_activities')
        .insert({
          lead_id: activity.leadId,
          activity_type: activity.activityType,
          description: activity.description,
          timestamp: activity.timestamp,
          staff_id: activity.staffId
        });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  // Calculate priority score based on lead data
  private static calculatePriorityScore(leadData: Omit<MarketingLead, 'id' | 'createdAt'>): number {
    let score = 50; // Base score

    // Program interest scoring
    if (leadData.programInterest === 'veterans') score += 20;
    if (leadData.programInterest === 'recovery') score += 15;
    if (leadData.programInterest === 'reentry') score += 10;

    // Lead source scoring
    if (leadData.leadSource === 'referral') score += 25;
    if (leadData.leadSource === 'google-ads') score += 15;
    if (leadData.leadSource === 'facebook-ads') score += 10;

    // Engagement scoring
    if (leadData.leadMagnet) score += 10; // Downloaded resource
    if (leadData.phone) score += 5; // Provided phone number
    if (leadData.specialNeeds && leadData.specialNeeds.length > 0) score += 10; // Has specific needs

    return Math.min(100, Math.max(0, score));
  }

  // Get lead statistics for dashboard
  static async getLeadStats(): Promise<{
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    scheduledLeads: number;
    conversionRate: number;
  }> {
    const leads = await this.getLeads();
    
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
    const scheduledLeads = leads.filter(l => l.status === 'scheduled').length;
    const admittedLeads = leads.filter(l => l.status === 'admitted').length;
    
    const conversionRate = totalLeads > 0 ? (admittedLeads / totalLeads) * 100 : 0;

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      scheduledLeads,
      conversionRate: Math.round(conversionRate * 10) / 10
    };
  }
}

// Webhook handler for marketing funnel form submissions
export async function handleMarketingWebhook(formData: any) {
  const leadData: Omit<MarketingLead, 'id' | 'createdAt'> = {
    firstName: formData.firstName || formData.first_name,
    lastName: formData.lastName || formData.last_name,
    email: formData.email,
    phone: formData.phone,
    programInterest: formData.program || 'general',
    leadSource: formData.source || 'website',
    leadMagnet: formData.leadMagnet,
    status: 'new',
    notes: `Lead from ${formData.source || 'website'} - ${formData.leadMagnet || 'Contact form'}`
  };

  const lead = await LeadManager.addLead(leadData);
  
  if (lead) {
    // Track the initial activity
    await LeadManager.trackActivity({
      leadId: lead.id!,
      activityType: 'email_sent',
      description: `Welcome email sent for ${leadData.leadMagnet || 'inquiry'}`,
      timestamp: new Date().toISOString()
    });
  }

  return lead;
}