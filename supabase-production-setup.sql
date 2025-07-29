-- Forward Horizon Production Database Setup
-- Run this in Supabase SQL Editor after creating project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create all tables from main schema
-- Core tables
CREATE TABLE IF NOT EXISTS residents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  room_number VARCHAR(10),
  admission_date DATE NOT NULL,
  program_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'discharged', 'suspended')),
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  hire_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Housing tables
CREATE TABLE IF NOT EXISTS houses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  total_beds INTEGER NOT NULL DEFAULT 0,
  house_type VARCHAR(50) DEFAULT 'main' CHECK (house_type IN ('main', 'annex', 'transitional')),
  amenities TEXT[],
  status VARCHAR(20) DEFAULT 'preparation' CHECK (status IN ('operational', 'preparation', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  room_number VARCHAR(20) NOT NULL,
  bed_count INTEGER NOT NULL DEFAULT 1,
  room_type VARCHAR(20) DEFAULT 'double' CHECK (room_type IN ('single', 'double', 'triple', 'quad')),
  amenities TEXT[],
  accessibility_features TEXT[],
  monthly_rate DECIMAL(10,2) NOT NULL,
  program_type VARCHAR(50) DEFAULT 'general' CHECK (program_type IN ('veterans', 'recovery', 'reentry', 'general')),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(house_id, room_number)
);

CREATE TABLE IF NOT EXISTS room_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  bed_number INTEGER NOT NULL,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checkout_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, bed_number)
);

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  program_type VARCHAR(50) NOT NULL,
  requested_date DATE NOT NULL,
  priority_score INTEGER DEFAULT 50 CHECK (priority_score BETWEEN 0 AND 100),
  special_needs TEXT[],
  contact_info TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'contacted', 'scheduled', 'inactive')),
  lead_source VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM tables for lead management
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  program_interest VARCHAR(50) NOT NULL,
  lead_source VARCHAR(100) NOT NULL,
  lead_magnet VARCHAR(255),
  priority_score INTEGER DEFAULT 50,
  special_needs TEXT[],
  notes TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'scheduled', 'admitted', 'inactive')),
  waitlist_id UUID REFERENCES waitlist(id),
  last_contact_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to VARCHAR(100),
  task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('call', 'email', 'meeting', 'follow_up', 'application_review')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_communications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  communication_type VARCHAR(20) NOT NULL CHECK (communication_type IN ('call', 'email', 'text', 'meeting', 'note')),
  direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  outcome TEXT,
  next_action TEXT,
  scheduled_follow_up TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User accounts for authentication
CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'staff', 'manager', 'admin')),
  department VARCHAR(100),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_days INTEGER,
  capacity INTEGER,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'development')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar events
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  attendees TEXT[],
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_by UUID REFERENCES user_accounts(id),
  google_event_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents(status);
CREATE INDEX IF NOT EXISTS idx_residents_admission_date ON residents(admission_date);
CREATE INDEX IF NOT EXISTS idx_rooms_house_id ON rooms(house_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_room_assignments_room_id ON room_assignments(room_id);
CREATE INDEX IF NOT EXISTS idx_room_assignments_resident_id ON room_assignments(resident_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_program_type ON waitlist(program_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);

-- Insert initial data

-- Insert main house
INSERT INTO houses (name, address, total_beds, house_type, amenities, status) VALUES 
('Forward Horizon Main House', 'Pasadena, CA 91101', 0, 'main', 
 ARRAY['Common Kitchen', 'Living Room', 'Laundry Facilities', 'Study Room', 'Garden/Patio', 'Parking', 'Security System'], 
 'preparation')
ON CONFLICT DO NOTHING;

-- Get house ID for room insertions
DO $$
DECLARE
    house_uuid UUID;
BEGIN
    SELECT id INTO house_uuid FROM houses WHERE name = 'Forward Horizon Main House' LIMIT 1;
    
    -- Insert rooms if house exists
    IF house_uuid IS NOT NULL THEN
        -- Veterans rooms
        INSERT INTO rooms (house_id, room_number, bed_count, room_type, amenities, monthly_rate, program_type, accessibility_features) VALUES 
        (house_uuid, 'A-101', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 800.00, 'veterans', ARRAY['Ground Floor']),
        (house_uuid, 'A-102', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 800.00, 'veterans', ARRAY['Ground Floor']),
        (house_uuid, 'E-501', 1, 'single', ARRAY['Private Bathroom', 'AC/Heat', 'Window', 'Desk'], 950.00, 'veterans', ARRAY['ADA Compliant']),
        (house_uuid, 'E-502', 1, 'single', ARRAY['Private Bathroom', 'AC/Heat', 'Window', 'Desk'], 950.00, 'veterans', ARRAY['ADA Compliant']),
        
        -- Recovery rooms
        (house_uuid, 'B-201', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 750.00, 'recovery', NULL),
        (house_uuid, 'B-202', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 750.00, 'recovery', NULL),
        
        -- Re-entry rooms
        (house_uuid, 'C-301', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 725.00, 'reentry', NULL),
        (house_uuid, 'C-302', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 725.00, 'reentry', NULL),
        
        -- General rooms
        (house_uuid, 'D-401', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 700.00, 'general', NULL),
        (house_uuid, 'D-402', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 700.00, 'general', NULL),
        (house_uuid, 'E-503', 3, 'triple', ARRAY['Shared Bathroom', 'AC/Heat', 'Window'], 600.00, 'general', NULL),
        (house_uuid, 'E-504', 3, 'triple', ARRAY['Shared Bathroom', 'AC/Heat', 'Window'], 600.00, 'general', NULL)
        ON CONFLICT (house_id, room_number) DO NOTHING;
    END IF;
END $$;

-- Insert programs
INSERT INTO programs (name, description, status) VALUES 
('Veterans Recovery Program', 'Specialized program for military veterans', 'development'),
('General Recovery Housing', 'Standard recovery housing program', 'development'),
('Re-entry Support Program', 'Program for individuals transitioning from incarceration', 'development')
ON CONFLICT DO NOTHING;

-- Insert demo user accounts
INSERT INTO user_accounts (email, first_name, last_name, role, department, status) VALUES 
('admin@theforwardhorizon.com', 'System', 'Administrator', 'admin', 'Management', 'active'),
('staff@theforwardhorizon.com', 'Sarah', 'Johnson', 'staff', 'Counseling', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample waitlist entries
INSERT INTO waitlist (first_name, last_name, program_type, requested_date, priority_score, special_needs, contact_info, status, lead_source) VALUES 
('James', 'Smith', 'veterans', CURRENT_DATE + INTERVAL '45 days', 85, ARRAY['PTSD Support', 'Job Placement'], 'Contact via marketing leads', 'active', 'facebook-ads'),
('Maria', 'Garcia', 'recovery', CURRENT_DATE + INTERVAL '50 days', 78, ARRAY['Women-Only Space'], 'Contact via marketing leads', 'active', 'google-ads'),
('Robert', 'Johnson', 'reentry', CURRENT_DATE + INTERVAL '60 days', 72, ARRAY['Job Training', 'Legal Aid'], 'Contact via marketing leads', 'active', 'website')
ON CONFLICT DO NOTHING;

-- Function to update house total_beds automatically
CREATE OR REPLACE FUNCTION update_house_total_beds()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE houses 
    SET total_beds = (
      SELECT COALESCE(SUM(bed_count), 0) 
      FROM rooms 
      WHERE house_id = OLD.house_id
    )
    WHERE id = OLD.house_id;
    RETURN OLD;
  ELSE
    UPDATE houses 
    SET total_beds = (
      SELECT COALESCE(SUM(bed_count), 0) 
      FROM rooms 
      WHERE house_id = NEW.house_id
    )
    WHERE id = NEW.house_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update house total_beds
DROP TRIGGER IF EXISTS update_house_beds_on_room_change ON rooms;
CREATE TRIGGER update_house_beds_on_room_change
  AFTER INSERT OR UPDATE OR DELETE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_house_total_beds();

-- Function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON houses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_assignments_updated_at BEFORE UPDATE ON room_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON user_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update house total_beds after inserting rooms
UPDATE houses SET total_beds = (
  SELECT COALESCE(SUM(bed_count), 0) 
  FROM rooms 
  WHERE house_id = houses.id
);

-- Verify setup
SELECT 'Setup complete! Tables created:' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;