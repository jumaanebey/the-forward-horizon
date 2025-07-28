-- Authentication and Role-Based Access Control Schema
-- Run this to add user authentication and role management

-- User accounts table
CREATE TABLE user_accounts (
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

-- Session management
CREATE TABLE user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role permissions
CREATE TABLE role_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role VARCHAR(20) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL,
  granted BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM Tasks and Follow-ups
CREATE TABLE crm_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES user_accounts(id),
  task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('call', 'email', 'meeting', 'follow_up', 'application_review')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES user_accounts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communication log for CRM
CREATE TABLE lead_communications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_accounts(id),
  communication_type VARCHAR(20) NOT NULL CHECK (communication_type IN ('call', 'email', 'text', 'meeting', 'note')),
  direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  outcome VARCHAR(50),
  next_action VARCHAR(255),
  scheduled_follow_up TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead progression tracking
CREATE TABLE lead_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES user_accounts(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automated follow-up rules
CREATE TABLE follow_up_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trigger_event VARCHAR(50) NOT NULL,
  delay_hours INTEGER NOT NULL,
  task_type VARCHAR(50) NOT NULL,
  template_subject VARCHAR(255),
  template_content TEXT,
  auto_assign_role VARCHAR(20),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_user_accounts_email ON user_accounts(email);
CREATE INDEX idx_user_accounts_role ON user_accounts(role);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_crm_tasks_lead_id ON crm_tasks(lead_id);
CREATE INDEX idx_crm_tasks_assigned_to ON crm_tasks(assigned_to);
CREATE INDEX idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX idx_crm_tasks_status ON crm_tasks(status);
CREATE INDEX idx_lead_communications_lead_id ON lead_communications(lead_id);
CREATE INDEX idx_lead_status_history_lead_id ON lead_status_history(lead_id);

-- Add triggers
CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON user_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_tasks_updated_at BEFORE UPDATE ON crm_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_status_history ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view own account" ON user_accounts FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Managers can view all accounts" ON user_accounts FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_accounts WHERE id::text = auth.uid()::text AND role IN ('manager', 'admin'))
);

CREATE POLICY "Staff can view assigned tasks" ON crm_tasks FOR SELECT USING (
  assigned_to::text = auth.uid()::text OR 
  EXISTS (SELECT 1 FROM user_accounts WHERE id::text = auth.uid()::text AND role IN ('manager', 'admin'))
);

CREATE POLICY "Staff can update assigned tasks" ON crm_tasks FOR UPDATE USING (
  assigned_to::text = auth.uid()::text OR 
  EXISTS (SELECT 1 FROM user_accounts WHERE id::text = auth.uid()::text AND role IN ('manager', 'admin'))
);

-- Insert default role permissions
INSERT INTO role_permissions (role, resource, action, granted) VALUES
('user', 'dashboard', 'view', true),
('user', 'housing', 'view', true),
('user', 'calendar', 'view', true),
('user', 'residents', 'view', false),
('user', 'financial', 'view', false),
('user', 'staff', 'view', false),
('user', 'leads', 'view', false),

('staff', 'dashboard', 'view', true),
('staff', 'housing', 'view', true),
('staff', 'calendar', 'view', true),
('staff', 'calendar', 'create', true),
('staff', 'residents', 'view', true),
('staff', 'residents', 'create', true),
('staff', 'financial', 'view', false),
('staff', 'leads', 'view', true),
('staff', 'leads', 'update', true),

('manager', 'dashboard', 'view', true),
('manager', 'housing', 'view', true),
('manager', 'housing', 'manage', true),
('manager', 'calendar', 'view', true),
('manager', 'calendar', 'create', true),
('manager', 'residents', 'view', true),
('manager', 'residents', 'create', true),
('manager', 'residents', 'update', true),
('manager', 'financial', 'view', true),
('manager', 'staff', 'view', true),
('manager', 'leads', 'view', true),
('manager', 'leads', 'update', true),
('manager', 'leads', 'delete', true),

('admin', 'dashboard', 'view', true),
('admin', 'housing', 'view', true),
('admin', 'housing', 'manage', true),
('admin', 'calendar', 'view', true),
('admin', 'calendar', 'create', true),
('admin', 'calendar', 'update', true),
('admin', 'calendar', 'delete', true),
('admin', 'residents', 'view', true),
('admin', 'residents', 'create', true),
('admin', 'residents', 'update', true),
('admin', 'residents', 'delete', true),
('admin', 'financial', 'view', true),
('admin', 'financial', 'create', true),
('admin', 'financial', 'update', true),
('admin', 'staff', 'view', true),
('admin', 'staff', 'manage', true),
('admin', 'leads', 'view', true),
('admin', 'leads', 'update', true),
('admin', 'leads', 'delete', true),
('admin', 'system', 'manage', true);

-- Insert default admin user
INSERT INTO user_accounts (email, password_hash, first_name, last_name, role, department, status) VALUES
('admin@theforwardhorizon.com', '$2b$12$dummy_hash_replace_in_production', 'System', 'Administrator', 'admin', 'Management', 'active');

-- Insert default follow-up rules
INSERT INTO follow_up_rules (trigger_event, delay_hours, task_type, template_subject, template_content, auto_assign_role, active) VALUES
('lead_created', 2, 'call', 'Welcome Call - New Lead', 'Call new lead to introduce Forward Horizon and answer questions.', 'staff', true),
('lead_created', 24, 'email', 'Follow-up Email', 'Send welcome packet and additional program information.', 'staff', true),
('no_contact_72h', 72, 'call', 'Second Attempt Contact', 'Attempt second contact with lead who hasn''t responded.', 'staff', true),
('application_submitted', 1, 'application_review', 'Review Application', 'Review and process submitted application materials.', 'manager', true),
('qualified_status', 24, 'meeting', 'Schedule Tour', 'Schedule facility tour and program interview.', 'staff', true);