# Email Service Setup for Forward Horizon

## Option 1: Gmail with App Passwords (Recommended for Start)

### Step 1: Gmail Account Setup
1. Use existing `notifications@theforwardhorizon.com` or create new Gmail account
2. Enable 2-Factor Authentication:
   - Go to Google Account Settings → Security
   - Turn on 2-Step Verification
   - Complete phone verification

### Step 2: Generate App Password
1. In Google Account Settings → Security
2. Click "App passwords" (only appears after 2FA enabled)
3. Select app: "Mail"
4. Select device: "Other (custom name)" → "Forward Horizon App"
5. Copy the 16-character password generated

### Step 3: Environment Variables for Vercel
```bash
EMAIL_USER=notifications@theforwardhorizon.com
EMAIL_PASS=your_16_character_app_password
NOTIFICATION_EMAIL=admin@theforwardhorizon.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Step 4: Test Email Configuration
```bash
# Test endpoint
POST https://app.theforwardhorizon.com/api/submit-form
{
  "firstName": "Test",
  "email": "test@example.com", 
  "formType": "veterans"
}
```

---

## Option 2: SendGrid (Recommended for Scale)

### Step 1: SendGrid Account Setup
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account (free tier: 100 emails/day)
3. Verify email address

### Step 2: Create API Key
1. In SendGrid Dashboard → Settings → API Keys
2. Click "Create API Key"
3. Name: "Forward Horizon App"
4. Permissions: "Full Access" (or restricted to Mail Send)
5. Copy API key (starts with `SG.`)

### Step 3: Domain Authentication (Optional but Recommended)
1. SendGrid Dashboard → Settings → Sender Authentication
2. Authenticate Domain: `theforwardhorizon.com`
3. Add DNS records provided by SendGrid
4. Verify domain authentication

### Step 4: Environment Variables for SendGrid
```bash
# Replace Gmail config with:
SENDGRID_API_KEY=SG.your_sendgrid_api_key
EMAIL_FROM=notifications@theforwardhorizon.com
NOTIFICATION_EMAIL=admin@theforwardhorizon.com
EMAIL_SERVICE=sendgrid
```

### Step 5: Update Code for SendGrid
Create new file: `src/lib/email-service.ts`
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM!,
    subject,
    text,
    html
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}
```

---

## Option 3: AWS SES (Enterprise Scale)

### Step 1: AWS SES Setup
1. AWS Console → Simple Email Service
2. Verify email addresses or domain
3. Request production access (removes sending limits)

### Step 2: Create IAM User
1. AWS IAM → Users → Create User
2. Attach policy: `AmazonSESFullAccess`
3. Create access keys

### Step 3: Environment Variables
```bash
AWS_SES_ACCESS_KEY_ID=your_access_key
AWS_SES_SECRET_ACCESS_KEY=your_secret_key
AWS_SES_REGION=us-east-1
EMAIL_FROM=notifications@theforwardhorizon.com
EMAIL_SERVICE=aws_ses
```

---

## Email Templates & Automation

### Lead Magnet Email Templates
Already configured in:
- `src/app/api/submit-form/route.ts` - Immediate delivery
- `src/app/api/email-sequences/route.ts` - Follow-up sequences

### Email Sequence Timing
```javascript
// Veterans sequence
Day 1: Veterans Benefits Guide (immediate)
Day 2: VA Benefits Optimization tips
Day 4: Success story (James's story)
Day 8: Last call with urgency

// Recovery sequence  
Day 1: Recovery Housing Guide (immediate)
Day 2: Day-by-day success tips
Day 4: Success story (Maria's story)
Day 8: Bed availability notice

// Re-entry sequence
Day 1: Life After Release Kit (immediate)
Day 2: 72-hour action plan
Day 4: Success story (David's story) 
Day 8: Program openings
```

### Automation Setup
For production email automation, consider:
1. **Zapier Integration**: Connect form submissions to email sequences
2. **Cron Jobs**: Set up scheduled email sending
3. **Queue System**: Use Redis/Bull for email queue management

---

## Email Deliverability Best Practices

### 1. Authentication Setup
```dns
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com include:sendgrid.net ~all

# DKIM (provided by email service)
Type: CNAME  
Name: s1._domainkey
Value: s1.domainkey.sendgrid.net

# DMARC
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@theforwardhorizon.com
```

### 2. Content Guidelines
- **Subject Lines**: Clear, no spam trigger words
- **From Name**: "Forward Horizon Team" or staff member names
- **Reply-To**: Set to monitored email address
- **Unsubscribe**: Include unsubscribe link (legal requirement)

### 3. List Management
- **Double Opt-in**: Consider for better engagement
- **Segmentation**: Separate lists by program interest
- **Suppression**: Honor unsubscribes immediately
- **Bounce Handling**: Remove invalid email addresses

---

## Monitoring & Analytics

### Email Metrics to Track
- **Delivery Rate**: >98%
- **Open Rate**: >20% (industry average: 15-20%)
- **Click Rate**: >3% (industry average: 2-3%)
- **Conversion Rate**: >8% form completion
- **Unsubscribe Rate**: <0.5%

### Tools for Monitoring
1. **SendGrid Analytics**: Built-in email metrics
2. **Google Analytics**: Track email campaign UTM parameters
3. **Webhook Integration**: Real-time delivery status
4. **Error Monitoring**: Log email failures in Vercel

---

## Testing Checklist

### Pre-Launch Email Tests
- [ ] **Form Submission**: Test all three lead magnets
- [ ] **Email Delivery**: Verify emails arrive in inbox (not spam)
- [ ] **Links Work**: All CTA buttons and links functional
- [ ] **Mobile Display**: Emails render correctly on mobile
- [ ] **Personalization**: First name appears correctly
- [ ] **Attachments**: PDF guides attach properly

### Spam Test
- [ ] **Subject Line**: Check spam score with tools
- [ ] **Content**: Avoid spam trigger words
- [ ] **Authentication**: SPF/DKIM/DMARC configured
- [ ] **Images**: Include alt text, don't use image-only emails
- [ ] **Links**: Use reputable domains only

### Sequence Testing
- [ ] **Timing**: Verify delay between emails
- [ ] **Content**: Check each email in sequence
- [ ] **Unsubscribe**: Test opt-out functionality
- [ ] **Tracking**: Confirm open/click tracking works

---

## Emergency Procedures

### Email Service Down
1. **Check Status**: Gmail/SendGrid status page
2. **Switch Service**: Have backup email service configured
3. **Manual Sending**: Use direct email as backup
4. **Customer Notice**: Update website if prolonged outage

### High Bounce Rate
1. **Check Lists**: Remove invalid emails immediately
2. **Authentication**: Verify SPF/DKIM records
3. **Content Review**: Check for spam triggers
4. **Service Check**: Contact email provider

### Spam Complaints
1. **Immediate Review**: Check recent campaigns
2. **List Audit**: Review email acquisition methods
3. **Content Audit**: Remove problematic content
4. **Suppression**: Add complainers to suppression list

The email system is now configured for immediate lead generation and long-term customer nurturing!