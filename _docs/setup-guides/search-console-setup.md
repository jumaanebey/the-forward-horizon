# Google Search Console Setup for Forward Horizon

## 🔍 **Step-by-Step Setup**

### **1. Go to Google Search Console**
- **URL**: [search.google.com/search-console](https://search.google.com/search-console)
- **Sign in** with your Google account

### **2. Add Your Property**
- **Click**: "Add property"
- **Enter**: `https://theforwardhorizon.com`
- **Click**: "Continue"

### **3. Verify Ownership**
- **Choose**: "HTML tag" method
- **Copy the verification code** (looks like: `<meta name="google-site-verification" content="ABC123..." />`)

### **4. Add Verification Code to Your Site**
- **Add this line** to your HTML `<head>` section:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

### **5. Submit Your Sitemap**
- **Go to**: Sitemaps section (left sidebar)
- **Add sitemap**: `https://theforwardhorizon.com/sitemap.xml`
- **Click**: "Submit"

### **6. Request Indexing**
- **Go to**: URL Inspection (left sidebar)
- **Enter**: `https://theforwardhorizon.com`
- **Click**: "Request Indexing"

## 📊 **What You'll Get**

✅ **Search Performance Data**
- How often your site appears in search results
- Which keywords bring visitors
- Click-through rates
- Search rankings

✅ **Indexing Status**
- Which pages are indexed
- Any indexing errors
- Mobile usability issues

✅ **Core Web Vitals**
- Page speed metrics
- User experience scores
- Performance recommendations

## 🎯 **Next Steps After Setup**

1. **Wait 24-48 hours** for data to appear
2. **Check for any errors** in the Coverage report
3. **Monitor search performance** regularly
4. **Submit new pages** for indexing as you add them

## 📈 **Expected Results**

- **Better search visibility**
- **Detailed performance insights**
- **SEO recommendations**
- **Mobile usability reports** 