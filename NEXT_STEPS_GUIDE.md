# 🚀 Next Steps Guide - Getting Forward Horizon Live

## 📋 **Step-by-Step Configuration**

### **Step 1: Set Up Supabase Database (5 minutes)**

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose your organization
   - Enter project name: "forward-horizon"
   - Set database password (save this!)
   - Choose region (closest to your users)
   - Click "Create new project"

2. **Get API Keys**
   - In your project dashboard, go to Settings → API
   - Copy the "Project URL" and "anon public" key
   - Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Run Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy the contents of `supabase-production-setup.sql`
   - Paste and run the script
   - Verify all tables are created

### **Step 2: Set Up Stripe Payments (5 minutes)**

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up for a free account
   - Complete account verification

2. **Get API Keys**
   - In Stripe Dashboard, go to Developers → API keys
   - Copy "Publishable key" and "Secret key"
   - Update `.env.local`:
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
   STRIPE_SECRET_KEY=sk_test_your-secret-key
   ```

3. **Configure Webhooks**
   - In Stripe Dashboard, go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-domain.vercel.app/api/payments/webhook`
   - Events to send: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
   - Copy webhook secret and add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
   ```

### **Step 3: Set Up Gmail Email (5 minutes)**

1. **Enable 2-Factor Authentication**
   - Go to your Gmail account settings
   - Security → 2-Step Verification → Turn on

2. **Generate App Password**
   - Security → App passwords
   - Select app: "Mail"
   - Select device: "Other"
   - Enter name: "Forward Horizon"
   - Copy the generated password

3. **Update Environment**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   EMAIL_FROM=Forward Horizon <your-email@gmail.com>
   ```

### **Step 4: Generate Security Keys (2 minutes)**

1. **Generate JWT Secret**
   ```bash
   openssl rand -base64 32
   ```

2. **Generate Session Secret**
   ```bash
   openssl rand -base64 32
   ```

3. **Update Environment**
   ```env
   JWT_SECRET=your-generated-jwt-secret
   SESSION_SECRET=your-generated-session-secret
   ```

### **Step 5: Deploy to Vercel (5 minutes)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   ./scripts/deploy-phase1.sh
   ```

3. **Configure Environment Variables**
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add all variables from `.env.local`

### **Step 6: Test Everything (10 minutes)**

1. **Test Authentication**
   - Visit your deployed site
   - Try to register/login
   - Verify session management

2. **Test Payments**
   - Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

3. **Test Email**
   - Submit a contact form
   - Check if emails are sent
   - Verify email sequences

4. **Test API Endpoints**
   - Test all API routes
   - Verify error handling
   - Check performance

---

## 🔧 **Quick Setup Commands**

### **Generate Security Keys**
```bash
# Generate JWT and Session secrets
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "SESSION_SECRET=$(openssl rand -base64 32)"
```

### **Test Configuration**
```bash
# Run setup script to verify everything
./scripts/setup-phase1.sh
```

### **Deploy to Production**
```bash
# Deploy to Vercel
./scripts/deploy-phase1.sh
```

---

## 📊 **Configuration Checklist**

### **Supabase Setup**
- [ ] Project created
- [ ] API keys copied
- [ ] Database schema run
- [ ] Tables verified

### **Stripe Setup**
- [ ] Account created
- [ ] API keys copied
- [ ] Webhooks configured
- [ ] Test payments working

### **Gmail Setup**
- [ ] 2FA enabled
- [ ] App password generated
- [ ] Email credentials added
- [ ] Test emails sent

### **Security**
- [ ] JWT secret generated
- [ ] Session secret generated
- [ ] Environment variables set
- [ ] Production deployment ready

---

## 🎯 **Expected Results**

After completing these steps, you'll have:

- ✅ **Live website** at your Vercel domain
- ✅ **Real database** with Supabase
- ✅ **Payment processing** with Stripe
- ✅ **Email automation** with Gmail
- ✅ **Secure authentication** system
- ✅ **Professional API** infrastructure

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Errors**
   - Check environment variables are set
   - Verify all dependencies installed
   - Check for syntax errors

2. **Database Connection**
   - Verify Supabase URL and keys
   - Check if tables are created
   - Test database queries

3. **Payment Issues**
   - Verify Stripe API keys
   - Check webhook configuration
   - Test with Stripe test cards

4. **Email Problems**
   - Verify Gmail app password
   - Check 2FA is enabled
   - Test email sending

---

## 🎉 **Success Indicators**

- ✅ Website loads without errors
- ✅ User registration/login works
- ✅ Payments process successfully
- ✅ Emails send automatically
- ✅ API endpoints respond correctly
- ✅ Database operations work
- ✅ No console errors

---

**Ready to get started? Let's configure your environment step by step!** 🚀
