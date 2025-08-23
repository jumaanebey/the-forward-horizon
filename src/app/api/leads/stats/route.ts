import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all leads
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const stats = {
      total: leads.length,
      new: leads.filter(lead => lead.status === 'new').length,
      contacted: leads.filter(lead => lead.status === 'contacted').length,
      qualified: leads.filter(lead => lead.status === 'qualified').length,
      converted: leads.filter(lead => lead.status === 'converted').length,
      veterans: leads.filter(lead => lead.inquiry_type === 'veterans').length,
      recovery: leads.filter(lead => lead.inquiry_type === 'recovery').length,
      reentry: leads.filter(lead => lead.inquiry_type === 'reentry').length,
    };

    // Calculate weekly stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyStats = {
      new: leads.filter(lead => 
        new Date(lead.created_at) >= oneWeekAgo
      ).length,
      contacted: leads.filter(lead => 
        lead.status === 'contacted' && 
        new Date(lead.updated_at) >= oneWeekAgo
      ).length,
      converted: leads.filter(lead => 
        lead.status === 'converted' && 
        new Date(lead.updated_at) >= oneWeekAgo
      ).length,
    };

    return NextResponse.json({
      stats: { ...stats, ...weeklyStats },
      success: true
    });

  } catch (error) {
    console.error('Error fetching lead stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
