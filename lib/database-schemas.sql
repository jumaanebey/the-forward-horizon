-- Forward Horizon Database Schema
-- Complete database structure for transitional housing management

-- Enable Row Level Security and necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users and Authentication
CREATE TABLE auth_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'user',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Management
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth_users(id) ON DELETE SET NULL,
  employee_id VARCHAR(50) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL, -- admin, manager, counselor, case_worker, maintenance
  department VARCHAR(100), -- operations, clinical, administration, maintenance
  hire_date DATE NOT NULL,
  salary DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, terminated
  supervisor_id UUID REFERENCES staff(id),
  certifications TEXT[],
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Housing Properties
CREATE TABLE houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  total_beds INTEGER NOT NULL,
  house_type VARCHAR(50) NOT NULL, -- main, annex, transitional, emergency
  program_types VARCHAR(50)[] NOT NULL, -- veterans, recovery, reentry, general
  amenities TEXT[],
  accessibility_features TEXT[],
  house_manager_id UUID REFERENCES staff(id),
  monthly_operating_cost DECIMAL(10,2),
  status VARCHAR(30) DEFAULT 'operational', -- operational, preparation, maintenance, closed
  lease_start_date DATE,
  lease_end_date DATE,
  max_occupancy INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms within Houses
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  room_number VARCHAR(20) NOT NULL,
  bed_count INTEGER NOT NULL,
  room_type VARCHAR(20) NOT NULL, -- single, double, triple, quad
  amenities TEXT[],
  accessibility_features TEXT[],
  monthly_rate DECIMAL(8,2) NOT NULL,
  security_deposit DECIMAL(8,2) DEFAULT 0,
  program_type VARCHAR(50) NOT NULL, -- veterans, recovery, reentry, general
  gender_restriction VARCHAR(20), -- male, female, mixed
  age_restriction VARCHAR(50), -- 18-25, 26-35, 35+, none
  status VARCHAR(20) DEFAULT 'available', -- available, occupied, maintenance, reserved
  last_cleaned TIMESTAMP WITH TIME ZONE,
  next_inspection DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(house_id, room_number)
);

-- Residents
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE NOT NULL,
  ssn_last_four VARCHAR(4), -- Only last 4 digits for security
  gender VARCHAR(20),
  ethnicity VARCHAR(50),
  veteran_status BOOLEAN DEFAULT false,
  program_type VARCHAR(50) NOT NULL, -- veterans, recovery, reentry, general
  admission_date DATE NOT NULL,
  expected_graduation DATE,
  actual_graduation DATE,
  status VARCHAR(30) DEFAULT 'active', -- active, graduated, discharged, suspended, awol
  case_manager_id UUID REFERENCES staff(id),
  
  -- Emergency Contacts
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  emergency_contact_address TEXT,
  
  -- Medical Information
  medical_conditions TEXT[],
  medications TEXT[],
  allergies TEXT[],
  primary_care_doctor VARCHAR(200),
  
  -- Legal Information
  parole_officer VARCHAR(200),
  parole_end_date DATE,
  legal_restrictions TEXT[],
  
  -- Program Information
  sobriety_date DATE,
  recovery_program VARCHAR(200),
  employment_status VARCHAR(50), -- unemployed, part_time, full_time, student, disabled
  employer VARCHAR(200),
  
  -- Risk Assessment
  risk_score INTEGER DEFAULT 0, -- 0-100 scale
  risk_factors TEXT[],
  last_risk_assessment DATE,
  
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room Assignments
CREATE TABLE room_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  bed_number INTEGER NOT NULL,
  assigned_date DATE NOT NULL,
  checkout_date DATE,
  monthly_rent DECIMAL(8,2) NOT NULL,
  security_deposit_paid DECIMAL(8,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, terminated, transferred
  assignment_reason TEXT,
  checkout_reason TEXT,
  condition_on_checkin TEXT,
  condition_on_checkout TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (bed_number > 0)
);

-- Waitlist Management
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  program_type VARCHAR(50) NOT NULL,
  preferred_house_id UUID REFERENCES houses(id),
  requested_date DATE NOT NULL,
  priority_score INTEGER NOT NULL DEFAULT 50, -- 0-100 scale
  special_needs TEXT[],
  veteran_status BOOLEAN DEFAULT false,
  contact_notes TEXT,
  status VARCHAR(30) DEFAULT 'active', -- active, contacted, scheduled, admitted, inactive
  lead_source VARCHAR(100), -- website, referral, walk_in, social_media
  assigned_to UUID REFERENCES staff(id),
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Notes and Documentation
CREATE TABLE case_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id),
  note_type VARCHAR(50) NOT NULL, -- daily, weekly, incident, medical, legal, progress
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  visibility VARCHAR(30) DEFAULT 'staff', -- staff, management, clinical
  is_confidential BOOLEAN DEFAULT false,
  tags TEXT[], -- counseling, employment, family, legal, medical
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  attachments TEXT[], -- file URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents and Violations
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  incident_type VARCHAR(50) NOT NULL, -- violation, medical, behavioral, property, safety
  severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
  location VARCHAR(200),
  residents_involved UUID[] NOT NULL,
  staff_involved UUID[],
  witnesses TEXT[],
  status VARCHAR(30) DEFAULT 'open', -- open, investigating, resolved, closed
  resolution TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  reported_by UUID NOT NULL REFERENCES staff(id),
  investigating_officer UUID REFERENCES staff(id),
  
  -- Follow-up actions
  actions_taken TEXT[],
  disciplinary_action TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  
  attachments TEXT[], -- photos, documents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Transactions
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(50) NOT NULL, -- rent, deposit, fee, fine, refund
  payment_method VARCHAR(30) NOT NULL, -- cash, check, card, transfer, money_order
  status VARCHAR(30) DEFAULT 'pending', -- pending, completed, failed, refunded, cancelled
  reference_number VARCHAR(100),
  due_date DATE,
  paid_date DATE,
  late_fee DECIMAL(8,2) DEFAULT 0,
  description TEXT,
  notes TEXT,
  processed_by UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program Services and Appointments
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  service_type VARCHAR(50) NOT NULL, -- counseling, medical, legal, employment, education
  description TEXT,
  provider VARCHAR(200),
  location VARCHAR(200),
  cost DECIMAL(8,2) DEFAULT 0,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER DEFAULT 1,
  is_mandatory BOOLEAN DEFAULT false,
  program_types VARCHAR(50)[], -- which programs require this service
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar and Appointments
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL, -- appointment, meeting, program, maintenance, inspection
  service_id UUID REFERENCES services(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(200),
  house_id UUID REFERENCES houses(id),
  room_id UUID REFERENCES rooms(id),
  
  -- Participants
  residents UUID[], -- array of resident IDs
  staff_members UUID[], -- array of staff IDs
  max_attendees INTEGER,
  
  status VARCHAR(30) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
  completion_notes TEXT,
  created_by UUID NOT NULL REFERENCES staff(id),
  
  -- Recurring events
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB, -- stores recurrence rules
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program Progress Tracking
CREATE TABLE program_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  program_milestone VARCHAR(200) NOT NULL,
  milestone_type VARCHAR(50) NOT NULL, -- orientation, 30_day, 60_day, 90_day, graduation
  target_date DATE,
  completion_date DATE,
  status VARCHAR(30) DEFAULT 'pending', -- pending, in_progress, completed, missed, waived
  completion_percentage INTEGER DEFAULT 0,
  notes TEXT,
  assessed_by UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Management
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  document_type VARCHAR(50) NOT NULL, -- intake, medical, legal, financial, progress
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_confidential BOOLEAN DEFAULT false,
  retention_date DATE, -- when document can be purged
  tags TEXT[],
  uploaded_by UUID NOT NULL REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automated Workflows
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  workflow_type VARCHAR(50) NOT NULL, -- admissions, interventions, communications, compliance
  trigger_config JSONB NOT NULL, -- defines when workflow triggers
  steps JSONB NOT NULL, -- workflow steps and actions
  status VARCHAR(30) DEFAULT 'active', -- active, paused, draft, archived
  success_rate DECIMAL(5,2) DEFAULT 0,
  execution_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Executions
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  resident_id UUID REFERENCES residents(id),
  trigger_data JSONB,
  execution_steps JSONB,
  status VARCHAR(30) DEFAULT 'running', -- running, completed, failed, cancelled
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI/ML Predictions and Analytics
CREATE TABLE ai_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  prediction_type VARCHAR(50) NOT NULL, -- success_rate, risk_assessment, graduation_date
  prediction_value DECIMAL(10,4) NOT NULL,
  confidence_score DECIMAL(5,4) NOT NULL,
  key_factors JSONB, -- factors that influenced the prediction
  recommendations TEXT[],
  model_version VARCHAR(50),
  predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- when prediction becomes stale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Analytics
CREATE TABLE analytics_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name VARCHAR(100) NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- occupancy, financial, operational, program
  metric_value DECIMAL(15,4) NOT NULL,
  metric_date DATE NOT NULL,
  house_id UUID REFERENCES houses(id),
  program_type VARCHAR(50),
  additional_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(metric_name, metric_date, house_id, program_type)
);

-- Create indexes for better performance
CREATE INDEX idx_residents_status ON residents(status);
CREATE INDEX idx_residents_program_type ON residents(program_type);
CREATE INDEX idx_residents_admission_date ON residents(admission_date);
CREATE INDEX idx_residents_case_manager ON residents(case_manager_id);

CREATE INDEX idx_room_assignments_resident ON room_assignments(resident_id);
CREATE INDEX idx_room_assignments_room ON room_assignments(room_id);
CREATE INDEX idx_room_assignments_status ON room_assignments(status);

CREATE INDEX idx_case_notes_resident ON case_notes(resident_id);
CREATE INDEX idx_case_notes_date ON case_notes(created_at);
CREATE INDEX idx_case_notes_type ON case_notes(note_type);

CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_occurred ON incidents(occurred_at);

CREATE INDEX idx_payments_resident ON payments(resident_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);

CREATE INDEX idx_calendar_events_start ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_status ON calendar_events(status);

CREATE INDEX idx_analytics_metrics_date ON analytics_metrics(metric_date);
CREATE INDEX idx_analytics_metrics_name ON analytics_metrics(metric_name);

-- Row Level Security (RLS) Policies
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create functions for automated timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_auth_users_updated_at BEFORE UPDATE ON auth_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON houses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_assignments_updated_at BEFORE UPDATE ON room_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_notes_updated_at BEFORE UPDATE ON case_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_program_progress_updated_at BEFORE UPDATE ON program_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO houses (name, address, city, state, zip_code, total_beds, house_type, program_types, max_occupancy) VALUES
('Main House', '123 Hope Street', 'Los Angeles', 'CA', '90210', 24, 'main', ARRAY['veterans', 'recovery', 'reentry'], 24),
('Veterans Annex', '456 Service Avenue', 'Los Angeles', 'CA', '90211', 16, 'annex', ARRAY['veterans'], 16),
('Recovery Center', '789 Healing Way', 'Los Angeles', 'CA', '90212', 20, 'transitional', ARRAY['recovery'], 20);

INSERT INTO services (name, service_type, description, duration_minutes, is_mandatory, program_types) VALUES
('Individual Counseling', 'counseling', 'One-on-one counseling sessions', 50, true, ARRAY['veterans', 'recovery', 'reentry']),
('Group Therapy', 'counseling', 'Group therapy sessions', 90, true, ARRAY['recovery']),
('Job Training Workshop', 'employment', 'Job readiness and skills training', 120, true, ARRAY['reentry']),
('Medical Check-up', 'medical', 'Routine medical examination', 30, true, ARRAY['veterans', 'recovery', 'reentry']),
('Legal Aid Consultation', 'legal', 'Legal assistance and consultation', 60, false, ARRAY['reentry']);

-- Add some sample workflow templates
INSERT INTO workflows (name, description, workflow_type, trigger_config, steps, created_by) VALUES
('New Resident Onboarding', 'Automated welcome sequence for new residents', 'admissions', 
 '{"event": "resident.created", "conditions": []}',
 '[{"type": "action", "name": "send_welcome_email", "delay": "0h"}, {"type": "delay", "duration": "24h"}, {"type": "action", "name": "schedule_orientation", "config": {"duration": "60min"}}]',
 (SELECT id FROM staff LIMIT 1)),
('Risk Assessment Monitor', 'Daily monitoring for high-risk residents', 'interventions',
 '{"schedule": "daily", "time": "09:00", "conditions": [{"field": "risk_score", "operator": ">", "value": 75}]}',
 '[{"type": "condition", "name": "high_risk_check"}, {"type": "action", "name": "alert_case_manager", "config": {"priority": "high"}}]',
 (SELECT id FROM staff LIMIT 1));

COMMENT ON DATABASE forward_horizon IS 'Comprehensive transitional housing management system with AI-powered insights and automation';