# 📧 Gmail Setup Guide (FREE)

## Step 1: Enable 2-Factor Authentication
1. **Go to**: https://myaccount.google.com/security
2. **Find "2-Step Verification"**
3. **Click "Get started"**
4. **Follow the setup process**
5. **Verify with your phone**

## Step 2: Generate App Password
1. **Go to**: https://myaccount.google.com/apppasswords
2. **Select app**: "Mail"
3. **Select device**: "Other (Custom name)"
4. **Enter name**: "Forward Horizon"
5. **Click "Generate"**
6. **Copy the 16-character password** (no spaces)

## Step 3: Update Your .env.local
Add these to your `.env.local` file:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=Forward Horizon <your-email@gmail.com>
```

## Step 4: Test Email Sending
1. **Start your development server**: `npm run dev`
2. **Go to**: http://localhost:3000/admin/email-sequences
3. **Test sending an email**

## ✅ Success Indicators
- ✅ 2FA enabled on Gmail
- ✅ App password generated
- ✅ Email credentials in `.env.local`
- ✅ Test email sent successfully

## 🆓 Free Tier Limits
- **Daily limit**: 500 emails/day
- **No monthly fees**
- **Professional email delivery**
- **Spam protection**

## 🚨 Important Notes
- **Use app password** (not your regular Gmail password)
- **Keep app password secure**
- **500 emails/day limit** for regular accounts
- **Consider Gmail Workspace** for higher limits

## 📞 Need Help?
- Gmail has excellent security features
- App passwords are more secure than regular passwords
- You can always ask me for guidance!

---

**Ready for the final step? Let's deploy to production!** 🚀
