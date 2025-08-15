-- Forward Horizon Production Database Schema (FIXED)
-- Phase 1: Real Database Integration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User accounts and authentication
CREATE TABLE IF NOT EXISTS user_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'staff', 'manager', 'admin')),
    department VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role permissions for access control
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, resource, action)
);

-- Houses/properties
CREATE TABLE IF NOT EXISTS houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    total_beds INTEGER NOT NULL,
    house_type VARCHAR(50) NOT NULL DEFAULT 'main' CHECK (house_type IN ('main', 'annex', 'transitional')),
    amenities TEXT[],
    status VARCHAR(50) NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'preparation', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms within houses
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    bed_count INTEGER NOT NULL DEFAULT 1,
    room_type VARCHAR(20) NOT NULL DEFAULT 'single' CHECK (room_type IN ('single', 'double', 'triple', 'quad')),
    amenities TEXT[],
    accessibility_features TEXT[],
    monthly_rate DECIMAL(10,2) NOT NULL,
    program_type VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (program_type IN ('veterans', 'recovery', 'reentry', 'general')),
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(house_id, room_number)
);

-- Residents
CREATE TABLE IF NOT EXISTS residents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    room_number VARCHAR(20),
    admission_date DATE NOT NULL,
    program_type VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (program_type IN ('veterans', 'recovery', 'reentry', 'general')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'discharged', 'suspended')),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room assignments
CREATE TABLE IF NOT EXISTS room_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    bed_number INTEGER NOT NULL DEFAULT 1,
    assigned_date DATE NOT NULL,
    checkout_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff members
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    hire_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('rent', 'deposit', 'fee', 'other')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'check', 'card', 'transfer')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    due_date DATE NOT NULL,
    paid_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist entries
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    program_type VARCHAR(50) NOT NULL CHECK (program_type IN ('veterans', 'recovery', 'reentry', 'general')),
    requested_date DATE NOT NULL,
    priority_score INTEGER NOT NULL DEFAULT 50,
    special_needs TEXT[],
    contact_info TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'contacted', 'scheduled', 'inactive')),
    lead_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar events
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(200),
    attendees UUID[],
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_by UUID NOT NULL REFERENCES user_accounts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents/incident reports
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    incident_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    residents_involved UUID[],
    staff_involved UUID[],
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead management
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    inquiry_type VARCHAR(50) NOT NULL CHECK (inquiry_type IN ('veteran-housing', 'sober-living', 'reentry-housing')),
    message TEXT,
    ai_score INTEGER,
    ai_classification VARCHAR(20),
    ai_insights JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'converted', 'inactive')),
    sequence_step INTEGER DEFAULT 0,
    last_email_sent TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics tracking
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    event_properties JSONB,
    user_id UUID REFERENCES user_accounts(id),
    session_id VARCHAR(255),
    page_url VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_name VARCHAR(100) NOT NULL,
    duration_ms INTEGER NOT NULL,
    user_id UUID REFERENCES user_accounts(id),
    page_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents(status);
CREATE INDEX IF NOT EXISTS idx_residents_program_type ON residents(program_type);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_program_type ON rooms(program_type);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_priority_score ON waitlist(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_inquiry_type ON leads(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON user_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON houses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_assignments_updated_at BEFORE UPDATE ON room_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default role permissions
INSERT INTO role_permissions (role, resource, action, granted) VALUES
-- Admin permissions
('admin', 'residents', 'read', true),
('admin', 'residents', 'create', true),
('admin', 'residents', 'update', true),
('admin', 'residents', 'delete', true),
('admin', 'payments', 'read', true),
('admin', 'payments', 'create', true),
('admin', 'payments', 'update', true),
('admin', 'payments', 'delete', true),
('admin', 'analytics', 'read', true),
('admin', 'settings', 'read', true),
('admin', 'settings', 'update', true),

-- Manager permissions
('manager', 'residents', 'read', true),
('manager', 'residents', 'create', true),
('manager', 'residents', 'update', true),
('manager', 'payments', 'read', true),
('manager', 'payments', 'create', true),
('manager', 'payments', 'update', true),
('manager', 'analytics', 'read', true),

-- Staff permissions
('staff', 'residents', 'read', true),
('staff', 'residents', 'create', true),
('staff', 'residents', 'update', true),
('staff', 'payments', 'read', true),
('staff', 'payments', 'create', true),

-- User permissions (residents)
('user', 'profile', 'read', true),
('user', 'profile', 'update', true),
('user', 'payments', 'read', true),
('user', 'documents', 'read', true)
ON CONFLICT (role, resource, action) DO NOTHING;

-- Insert sample data for testing
INSERT INTO houses (name, address, total_beds, house_type, amenities, status) VALUES
('Main House', '123 Recovery Way, Los Angeles, CA 90210', 12, 'main', ARRAY['Kitchen', 'Laundry', 'Common Area', 'WiFi'], 'operational'),
('Veterans Annex', '124 Recovery Way, Los Angeles, CA 90210', 8, 'annex', ARRAY['Kitchen', 'Laundry', 'Veterans Lounge', 'WiFi'], 'operational'),
('Transitional House', '125 Recovery Way, Los Angeles, CA 90210', 6, 'transitional', ARRAY['Kitchen', 'Laundry', 'Study Room', 'WiFi'], 'operational')
ON CONFLICT DO NOTHING;

-- Insert sample rooms
INSERT INTO rooms (house_id, room_number, bed_count, room_type, monthly_rate, program_type, status) 
SELECT 
    h.id,
    '101',
    2,
    'double',
    800.00,
    'general',
    'available'
FROM houses h WHERE h.name = 'Main House'
UNION ALL
SELECT 
    h.id,
    '102',
    1,
    'single',
    1000.00,
    'veterans',
    'available'
FROM houses h WHERE h.name = 'Veterans Annex'
UNION ALL
SELECT 
    h.id,
    '201',
    2,
    'double',
    750.00,
    'recovery',
    'available'
FROM houses h WHERE h.name = 'Transitional House'
ON CONFLICT DO NOTHING;

-- Insert sample staff
INSERT INTO staff (first_name, last_name, email, phone, role, department, hire_date, status) VALUES
('John', 'Smith', 'john.smith@forwardhorizon.com', '(555) 123-4567', 'House Manager', 'Operations', '2024-01-15', 'active'),
('Sarah', 'Johnson', 'sarah.johnson@forwardhorizon.com', '(555) 123-4568', 'Case Manager', 'Social Services', '2024-02-01', 'active'),
('Mike', 'Davis', 'mike.davis@forwardhorizon.com', '(555) 123-4569', 'Maintenance', 'Facilities', '2024-01-20', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample admin user (password: admin123)
INSERT INTO user_accounts (email, password_hash, first_name, last_name, role, department, status) VALUES
('admin@forwardhorizon.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2.', 'Admin', 'User', 'admin', 'Management', 'active')
ON CONFLICT DO NOTHING;
