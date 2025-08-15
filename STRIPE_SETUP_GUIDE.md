# 💳 Stripe Setup Guide (FREE to start)

## Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Click "Start now" or "Sign up"
3. Fill in your business details:
   - **Business name**: Forward Horizon
   - **Business type**: Non-profit / Housing
   - **Country**: United States
   - **Email**: Your email
4. **No credit card required** for setup
5. Complete email verification

## Step 2: Get Your API Keys
1. **Go to Dashboard** → **Developers** → **API keys**
2. **Copy these keys**:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

## Step 3: Set Up Webhooks
1. **Go to Dashboard** → **Developers** → **Webhooks**
2. **Click "Add endpoint"**
3. **Endpoint URL**: `https://your-domain.vercel.app/api/payments/webhook`
   - (We'll update this with your actual domain later)
4. **Events to send**:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `payment_intent.canceled`
5. **Click "Add endpoint"**
6. **Copy the webhook secret** (starts with `whsec_...`)

## Step 4: Update Your .env.local
Add these to your `.env.local` file:

```env
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_your-secret-key-here
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

## Step 5: Test the Integration
1. **Go to Dashboard** → **Payments** → **Test mode**
2. **Use test card numbers**:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits

## ✅ Success Indicators
- ✅ Stripe account created
- ✅ API keys copied to `.env.local`
- ✅ Webhook endpoint configured
- ✅ Test payment successful

## 🆓 Free Tier Details
- **No monthly fees**
- **No setup fees**
- **Only pay when you process payments**
- **Fees**: 2.9% + 30¢ per successful transaction
- **Test mode**: Completely free

## 🚨 Important Notes
- **Keep API keys secure** - never commit to Git
- **Test mode first** - use test cards for development
- **Webhook URL** - update with your actual domain after deployment
- **PCI compliance** - Stripe handles all security

## 📞 Need Help?
- Stripe has excellent documentation
- Test mode is completely safe
- You can always ask me for guidance!

---

**Ready for the next step? Let's set up Gmail for email automation!** 📧
