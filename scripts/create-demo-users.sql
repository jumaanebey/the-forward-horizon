-- Create demo users for testing the role-based system
-- Run this in Supabase SQL Editor after the auth schema

-- First, we need to create the auth tables if they haven't been created
-- Make sure you've run the auth-schema.sql first

-- Create demo users with different roles
-- Note: In production, use proper password hashing

-- Admin user
INSERT INTO user_accounts (email, password_hash, first_name, last_name, role, department, status) VALUES
('admin@theforwardhorizon.com', '$2b$12$LVqX.8.gF8kX2qH5nF8Xu.uTZYl3MzPnX3r3Z3Z3Z3Z3Z3Z3Z3Z3Z2', 'System', 'Administrator', 'admin', 'Management', 'active'),
('manager@theforwardhorizon.com', '$2b$12$LVqX.8.gF8kX2qH5nF8Xu.uTZYl3MzPnX3r3Z3Z3Z3Z3Z3Z3Z3Z3Z2', 'Program', 'Manager', 'manager', 'Operations', 'active'),
('staff@theforwardhorizon.com', '$2b$12$LVqX.8.gF8kX2qH5nF8Xu.uTZYl3MzPnX3r3Z3Z3Z3Z3Z3Z3Z3Z3Z2', 'Sarah', 'Johnson', 'staff', 'Counseling', 'active');

-- The password for all demo accounts is: demo123
-- In a real system, these would be properly hashed passwords

-- You can also create additional users through the AuthManager.createUser() method
-- Example: AuthManager.createUser({
--   email: 'newuser@theforwardhorizon.com',
--   password: 'securepassword',
--   firstName: 'First',
--   lastName: 'Last',
--   role: 'staff',
--   department: 'Housing'
-- });

-- Create some demo CRM tasks
INSERT INTO crm_tasks (lead_id, assigned_to, task_type, title, description, priority, status, due_date, created_by) 
SELECT 
  l.id as lead_id,
  u.id as assigned_to,
  'call' as task_type,
  'Initial contact call' as title,
  'Call new lead to introduce Forward Horizon programs' as description,
  'high' as priority,
  'pending' as status,
  (NOW() + INTERVAL '2 hours') as due_date,
  u.id as created_by
FROM leads l 
CROSS JOIN user_accounts u 
WHERE u.role = 'staff' 
LIMIT 3;

-- Note: This assumes you have some leads in your leads table
-- If you don't have leads yet, you can create some test leads first