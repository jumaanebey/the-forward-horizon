# 🗄️ Supabase Setup Guide (FREE)

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. **No credit card required** - completely free!

## Step 2: Create New Project
1. Click "New Project"
2. Fill in the details:
   - **Name**: `forward-horizon`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (US East, US West, etc.)
3. Click "Create new project"
4. Wait 2-3 minutes for setup

## Step 3: Get Your API Keys
1. Once project is ready, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## Step 4: Update Your .env.local
Open your `.env.local` file and replace these lines:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Set Up Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-production-setup.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute

## Step 6: Verify Setup
1. Go to **Table Editor**
2. You should see these tables:
   - `user_accounts`
   - `houses`
   - `rooms`
   - `residents`
   - `payments`
   - And more...

## ✅ Success Indicators
- ✅ Project created successfully
- ✅ API keys copied to `.env.local`
- ✅ Database schema executed
- ✅ Tables visible in Table Editor

## 🆓 Free Tier Limits
- **Database**: 500MB (plenty for starting)
- **Users**: 50,000 monthly active users
- **Bandwidth**: 2GB
- **Storage**: 1GB

## 🚨 Important Notes
- **Save your database password** - you'll need it for admin access
- **Keep API keys secure** - never commit them to Git
- **Free tier is generous** - you won't hit limits for months

## 📞 Need Help?
- Supabase has excellent documentation
- Community Discord is very helpful
- You can always ask me for guidance!

---

**Ready for the next step? Let's set up Stripe next!** 💳
