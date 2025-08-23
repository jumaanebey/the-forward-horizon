import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')

    if (error) {
      console.error('Lead stats error:', error)
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
    }

    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      converted: leads.filter(l => l.status === 'converted').length,
      veterans: leads.filter(l => l.inquiry_type === 'veterans').length,
      recovery: leads.filter(l => l.inquiry_type === 'recovery').length,
      reentry: leads.filter(l => l.inquiry_type === 'reentry').length,
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weekly = {
      new: leads.filter(l => new Date(l.created_at) >= oneWeekAgo).length,
      contacted: leads.filter(l => l.status === 'contacted' && new Date(l.updated_at) >= oneWeekAgo).length,
      converted: leads.filter(l => l.status === 'converted' && new Date(l.updated_at) >= oneWeekAgo).length,
    }

    return NextResponse.json({ stats: { ...stats, ...weekly }, success: true })
  } catch (err) {
    console.error('Lead stats exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
