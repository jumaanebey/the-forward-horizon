# Forward Horizon Deployment Instructions

## Step 1: Vercel Deployment

### 1.1 Connect GitHub Repository to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" 
3. Import from GitHub: `forward-horizon-app`
4. Configure project settings:
   - Framework Preset: **Next.js**
   - Root Directory: `.` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

### 1.2 Add Custom Domain
1. In Vercel Dashboard → Project Settings → Domains
2. Add domain: `app.theforwardhorizon.com`
3. Configure DNS (see DNS section below)

### 1.3 Environment Variables
Copy these variables to Vercel Dashboard → Settings → Environment Variables:

```bash
# Required immediately for basic functionality
NEXTAUTH_SECRET=generate_secure_32_char_string
NEXTAUTH_URL=https://app.theforwardhorizon.com
NODE_ENV=production

# Database (Step 2)
SUPABASE_URL=https://your_project_id.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Email (Step 3) 
EMAIL_USER=notifications@theforwardhorizon.com
EMAIL_PASS=your_gmail_app_password
NOTIFICATION_EMAIL=admin@theforwardhorizon.com
```

### 1.4 Deploy
1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete (~2-3 minutes)
3. Test at temporary Vercel URL first

---

## Step 2: Supabase Database Setup

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project:
   - Name: `forward-horizon-app`
   - Region: `US East (North Virginia)`
   - Database Password: Generate strong password

### 2.2 Run Database Schema
1. In Supabase Dashboard → SQL Editor
2. Copy contents of `lib/database-schema.sql`
3. Execute the entire schema
4. Verify tables are created (should see 13 tables)

### 2.3 Configure Environment Variables
1. In Supabase Dashboard → Settings → API
2. Copy these values to Vercel:
   ```bash
   SUPABASE_URL=https://your_project_id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### 2.4 Test Database Connection
1. Redeploy in Vercel after adding env vars
2. Visit `https://app.theforwardhorizon.com/api/health`
3. Should return database connection status

---

## Step 3: Email Service Configuration

### 3.1 Gmail App Password Setup
1. Enable 2-Factor Authentication on Gmail account
2. Go to Google Account Settings → Security
3. Generate App Password for "Mail"
4. Use this password (not regular Gmail password)

### 3.2 Configure Email Variables
```bash
EMAIL_USER=notifications@theforwardhorizon.com
EMAIL_PASS=your_16_char_app_password
NOTIFICATION_EMAIL=admin@theforwardhorizon.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### 3.3 Test Email Service
1. Visit dashboard and submit test form
2. Check if emails are received
3. Verify email sequences work

---

## Step 4: DNS Configuration

### 4.1 Add DNS Records
In your domain provider (GoDaddy, Namecheap, etc.), add:

```dns
# CNAME for subdomain
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 3600

# Or use A records if CNAME not supported:
Type: A
Name: app  
Value: 76.76.19.61
TTL: 3600

Type: A
Name: app
Value: 76.223.126.88  
TTL: 3600
```

### 4.2 Verify Domain
1. Wait for DNS propagation (5-30 minutes)
2. In Vercel → Domains, verify domain shows "Valid Configuration"
3. SSL certificate will auto-provision

---

## Step 5: Marketing Campaign Launch

### 5.1 Facebook/Instagram Ads
1. Review `facebook-ads-campaigns.md`
2. Set up Facebook Business Manager
3. Add Facebook Pixel ID to environment variables:
   ```bash
   FACEBOOK_PIXEL_ID=your_pixel_id
   ```

### 5.2 Google Ads Setup
1. Review `google-ads-campaigns.md`
2. Set up Google Ads account
3. Add conversion tracking:
   ```bash
   GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX
   ```

### 5.3 Analytics Setup
```bash
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## Step 6: Testing & Launch Checklist

### 6.1 Core Functionality Test
- [ ] Main page loads at app.theforwardhorizon.com
- [ ] Public dashboard displays correctly
- [ ] Admin login works (admin@theforwardhorizon.com / admin123)
- [ ] Management dashboard accessible
- [ ] Housing inventory displays 24 beds

### 6.2 Lead Generation Test
- [ ] Form submission works
- [ ] Email notifications sent
- [ ] Lead appears in CRM dashboard
- [ ] Automatic tasks created

### 6.3 System Performance
- [ ] Page load time < 3 seconds
- [ ] Mobile responsive design
- [ ] SSL certificate active
- [ ] API endpoints respond correctly

### 6.4 Security Verification
- [ ] Admin credentials work
- [ ] Role-based access functioning
- [ ] CORS headers configured
- [ ] Environment variables secure

---

## Step 7: Go-Live Process

### 7.1 Final Pre-Launch
1. **Database**: Confirm all tables and data
2. **Email**: Send test emails to verify delivery
3. **Authentication**: Test all user roles
4. **Monitoring**: Set up error tracking

### 7.2 Launch Day
1. **Marketing**: Activate ad campaigns
2. **Team Training**: Brief staff on login process
3. **Monitoring**: Watch for errors in Vercel dashboard
4. **Support**: Monitor email/phone for inquiries

### 7.3 Post-Launch (Week 1)
1. **Performance**: Monitor response times
2. **Conversions**: Track lead generation metrics
3. **Issues**: Address any bugs immediately
4. **Optimization**: Adjust ad campaigns based on data

---

## Emergency Contacts & Support

### Technical Issues
- **Vercel Dashboard**: [vercel.com](https://vercel.com) → Project Dashboard
- **Supabase Dashboard**: [supabase.com](https://supabase.com) → Project Dashboard
- **Error Monitoring**: Check Vercel Functions logs

### Quick Fixes
- **Site Down**: Check Vercel deployment status
- **Database Issues**: Check Supabase project status
- **Email Problems**: Verify Gmail app password
- **Form Not Working**: Check API endpoint in Network tab

### Rollback Plan
1. In Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "Promote to Production"
4. Site will rollback within 30 seconds

---

## Success Metrics (First 30 Days)

### Technical Performance
- **Uptime**: >99.5%
- **Page Load**: <3 seconds
- **API Response**: <500ms average

### Business Metrics
- **Lead Generation**: 65+ leads/month target
- **Conversion Rate**: 8%+ form completion
- **Cost Per Lead**: <$18.50 average

### User Engagement
- **Return Visitors**: 25%+
- **Session Duration**: 3+ minutes average
- **Pages Per Session**: 2.5+ average

The Forward Horizon Management System is now ready for full production deployment and operation!