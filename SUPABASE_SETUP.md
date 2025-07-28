# Supabase Database Setup for Forward Horizon

## Quick Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Choose a database password and wait for setup to complete

### 2. Get Your Project Credentials
1. Go to Project Settings → API
2. Copy your Project URL and anon public key
3. Update `.env.local` with your credentials:

```bash
# Replace these with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Database Schema
1. Go to your Supabase project → SQL Editor
2. Copy and paste the contents of `lib/database-schema.sql`
3. Click "Run" to create all tables and initial data

### 4. Verify Installation
The schema will create:
- **Houses table** with Forward Horizon Main House
- **Rooms table** with 12 rooms (24 total beds)
- **Initial staff member** (admin@theforwardhorizon.com)
- **Sample programs** in development status
- **All required indexes and triggers**

### 5. Test the Integration
After setup, the Housing Inventory will automatically switch from mock data to live Supabase data.

## Database Structure
- **houses**: Main housing facilities
- **rooms**: Individual rooms within houses
- **room_assignments**: Bed assignments to residents
- **waitlist**: Prospective residents waiting for availability
- **residents**: Current residents (when they are admitted)
- **staff**: Staff members and access control
- **calendar_events**: Scheduling and appointments
- **payments**: Rent and payment tracking
- **incidents**: Incident reporting and management

## Security Features
- Row Level Security (RLS) enabled on all sensitive tables
- Staff-based access control policies
- Automatic audit trails with updated_at timestamps
- UUID primary keys for enhanced security