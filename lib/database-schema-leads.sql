-- Additional tables for lead management and marketing integration
-- Run this AFTER the main database-schema.sql

-- Leads table for marketing funnel integration
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  program_interest VARCHAR(50) NOT NULL CHECK (program_interest IN ('veterans', 'recovery', 'reentry', 'general')),
  lead_source VARCHAR(100) NOT NULL, -- 'google-ads', 'facebook-ads', 'website', 'referral'
  lead_magnet VARCHAR(255), -- Which PDF they downloaded
  priority_score INTEGER DEFAULT 50 CHECK (priority_score BETWEEN 0 AND 100),
  special_needs TEXT[],
  notes TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'scheduled', 'admitted', 'inactive')),
  waitlist_id UUID REFERENCES waitlist(id),
  last_contact_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead activities table for tracking interactions
CREATE TABLE lead_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('email_opened', 'pdf_downloaded', 'phone_call', 'email_sent', 'meeting_scheduled')),
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  staff_id UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for leads tables
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_program_interest ON leads(program_interest);
CREATE INDEX idx_leads_lead_source ON leads(lead_source);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_timestamp ON lead_activities(timestamp);

-- Create triggers for leads tables
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Staff can insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update leads" ON leads FOR UPDATE USING (true);
CREATE POLICY "Staff can view all lead activities" ON lead_activities FOR SELECT USING (true);
CREATE POLICY "Staff can insert lead activities" ON lead_activities FOR INSERT WITH CHECK (true);