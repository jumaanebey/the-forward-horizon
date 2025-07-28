import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if valid credentials are provided
export const supabase = (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase-url') || supabaseKey.includes('your-supabase-anon-key')) 
  ? null 
  : createClient(supabaseUrl, supabaseKey)

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

// Housing inventory interfaces
export interface House {
  id: string
  name: string
  address: string
  total_beds: number
  house_type: 'main' | 'annex' | 'transitional'
  amenities: string[]
  status: 'operational' | 'preparation' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  house_id: string
  room_number: string
  bed_count: number
  room_type: 'single' | 'double' | 'triple' | 'quad'
  amenities: string[]
  accessibility_features?: string[]
  monthly_rate: number
  program_type: 'veterans' | 'recovery' | 'reentry' | 'general'
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  created_at: string
  updated_at: string
}

export interface RoomAssignment {
  id: string
  room_id: string
  resident_id: string
  bed_number: number
  assigned_date: string
  checkout_date?: string
  status: 'active' | 'completed' | 'terminated'
  created_at: string
  updated_at: string
}

export interface WaitlistEntry {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  program_type: string
  requested_date: string
  priority_score: number
  special_needs?: string[]
  contact_info?: string
  status: 'active' | 'contacted' | 'scheduled' | 'inactive'
  lead_source?: string
  created_at: string
  updated_at: string
}

// Housing inventory API functions
export const housingAPI = {
  // Get all houses with room data
  async getHousesWithRooms() {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        rooms (
          *,
          room_assignments!inner (
            id,
            bed_number,
            status
          )
        )
      `)
    
    if (error) throw error
    return data
  },

  // Get rooms with occupancy data
  async getRoomsWithOccupancy() {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        *,
        houses (name),
        room_assignments!left (
          id,
          bed_number,
          status
        )
      `)
    
    if (error) throw error
    return data
  },

  // Get waitlist entries
  async getWaitlist() {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('priority_score', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Add new waitlist entry
  async addWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('waitlist')
      .insert(entry)
      .select()
    
    if (error) throw error
    return data
  },

  // Update room status
  async updateRoomStatus(roomId: string, status: Room['status']) {
    if (!supabase) throw new Error('Supabase not configured')
    
    const { data, error } = await supabase
      .from('rooms')
      .update({ status })
      .eq('id', roomId)
      .select()
    
    if (error) throw error
    return data
  }
}