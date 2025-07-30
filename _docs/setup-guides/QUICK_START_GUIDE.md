# Forward Horizon Quick Start Guide

## 🚀 Ready to Launch in 4 Steps

### Step 1: Deploy to Vercel (15 minutes)
```bash
# 1. Go to vercel.com and connect GitHub
# 2. Import this repository: forward-horizon-app
# 3. Add these environment variables in Vercel Dashboard:

NEXTAUTH_SECRET=generate_32_char_random_string
NEXTAUTH_URL=https://app.theforwardhorizon.com
NODE_ENV=production

# 4. Deploy and get temporary URL (e.g., forward-horizon-app.vercel.app)
```

### Step 2: Set Up Database (10 minutes)
```bash
# 1. Go to supabase.com and create project
# 2. Copy/paste entire contents of supabase-production-setup.sql
# 3. Run in Supabase SQL Editor
# 4. Add to Vercel environment variables:

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Configure Email (5 minutes)
```bash
# 1. Set up Gmail App Password (see EMAIL_SERVICE_SETUP.md)
# 2. Add to Vercel environment variables:

EMAIL_USER=notifications@theforwardhorizon.com
EMAIL_PASS=your-16-char-app-password
NOTIFICATION_EMAIL=admin@theforwardhorizon.com
```

### Step 4: Add Custom Domain (10 minutes)
```bash
# 1. In Vercel Dashboard → Domains
# 2. Add: app.theforwardhorizon.com
# 3. Add DNS CNAME record:
#    Name: app
#    Value: cname.vercel-dns.com
# 4. Wait for DNS propagation (5-30 minutes)
```

## ✅ System Status Check

After completing steps above, verify:
- [ ] **Dashboard**: https://app.theforwardhorizon.com loads
- [ ] **Login**: admin@theforwardhorizon.com / admin123 works
- [ ] **Database**: Housing inventory shows 24 beds
- [ ] **Forms**: Submit test lead form and receive email
- [ ] **API**: https://app.theforwardhorizon.com/api/health returns 200

## 🎯 Immediate Marketing Launch

### Day 1: Facebook/Instagram Ads
```bash
# 1. Create Facebook Business Manager account
# 2. Use campaigns from facebook-ads-campaigns.md
# 3. Budget: $1,200/month total
#    - Veterans: $400/month
#    - Recovery: $500/month  
#    - Re-entry: $300/month
```

### Day 1: Email Automation
```bash
# Email sequences are already built and ready
# Test by submitting forms at:
# - /veterans-housing
# - /recovery-housing  
# - /reentry-support
```

## 📊 Performance Tracking

### Week 1 Targets
- **Leads**: 15+ total
- **Cost Per Lead**: <$25
- **Email Open Rate**: >20%
- **Dashboard Logins**: Daily staff usage

### Month 1 Targets  
- **Total Leads**: 65+
- **Cost Per Lead**: <$18.50
- **Tours Scheduled**: 8+
- **System Uptime**: >99%

## 🛠️ Daily Operations

### Staff Login Process
1. Go to https://app.theforwardhorizon.com
2. Click "Management" button
3. Login: admin@theforwardhorizon.com / admin123
4. Access full CRM and housing management

### Lead Management Workflow
1. **New Lead Arrives**: Automatic email to admin@theforwardhorizon.com
2. **Lead Scoring**: System calculates priority (0-100)
3. **Task Creation**: Automatic follow-up tasks assigned
4. **Communication Tracking**: Log all calls/emails in CRM
5. **Status Updates**: Track from lead → tour → admission

### Housing Management
- **Bed Availability**: Real-time tracking of 24 beds
- **Room Assignments**: Assign residents to specific rooms/beds
- **Waitlist Management**: Priority scoring and scheduling
- **Maintenance Tracking**: Request and completion status

## 📱 Mobile Access

The dashboard is fully mobile-responsive:
- **Staff**: Can access management dashboard on phones/tablets
- **Admins**: Full functionality on mobile devices
- **Public**: Lead capture forms optimized for mobile

## 🔧 Troubleshooting

### Website Won't Load
1. Check Vercel deployment status
2. Verify DNS records are correct
3. Try temporary Vercel URL

### Login Issues
1. Confirm using: admin@theforwardhorizon.com / admin123
2. Clear browser cache and cookies
3. Try incognito/private browsing mode

### Email Not Working
1. Check Gmail app password is correct
2. Verify EMAIL_USER and EMAIL_PASS in Vercel
3. Test with /api/health endpoint

### Database Connection Issues
1. Verify Supabase project is active
2. Check SUPABASE_URL and SUPABASE_ANON_KEY
3. Confirm database schema was run successfully

## 📞 Support Resources

### Technical Support
- **Vercel Dashboard**: Monitor deployments and logs
- **Supabase Dashboard**: Database management and logs  
- **Email Service**: Check Gmail/SendGrid delivery reports

### Documentation
- **Complete Setup**: DEPLOYMENT_INSTRUCTIONS.md
- **Marketing Launch**: MARKETING_LAUNCH_CHECKLIST.md
- **Email Configuration**: EMAIL_SERVICE_SETUP.md
- **Database Schema**: supabase-production-setup.sql

### Business Operations
- **Lead Tracking**: Built-in CRM with automatic follow-ups
- **Housing Management**: Real-time bed availability
- **Analytics**: Comprehensive reporting dashboard
- **Marketing**: Ready-to-launch Facebook/Google campaigns

## 🎉 You're Ready to Launch!

The Forward Horizon Management System is production-ready with:
- ✅ **Complete CRM System**
- ✅ **Housing Inventory Management** 
- ✅ **Lead Generation & Email Automation**
- ✅ **Role-Based Dashboard**
- ✅ **Marketing Campaign Assets**
- ✅ **Real-Time Analytics**

**Total Setup Time**: ~40 minutes
**Monthly Operating Cost**: ~$70 (Vercel + Supabase + Email)
**Expected Lead Volume**: 65+ leads/month at <$18.50 per lead

Forward Horizon is now ready to serve veterans, individuals in recovery, and those re-entering society with a professional, scalable management platform!