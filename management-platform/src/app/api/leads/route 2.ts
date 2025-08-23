import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/leads - list leads with filters/pagination
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const inquiryType = searchParams.get('inquiry_type')
    const search = searchParams.get('search')

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (inquiryType) query = query.eq('inquiry_type', inquiryType)
    if (search) query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) {
      console.error('Leads GET error:', error)
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
    }

    return NextResponse.json({
      leads: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (err) {
    console.error('Leads GET exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/leads - create lead
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, inquiryType, message, source } = body

    if (!firstName || !email || !inquiryType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // prevent duplicates by email
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Lead already exists' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({
        first_name: firstName,
        last_name: lastName || '',
        email,
        phone: phone || '',
        inquiry_type: inquiryType,
        message: message || '',
        source: source || 'website',
        status: 'new',
        sequence_step: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Leads POST error:', error)
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Lead created', lead: data }, { status: 201 })
  } catch (err) {
    console.error('Leads POST exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/leads - update lead
export async function PUT(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 })

    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Leads PUT error:', error)
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Lead updated', lead: data })
  } catch (err) {
    console.error('Leads PUT exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
