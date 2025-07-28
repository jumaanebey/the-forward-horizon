-- Simple authentication schema with working demo user
-- Run this in Supabase SQL Editor

-- Create a simple user accounts table
CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
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

-- Create simple session table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo admin user with simple password (admin123)
-- In production, use proper bcrypt hashing
INSERT INTO user_accounts (email, password_hash, first_name, last_name, role, department, status) VALUES
('admin@theforwardhorizon.com', 'admin123', 'System', 'Administrator', 'admin', 'Management', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert demo staff user
INSERT INTO user_accounts (email, password_hash, first_name, last_name, role, department, status) VALUES
('staff@theforwardhorizon.com', 'staff123', 'Sarah', 'Johnson', 'staff', 'Counseling', 'active')
ON CONFLICT (email) DO NOTHING;