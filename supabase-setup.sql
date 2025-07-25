-- Forward Horizon Management System Database Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  file_path VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Documents are viewable by authenticated users" ON documents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Documents are insertable by authenticated users" ON documents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Documents are updatable by authenticated users" ON documents
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Documents are deletable by authenticated users" ON documents
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Case notes table for communication log
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE NOT NULL,
  staff_id UUID, -- References staff table when created
  note_type VARCHAR(50) NOT NULL DEFAULT 'general', -- general, medical, behavioral, program, incident
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for case notes
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;

-- Case notes policies
CREATE POLICY "Case notes are viewable by authenticated users" ON case_notes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Case notes are insertable by authenticated users" ON case_notes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Case notes are updatable by authenticated users" ON case_notes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Beds/Rooms management table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_number VARCHAR(20) NOT NULL UNIQUE,
  building VARCHAR(50),
  floor INTEGER,
  room_type VARCHAR(50) DEFAULT 'standard', -- standard, private, shared, medical
  capacity INTEGER DEFAULT 1,
  current_occupancy INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'available', -- available, occupied, maintenance, reserved
  amenities TEXT[], -- array of amenities
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for rooms
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Rooms policies
CREATE POLICY "Rooms are viewable by authenticated users" ON rooms
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Rooms are manageable by authenticated users" ON rooms
  FOR ALL USING (auth.role() = 'authenticated');

-- Update residents table to reference rooms
ALTER TABLE residents 
ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id) ON DELETE SET NULL;

-- Alumni tracking table
CREATE TABLE IF NOT EXISTS alumni (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  graduation_date TIMESTAMPTZ NOT NULL,
  program_completed VARCHAR(100),
  exit_reason VARCHAR(100) DEFAULT 'graduated', -- graduated, transferred, dismissed, left_voluntarily
  forwarding_address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(20),
  follow_up_notes TEXT,
  last_contact_date TIMESTAMPTZ,
  employment_status VARCHAR(50),
  housing_status VARCHAR(50),
  sobriety_status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for alumni
ALTER TABLE alumni ENABLE ROW LEVEL SECURITY;

-- Alumni policies
CREATE POLICY "Alumni records are viewable by authenticated users" ON alumni
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Alumni records are manageable by authenticated users" ON alumni
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_resident_id ON documents(resident_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_case_notes_resident_id ON case_notes(resident_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_at ON case_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_alumni_graduation_date ON alumni(graduation_date);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_case_notes_updated_at BEFORE UPDATE ON case_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alumni_updated_at BEFORE UPDATE ON alumni
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();