# 🔐 Secure Email Setup Guide

## ✅ GOOD NEWS: Your credentials are already protected!

Your `.env.local` file is properly ignored by Git and not exposed on GitHub.

## 📧 Email Setup Instructions

### Step 1: Gmail App Password Setup
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Click **Security** → **2-Step Verification**
3. Enable 2FA if not already enabled
4. Scroll down to **App passwords**
5. Generate new app password for "Mail"
6. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

### Step 2: Update Your Local Environment
Edit your `.env.local` file (LOCALLY ONLY - never commit this):

```bash
# Replace with your actual values
EMAIL_USER=theforwardhorizon@gmail.com
EMAIL_PASS=your-16-character-app-password
NOTIFICATION_EMAIL=admin@theforwardhorizon.com

# Optional: Add analytics IDs when ready
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_FB_PIXEL_ID=your-facebook-pixel-id
```

### Step 3: Test Your Setup
```bash
npm run dev
```

Visit your landing pages and test the forms:
- http://localhost:3003/veterans-housing
- http://localhost:3003/recovery-housing
- http://localhost:3003/reentry-support

### Step 4: Verify Email Delivery
1. Fill out a form with your email
2. Check if you receive the PDF guide
3. Check if you receive the lead notification

## 🚀 Production Deployment

### For Vercel Deployment:
```bash
# Deploy with environment variables
vercel --prod

# Then add environment variables in Vercel dashboard:
# Project Settings → Environment Variables
```

Add these variables in Vercel:
- `EMAIL_USER`
- `EMAIL_PASS` 
- `NOTIFICATION_EMAIL`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_FB_PIXEL_ID`

## 🛡️ Security Best Practices

### ✅ DO:
- Keep `.env.local` on your local machine only
- Use environment variables for production
- Regularly rotate app passwords
- Monitor your email for suspicious activity

### ❌ DON'T:
- Never commit `.env.local` to Git
- Never share credentials in chat/forums
- Never use your main Gmail password
- Never store credentials in code comments

## 🎯 Current Status

✅ **Git security:** `.env.local` properly ignored  
✅ **File structure:** Secure environment setup  
✅ **Marketing funnel:** Complete and ready to test  
✅ **Email system:** Ready for credentials  

## 📞 Support

If you need help:
1. Test locally first
2. Check email spam folders
3. Verify Gmail app password is correct
4. Ensure 2FA is enabled on Gmail account

Your marketing funnel is secure and ready to generate leads!