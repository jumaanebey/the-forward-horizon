import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all leads
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    // Calculate scores for each lead
    const scoredLeads = leads.map(lead => {
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

      // Determine priority
      let priority: 'high' | 'medium' | 'low';
      if (score >= 60) priority = 'high';
      else if (score >= 40) priority = 'medium';
      else priority = 'low';

      // Determine next action
      let nextAction = 'Follow up via email';
      if (lead.status === 'new') {
        nextAction = 'Initial contact';
      } else if (lead.status === 'contacted') {
        nextAction = 'Schedule call';
      } else if (lead.status === 'qualified') {
        nextAction = 'Send application';
      } else if (lead.status === 'converted') {
        nextAction = 'Onboarding';
      }

      return {
        leadId: lead.id,
        name: `${lead.first_name} ${lead.last_name}`.trim(),
        email: lead.email,
        inquiryType: lead.inquiry_type,
        score,
        factors,
        priority,
        lastActivity: lead.updated_at || lead.created_at,
        nextAction
      };
    });

    // Sort by score (highest first)
    scoredLeads.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      leads: scoredLeads,
      success: true
    });

  } catch (error) {
    console.error('Error calculating lead scores:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
