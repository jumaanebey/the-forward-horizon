# Forward Horizon Setup Guide

## Current Status
Forward Horizon is in **pre-opening phase** with accurate startup data (0 residents, $0 revenue).

## Data Storage Solutions

### 1. Google Calendar Integration

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Create a Service Account
5. Download the service account JSON file
6. Add the credentials to your `.env.local` file:

```env
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CALENDAR_ID=primary
```

**Features:**
- ✅ Real calendar integration
- ✅ Create events from dashboard
- ✅ Sync with Google Calendar
- ✅ Fallback to sample data if not configured

### 2. Database Storage (Supabase)

**Setup Steps:**
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Run the SQL from `lib/database-schema.sql` in the SQL editor
4. Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Database Schema Includes:**
- ✅ Residents management
- ✅ Staff management  
- ✅ Calendar events
- ✅ Payment tracking
- ✅ Incident reports
- ✅ Case notes
- ✅ Document storage
- ✅ Daily metrics
- ✅ Programs management

### 3. Current Data Storage (Temporary)

**Without Configuration:**
- Dashboard shows accurate startup status (0 residents, $0 revenue)
- Calendar shows sample setup reminder
- All data is realistic for pre-opening phase

## Features Status

### ✅ Working
- Dashboard with accurate startup metrics
- Analytics with realistic $0 revenue data
- Google Calendar API integration (when configured)
- Email system for marketing funnel
- Marketing landing pages
- Lead capture and notifications

### 🔄 Requires Setup
- Google Calendar (needs credentials)
- Database persistence (needs Supabase)
- Real resident/staff data entry

### 📋 Future Enhancements
- Automated reporting
- Payment processing
- Document management
- Mobile app

## Deployment
1. Configure environment variables in Vercel
2. Connect to your database
3. Set up Google Calendar credentials
4. Deploy and test

## Support
All systems show accurate pre-opening status until you're ready to add real operational data.