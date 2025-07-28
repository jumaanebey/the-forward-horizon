# 🚀 Quick Supabase Setup for Forward Horizon

## Step 1: Create Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name: **forward-horizon-production**
4. Set database password (save this!)
5. Choose region closest to you
6. Click "Create new project"

## Step 2: Get Your Credentials
Once project is created:
1. Go to Settings → API
2. Copy these values:

```bash
Project URL: https://your-project-ref.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Update Environment Variables

### Local Development (.env.local):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Production (Vercel):
Add these same variables to your Vercel project settings.

## Step 4: Run Database Schema
1. In Supabase dashboard → SQL Editor
2. Copy the entire contents from `lib/database-schema.sql`
3. Paste and click "Run"
4. This creates all tables and initial data

## Step 5: Test Connection
Visit your deployed app and navigate to Housing Inventory - it should now show live data!

---

**The schema includes:**
- 🏠 **Houses & Rooms** (24 beds across 12 rooms)
- 👥 **Residents & Staff** management
- 📅 **Calendar & Events** scheduling
- 💰 **Payments & Analytics** tracking  
- 📋 **Waitlist & Lead** management
- 🔄 **Real-time updates** and triggers