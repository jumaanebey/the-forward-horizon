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
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Lead scoring error:', error)
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
    }

    const scored = (leads || []).map(lead => {
      let score = 0
      const factors: string[] = []

      switch (lead.inquiry_type) {
        case 'veterans': score += 25; factors.push('Veterans (+25)'); break
        case 'recovery': score += 20; factors.push('Recovery (+20)'); break
        case 'reentry':  score += 15; factors.push('Re-entry (+15)'); break
      }

      if (lead.sequence_step > 0) {
        score += lead.sequence_step * 5
        factors.push(`Sequence step ${lead.sequence_step} (+${lead.sequence_step * 5})`)
      }

      const days = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / 86400000)
      if (days <= 1) { score += 20; factors.push('Created today (+20)') }
      else if (days <= 3) { score += 15; factors.push('This week (+15)') }
      else if (days <= 7) { score += 10; factors.push('This month (+10)') }

      switch (lead.status) {
        case 'new': score += 10; factors.push('New (+10)'); break
        case 'contacted': score += 15; factors.push('Contacted (+15)'); break
        case 'qualified': score += 25; factors.push('Qualified (+25)'); break
      }

      if (lead.phone) { score += 5; factors.push('Has phone (+5)') }

      const priority = score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low'
      const nextAction = lead.status === 'new' ? 'Initial contact'
        : lead.status === 'contacted' ? 'Schedule call'
        : lead.status === 'qualified' ? 'Send application'
        : 'Onboarding'

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
      }
    })

    scored.sort((a, b) => b.score - a.score)

    return NextResponse.json({ leads: scored, success: true })
  } catch (err) {
    console.error('Lead scoring exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
