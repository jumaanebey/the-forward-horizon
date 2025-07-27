# Forward Horizon - Analytics & SEO Setup Guide

## 📊 **Google Analytics Setup**

### **Step 1: Create Google Analytics Account**
1. **Go to**: [analytics.google.com](https://analytics.google.com)
2. **Click**: "Start measuring"
3. **Account Setup**:
   - Account name: `Forward Horizon`
   - Data sharing settings: Choose your preferences
4. **Property Setup**:
   - Property name: `theforwardhorizon.com`
   - Reporting time zone: Your timezone
   - Currency: USD
5. **Business Details**:
   - Industry category: `Non-profit`
   - Business size: `Small business`
   - Business objectives: Select relevant options

### **Step 2: Get Tracking Code**
1. **Choose platform**: Web
2. **Website URL**: `https://theforwardhorizon.com`
3. **Stream name**: `Forward Horizon Website`
4. **Copy the tracking code** (G-XXXXXXXXXX)

### **Step 3: Add to Your Website**
Add this code to your HTML `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔍 **Google Search Console Setup**

### **Step 1: Add Your Property**
1. **Go to**: [search.google.com/search-console](https://search.google.com/search-console)
2. **Add property**: `https://theforwardhorizon.com`
3. **Verify ownership**: Choose HTML tag method
4. **Copy the verification code**

### **Step 2: Verify Ownership**
Add this meta tag to your HTML `<head>`:

```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

### **Step 3: Submit Sitemap**
1. **Go to**: Sitemaps section
2. **Add sitemap**: `https://theforwardhorizon.com/sitemap.xml`
3. **Submit for indexing**

---

## 📱 **Social Media Meta Tags**

### **Add to Your HTML `<head>`:**

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://theforwardhorizon.com/">
<meta property="og:title" content="Forward Horizon - Transitional Housing">
<meta property="og:description" content="Structured transitional housing for veterans, individuals in recovery, and returning citizens. Rebuilding lives through accountability, community, and fresh starts.">
<meta property="og:image" content="https://theforwardhorizon.com/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://theforwardhorizon.com/">
<meta property="twitter:title" content="Forward Horizon - Transitional Housing">
<meta property="twitter:description" content="Structured transitional housing for veterans, individuals in recovery, and returning citizens.">
<meta property="twitter:image" content="https://theforwardhorizon.com/twitter-image.jpg">

<!-- Additional SEO -->
<meta name="keywords" content="transitional housing, veterans housing, sober living, re-entry housing, returning citizens, recovery housing, veteran support, post-incarceration housing">
<meta name="author" content="Forward Horizon">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://theforwardhorizon.com/">
```

---

## 📈 **Performance Monitoring**

### **Google PageSpeed Insights**
1. **Go to**: [pagespeed.web.dev](https://pagespeed.web.dev)
2. **Enter URL**: `https://theforwardhorizon.com`
3. **Run audit** for mobile and desktop
4. **Implement recommendations**

### **Core Web Vitals Monitoring**
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

---

## 🔔 **Uptime Monitoring**

### **Free Options:**
1. **UptimeRobot**: [uptimerobot.com](https://uptimerobot.com)
2. **StatusCake**: [statuscake.com](https://statuscake.com)
3. **Pingdom**: [pingdom.com](https://pingdom.com)

### **Setup Steps:**
1. **Create account**
2. **Add monitor**: `https://theforwardhorizon.com`
3. **Set check interval**: 5 minutes
4. **Add email alerts**

---

## 📊 **Conversion Tracking**

### **Goal Setup in Google Analytics:**
1. **Application submissions**
2. **Contact form completions**
3. **Resource downloads**
4. **Page views for key pages**

### **Event Tracking:**
```javascript
// Track application form submissions
gtag('event', 'form_submit', {
  'form_name': 'application_form',
  'page_location': '/application.html'
});

// Track phone number clicks
gtag('event', 'phone_click', {
  'phone_number': '+1-XXX-XXX-XXXX'
});
```

---

## 🎯 **SEO Best Practices**

### **Page Titles:**
- Home: "Forward Horizon - Transitional Housing for Veterans & Recovery"
- Application: "Apply for Housing - Forward Horizon"
- Resources: "Resources & Support - Forward Horizon"

### **Meta Descriptions:**
- Keep under 160 characters
- Include primary keywords
- Include call-to-action

### **Header Structure:**
- H1: Main page title
- H2: Section headings
- H3: Subsection headings

---

## 📱 **Mobile Optimization**

### **Mobile-First Design:**
- Responsive design
- Touch-friendly buttons
- Fast loading times
- Easy navigation

### **PWA Features:**
- Installable on mobile
- Offline functionality
- Push notifications (optional)

---

## 🔍 **Local SEO (if applicable)**

### **Google My Business:**
1. **Create listing** for Forward Horizon
2. **Add photos** and descriptions
3. **Collect reviews**
4. **Post updates** regularly

### **Local Citations:**
- Yelp
- Yellow Pages
- Local directories
- Chamber of Commerce

---

## 📊 **Reporting & Insights**

### **Monthly Reports:**
- Website traffic
- Top pages
- Traffic sources
- Conversion rates
- Search rankings

### **Key Metrics to Track:**
- Unique visitors
- Page views
- Bounce rate
- Average session duration
- Goal completions

---

## 🚀 **Implementation Checklist**

- [ ] Google Analytics setup
- [ ] Google Search Console verification
- [ ] Social media meta tags
- [ ] Uptime monitoring
- [ ] Performance optimization
- [ ] Conversion tracking
- [ ] Local SEO (if applicable)
- [ ] Regular reporting setup 