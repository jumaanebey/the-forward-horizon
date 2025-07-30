# Custom Domain Setup for Forward Horizon

## Overview
Set up a custom subdomain for the management dashboard while keeping the main marketing site at theforwardhorizon.com.

## Recommended Domain Structure

### Primary Domain: theforwardhorizon.com
- **Purpose:** Marketing website, lead generation, public information
- **Platform:** WordPress/static site optimized for conversions
- **Content:** Program information, testimonials, contact forms

### Management Subdomain: app.theforwardhorizon.com
- **Purpose:** Management dashboard, CRM, housing inventory
- **Platform:** Next.js application (this repo)
- **Access:** Staff, managers, admins only

### Alternative Subdomain Options:
- `manage.theforwardhorizon.com`
- `portal.theforwardhorizon.com`
- `dashboard.theforwardhorizon.com`

## Vercel Deployment Configuration

### 1. Add Custom Domain in Vercel Dashboard
```bash
# In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add domain: app.theforwardhorizon.com
3. Vercel will provide DNS records to configure
```

### 2. DNS Configuration
Add these records to your DNS provider:

```dns
# CNAME Record for subdomain
Type: CNAME
Name: app
Value: cname.vercel-dns.com

# Or A Records if CNAME not supported
Type: A
Name: app
Value: 76.76.19.61

Type: A  
Name: app
Value: 76.223.126.88
```

### 3. SSL Certificate
Vercel automatically provisions SSL certificates for custom domains.

## Environment Variables for Production

### Required Environment Variables:
```env
# Database Configuration
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration
EMAIL_USER=notifications@theforwardhorizon.com
EMAIL_PASS=your_app_password
NOTIFICATION_EMAIL=admin@theforwardhorizon.com

# Authentication
JWT_SECRET=your_secure_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://app.theforwardhorizon.com

# Marketing Integration
FACEBOOK_PIXEL_ID=your_facebook_pixel_id
GOOGLE_ANALYTICS_ID=your_google_analytics_id
GOOGLE_ADS_CONVERSION_ID=your_google_ads_conversion_id

# External API Keys
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+16268887776

# Security
CORS_ORIGIN=https://theforwardhorizon.com
```

## Security Configuration

### 1. Update CORS Settings
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://theforwardhorizon.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          }
        ]
      }
    ]
  }
}
```

### 2. Authentication Redirect Configuration
```typescript
// Update authentication to redirect properly
const ALLOWED_DOMAINS = [
  'https://app.theforwardhorizon.com',
  'https://theforwardhorizon.com'
];
```

## Marketing Integration

### 1. Cross-Domain Lead Capture
```javascript
// On main site (theforwardhorizon.com)
async function submitLeadForm(formData) {
  const response = await fetch('https://app.theforwardhorizon.com/api/submit-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  });
  
  return response.json();
}
```

### 2. Tracking Integration
```javascript
// Facebook Pixel on both domains
fbq('init', 'YOUR_PIXEL_ID');

// Track cross-domain conversions
fbq('track', 'Lead', {
  content_name: formType,
  source_url: window.location.hostname
});
```

## Deployment Steps

### 1. Pre-Deployment Checklist
- [ ] Environment variables configured in Vercel
- [ ] DNS records added and propagated
- [ ] SSL certificate verified
- [ ] Database migrations run
- [ ] Email service configured

### 2. Deployment Commands
```bash
# Build and deploy to production
npm run build
vercel --prod

# Verify deployment
curl -I https://app.theforwardhorizon.com
```

### 3. Post-Deployment Testing
- [ ] Public dashboard loads correctly
- [ ] Staff login works with demo credentials
- [ ] Management dashboard accessible
- [ ] Lead form submissions work
- [ ] Email notifications sent
- [ ] Database connections established

## Monitoring and Analytics

### 1. Error Monitoring
```javascript
// Sentry configuration for production
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 2. Performance Monitoring
```javascript
// Web Vitals tracking
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
    });
  }
}
```

### 3. Uptime Monitoring
Set up monitoring for:
- `https://app.theforwardhorizon.com/api/health`
- Dashboard login functionality
- Database connectivity
- Email service status

## Backup and Recovery

### 1. Database Backups
```sql
-- Daily automated backups via Supabase
-- Point-in-time recovery available
-- Export lead data weekly
```

### 2. Application Backups
```bash
# Automated GitHub backups
# Vercel deployment rollback capability
# Environment variable backups
```

## Maintenance Schedule

### Daily:
- Monitor error rates
- Check email delivery
- Verify lead submissions

### Weekly:
- Review performance metrics
- Update content as needed
- Test backup systems

### Monthly:
- Security audit
- Performance optimization
- Feature updates

## Support and Documentation

### Admin Access:
- **Dashboard:** https://app.theforwardhorizon.com
- **Login:** admin@theforwardhorizon.com / admin123
- **Documentation:** This repository's README

### Technical Support:
- Monitor via Vercel dashboard
- Error tracking via Sentry
- Performance via Vercel Analytics

## Cost Estimation

### Monthly Costs:
- Vercel Pro Plan: $20/month
- Supabase Pro Plan: $25/month
- Email Service: $10/month
- Monitoring: $15/month
- **Total:** ~$70/month

This setup provides a professional, scalable solution for the Forward Horizon management system while maintaining security and performance standards.