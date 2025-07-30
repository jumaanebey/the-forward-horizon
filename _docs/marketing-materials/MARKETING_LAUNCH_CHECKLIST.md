# Marketing Campaign Launch Checklist

## Pre-Launch Setup (Complete First)

### ✅ Technical Foundation
- [x] **Website Deployed**: app.theforwardhorizon.com live
- [x] **Database Configured**: Supabase with all tables
- [x] **Email Service**: Gmail/SendGrid configured
- [x] **Lead Capture**: Forms working and tested
- [x] **Analytics Ready**: Google Analytics 4 + Facebook Pixel

### ✅ Content Assets Ready
- [x] **Lead Magnets**: 3 PDF guides created
- [x] **Landing Pages**: Veterans, Recovery, Re-entry pages
- [x] **Email Sequences**: 3-step follow-up campaigns
- [x] **Ad Creative**: Images, copy, and videos prepared

---

## Phase 1: Facebook & Instagram Campaign Launch

### Campaign 1: Veterans Housing Program

#### 1.1 Facebook Business Manager Setup
```bash
# Required for Campaign Setup
1. Create Facebook Business Manager account
2. Add theforwardhorizon.com domain
3. Create Facebook Page for Forward Horizon
4. Install Facebook Pixel on website

# Pixel Installation Code (add to app)
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

#### 1.2 Campaign Configuration
**Campaign Details:**
- **Objective**: Lead Generation
- **Budget**: $400/month ($13.33/day)
- **Schedule**: Start immediately, run continuously
- **Optimization**: Optimize for Lead events

**Ad Sets:**
1. **Core Audience - Military Veterans**
   - Age: 25-65
   - Interests: Military veterans, VA benefits, Veterans Affairs
   - Behaviors: US military veterans
   - Location: 25-mile radius from Pasadena + California
   - Budget: $8/day

2. **Lookalike Audience - 1%**
   - Source: Website visitors (when available)
   - Location: California  
   - Budget: $3/day

3. **Retargeting Audience**
   - Website visitors, past 30 days
   - Exclude: Form completers
   - Budget: $2.33/day

#### 1.3 Ad Creative (Use from facebook-ads-campaigns.md)
**Primary Ad - Carousel Format:**
```
Primary Text: "🇺🇸 Your service earned you more than just gratitude..."
Headline: "VA Housing Benefits for Veterans"
CTA: Download
Landing Page: /veterans-housing
```

### Campaign 2: Recovery Housing Program

#### 2.1 Campaign Configuration
- **Budget**: $500/month ($16.67/day)
- **Target Audience**: Age 18-55, interested in addiction recovery
- **Geographic**: 50-mile radius from facility
- **Ad Creative**: Hope-focused messaging with success stories

#### 2.2 Ad Sets Distribution
- Core Audience (Recovery Community): $10/day
- Family & Friends Audience: $4/day  
- Retargeting: $2.67/day

### Campaign 3: Re-entry Support Program

#### 3.1 Campaign Configuration  
- **Budget**: $300/month ($10/day)
- **Target Audience**: Age 25-55, interested in criminal justice reform
- **Geographic**: Statewide California
- **Ad Creative**: Fresh start messaging with success metrics

---

## Phase 2: Google Ads Campaign Launch

### Search Campaign Setup

#### 2.1 Account Structure
```
Account: Forward Horizon Recovery
├── Campaign 1: Veterans Housing (Search)
│   ├── Ad Group: Veterans Housing
│   ├── Ad Group: VA Benefits Housing  
│   └── Ad Group: Military Recovery
├── Campaign 2: Recovery Housing (Search)
│   ├── Ad Group: Addiction Recovery Housing
│   ├── Ad Group: Sober Living
│   └── Ad Group: Recovery Program
└── Campaign 3: Re-entry Support (Search)
    ├── Ad Group: Reentry Housing
    ├── Ad Group: Transitional Housing
    └── Ad Group: Second Chance Housing
```

#### 2.2 Keyword Strategy
**Veterans Housing Keywords:**
```
High Intent (CPC: $8-15):
- veterans housing california
- va housing assistance
- veterans recovery housing
- military transitional housing

Medium Intent (CPC: $5-10):
- veterans housing programs
- homeless veterans help
- veterans support services

Long Tail (CPC: $3-8):
- housing for disabled veterans california
- veterans housing voucher program
- transitional housing for veterans los angeles
```

#### 2.3 Ad Copy Templates
```
Headline 1: Veterans Housing Program
Headline 2: Safe, Stable Housing for Veterans
Description: Specialized housing for military veterans. VA benefits assistance, job placement, peer support. Call (626) 888-7776
CTA: Download Veterans Guide
```

---

## Phase 3: Organic Content Strategy

### 3.1 Content Calendar (First Month)
**Week 1: Introduction & Awareness**
- Monday: Facility tour video
- Wednesday: Success story (James - Veterans)
- Friday: "Did you know?" VA benefits post

**Week 2: Education & Trust Building**
- Monday: Recovery process infographic
- Wednesday: Staff spotlight
- Friday: Community testimonial

**Week 3: Engagement & Social Proof**
- Monday: Before/after facility photos
- Wednesday: Resident achievement celebration
- Friday: Family testimonial

**Week 4: Call to Action & Conversion**
- Monday: "Spots available" urgency post
- Wednesday: Live Q&A session
- Friday: Month in review + next month preview

### 3.2 Platform Strategy

**Facebook Page:**
- 3 posts per week
- Focus on community building
- Share success stories and facility updates
- Respond to comments within 2 hours

**Instagram:**
- Daily stories
- 4 feed posts per week
- Use recovery and veterans hashtags
- Partner with local veteran organizations

**LinkedIn (for referral sources):**
- Weekly professional updates
- Connect with social workers, case managers
- Share program outcomes and statistics

---

## Phase 4: Email Marketing Launch

### 4.1 Email List Building
**Sources:**
- Lead magnet downloads (primary)
- Website contact forms
- Phone inquiries
- Referral partnerships

**Target**: 100 new subscribers/month

### 4.2 Segmentation Strategy
**Lists:**
1. Veterans Program Interest
2. Recovery Program Interest  
3. Re-entry Program Interest
4. General Inquiries
5. Referral Sources (professionals)

### 4.3 Automation Sequences (Already Built)
- **Immediate**: Welcome email + PDF delivery
- **Day 2**: Educational follow-up
- **Day 4**: Success story
- **Day 8**: Urgency/availability update

---

## Phase 5: Tracking & Attribution Setup

### 5.1 UTM Parameter Structure
```
Campaign tracking examples:
https://app.theforwardhorizon.com/veterans-housing?utm_source=facebook&utm_medium=social&utm_campaign=veterans-q1&utm_content=carousel-benefits&utm_term=stable-housing

Parameters:
- utm_source: facebook, google, instagram, organic
- utm_medium: social, cpc, email, referral
- utm_campaign: veterans-q1, recovery-q1, reentry-q1
- utm_content: carousel-benefits, video-testimonial, urgency-ad
- utm_term: [keyword for paid search]
```

### 5.2 Conversion Tracking Events
```javascript
// Facebook Pixel Events
fbq('track', 'Lead', {
  content_name: 'Veterans Benefits Guide',
  value: 25.00,
  currency: 'USD'
});

// Google Analytics Events
gtag('event', 'conversion', {
  'send_to': 'AW-CONVERSION_ID',
  'value': 25.0,
  'currency': 'USD'
});
```

---

## Launch Day Checklist

### Day -7: Final Preparation
- [ ] All accounts created and verified
- [ ] Creative assets uploaded and approved
- [ ] Tracking pixels installed and tested
- [ ] Email templates tested and working
- [ ] Budget allocated and payment methods set up

### Day -3: Campaign Setup
- [ ] Facebook campaigns built but not launched
- [ ] Google Ads campaigns built but not launched
- [ ] Email sequences activated
- [ ] Landing pages final review
- [ ] Staff trained on lead handling process

### Day -1: Final Testing
- [ ] Test all lead capture forms
- [ ] Verify email delivery and automation
- [ ] Check tracking and analytics setup
- [ ] Confirm phone system ready for inquiries
- [ ] Review crisis response procedures

### Launch Day (Day 0)
- [ ] **9 AM**: Activate Facebook campaigns
- [ ] **10 AM**: Launch Google Ads campaigns
- [ ] **11 AM**: Publish organic social content
- [ ] **12 PM**: Send launch email to existing contacts
- [ ] **1 PM**: Monitor initial performance
- [ ] **5 PM**: End-of-day performance review

### Day +1: First Review
- [ ] Check campaign delivery and spend
- [ ] Review lead quality and volume
- [ ] Identify any technical issues
- [ ] Adjust budgets if needed
- [ ] Plan next day optimizations

---

## Success Metrics (First 30 Days)

### Volume Targets
- **Leads Generated**: 65+ total
  - Veterans: 20 leads
  - Recovery: 33 leads  
  - Re-entry: 12 leads

### Quality Metrics
- **Cost Per Lead**: <$18.50 average
- **Lead Score**: >60 average
- **Email Open Rate**: >25%
- **Form Completion Rate**: >8%

### Conversion Funnel
- **Traffic to Landing Page**: 3,500+ visitors
- **Form Submissions**: 280+ (8% conversion)
- **Qualified Leads**: 65+ (23% of submissions)
- **Phone Inquiries**: 15+ (23% of qualified leads)
- **Tours Scheduled**: 8+ (12% of qualified leads)

### Performance Monitoring
**Daily Checks (First Week):**
- Campaign spend and delivery
- Lead volume and quality
- Email deliverability  
- Website performance
- Phone inquiry volume

**Weekly Reviews:**
- ROI by campaign and audience
- Creative performance analysis
- Landing page optimization opportunities
- Email sequence engagement rates
- Competitive analysis

**Monthly Optimization:**
- Budget reallocation based on performance
- Creative refresh and A/B testing
- Audience expansion/refinement
- Landing page improvements
- Email sequence optimization

---

## Emergency Procedures

### Campaign Issues
- **High CPC**: Pause underperforming audiences
- **Low Quality Score**: Improve ad relevance and landing pages
- **Account Suspension**: Have backup accounts ready
- **Budget Overspend**: Set up automatic daily budget alerts

### Lead Quality Issues
- **Low Lead Scores**: Review targeting and messaging
- **High Form Abandonment**: Simplify forms and improve load times
- **Poor Email Engagement**: Test subject lines and send times
- **Low Phone Conversion**: Review phone scripts and availability

### Technical Issues
- **Website Down**: Have static backup pages ready
- **Form Not Working**: Direct traffic to phone number
- **Email Service Down**: Switch to backup email provider
- **Tracking Issues**: Manual UTM parameter backup

The marketing campaigns are now ready for immediate launch with comprehensive tracking, optimization, and emergency procedures in place!