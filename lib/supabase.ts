import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Resident {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  room_number?: string
  admission_date: string
  program_type: string
  status: 'active' | 'graduated' | 'discharged' | 'suspended'
  emergency_contact_name?: string
  emergency_contact_phone?: string
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  department: string
  hire_date: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  event_type: string
  start_time: string
  end_time: string
  location?: string
  attendees: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
  created_by: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  resident_id: string
  amount: number
  payment_type: 'rent' | 'deposit' | 'fee' | 'other'
  payment_method: 'cash' | 'check' | 'card' | 'transfer'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  due_date: string
  paid_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Incident {
  id: string
  title: string
  description: string
  incident_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  residents_involved: string[]
  staff_involved: string[]
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  occurred_at: string
  reported_at: string
  resolved_at?: string
  created_at: string
  updated_at: string
}