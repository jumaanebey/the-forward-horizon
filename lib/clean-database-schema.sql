CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE residents (
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

CREATE TABLE staff (
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

CREATE TABLE calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  attendees TEXT[],
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_by UUID REFERENCES staff(id),
  google_event_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('rent', 'deposit', 'fee', 'other')),
  payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'check', 'card', 'transfer')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  due_date DATE NOT NULL,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  incident_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  residents_involved UUID[],
  staff_involved UUID[],
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_days INTEGER,
  capacity INTEGER,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'development')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE daily_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  metric_date DATE NOT NULL UNIQUE,
  total_residents INTEGER DEFAULT 0,
  occupancy_rate DECIMAL(5,2) DEFAULT 0,
  daily_revenue DECIMAL(10,2) DEFAULT 0,
  incidents_count INTEGER DEFAULT 0,
  new_admissions INTEGER DEFAULT 0,
  discharges INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE case_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id),
  staff_id UUID REFERENCES staff(id),
  note_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id),
  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES staff(id),
  is_confidential BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_residents_status ON residents(status);
CREATE INDEX idx_residents_admission_date ON residents(admission_date);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_payments_resident_id ON payments(resident_id);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_incidents_occurred_at ON incidents(occurred_at);
CREATE INDEX idx_case_notes_resident_id ON case_notes(resident_id);
CREATE INDEX idx_documents_resident_id ON documents(resident_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_metrics_updated_at BEFORE UPDATE ON daily_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_notes_updated_at BEFORE UPDATE ON case_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view all residents" ON residents FOR SELECT USING (true);
CREATE POLICY "Staff can insert residents" ON residents FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update residents" ON residents FOR UPDATE USING (true);
CREATE POLICY "Staff can view all staff" ON staff FOR SELECT USING (true);
CREATE POLICY "Staff can view all events" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "Staff can create events" ON calendar_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can view all payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Staff can view all incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Staff can view all case notes" ON case_notes FOR SELECT USING (true);
CREATE POLICY "Staff can view all documents" ON documents FOR SELECT USING (true);

INSERT INTO staff (first_name, last_name, email, role, department, hire_date) 
VALUES ('Admin', 'User', 'admin@theforwardhorizon.com', 'Administrator', 'Management', CURRENT_DATE);

CREATE TABLE houses (
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

CREATE TABLE rooms (
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

CREATE TABLE room_assignments (
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

CREATE TABLE waitlist (
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

CREATE INDEX idx_rooms_house_id ON rooms(house_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_program_type ON rooms(program_type);
CREATE INDEX idx_room_assignments_room_id ON room_assignments(room_id);
CREATE INDEX idx_room_assignments_resident_id ON room_assignments(resident_id);
CREATE INDEX idx_room_assignments_status ON room_assignments(status);
CREATE INDEX idx_waitlist_program_type ON waitlist(program_type);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_requested_date ON waitlist(requested_date);

CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON houses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_assignments_updated_at BEFORE UPDATE ON room_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
$$ language 'plpgsql';

CREATE TRIGGER update_house_beds_on_room_change
  AFTER INSERT OR UPDATE OR DELETE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_house_total_beds();

INSERT INTO houses (name, address, total_beds, house_type, amenities, status) VALUES 
('Forward Horizon Main House', '123 Recovery Way, Pasadena, CA 91101', 0, 'main', 
 ARRAY['Common Kitchen', 'Living Room', 'Laundry Facilities', 'Study Room', 'Garden/Patio', 'Parking', 'Security System'], 
 'preparation');

DO $$
DECLARE
    house_uuid UUID;
BEGIN
    SELECT id INTO house_uuid FROM houses WHERE name = 'Forward Horizon Main House';
    
    INSERT INTO rooms (house_id, room_number, bed_count, room_type, amenities, monthly_rate, program_type, accessibility_features) VALUES 
    (house_uuid, 'A-101', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 800.00, 'veterans', ARRAY['Ground Floor']),
    (house_uuid, 'A-102', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 800.00, 'veterans', ARRAY['Ground Floor']),
    (house_uuid, 'B-201', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 750.00, 'recovery', NULL),
    (house_uuid, 'B-202', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 750.00, 'recovery', NULL),
    (house_uuid, 'C-301', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 725.00, 'reentry', NULL),
    (house_uuid, 'C-302', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 725.00, 'reentry', NULL),
    (house_uuid, 'D-401', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 700.00, 'general', NULL),
    (house_uuid, 'D-402', 2, 'double', ARRAY['Private Bathroom', 'AC/Heat', 'Window'], 700.00, 'general', NULL),
    (house_uuid, 'E-501', 1, 'single', ARRAY['Private Bathroom', 'AC/Heat', 'Window', 'Desk'], 950.00, 'veterans', ARRAY['ADA Compliant']),
    (house_uuid, 'E-502', 1, 'single', ARRAY['Private Bathroom', 'AC/Heat', 'Window', 'Desk'], 950.00, 'veterans', ARRAY['ADA Compliant']),
    (house_uuid, 'E-503', 3, 'triple', ARRAY['Shared Bathroom', 'AC/Heat', 'Window'], 600.00, 'general', NULL),
    (house_uuid, 'E-504', 3, 'triple', ARRAY['Shared Bathroom', 'AC/Heat', 'Window'], 600.00, 'general', NULL);
END $$;

INSERT INTO programs (name, description, status) VALUES 
('Veterans Recovery Program', 'Specialized program for military veterans', 'development'),
('General Recovery Housing', 'Standard recovery housing program', 'development'),
('Re-entry Support Program', 'Program for individuals transitioning from incarceration', 'development');

INSERT INTO daily_metrics (metric_date, total_residents, occupancy_rate, daily_revenue, incidents_count, new_admissions, discharges)
VALUES (CURRENT_DATE, 0, 0.0, 0.0, 0, 0, 0);