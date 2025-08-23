# Forward Horizon Website Maintenance Guide

## 🚨 CRITICAL: Always Verify Deployment Source First

**⚠️ WARNING: NEVER make changes without confirming which repository serves the live domain.**

### Before ANY changes:
1. Read `DEPLOYMENT_MAPPING.md`
2. Run `./scripts/verify-deployments.sh` 
3. Verify repository with test identifier
4. Only then make actual changes

### Known Issue: theforwardhorizon.com source is UNKNOWN
- Domain shows phone: (626) 603-0954 
- Should show: (310) 488-5280
- Problem: Can't find which repository serves the domain
- DO NOT make random changes - find source first

## 🚨 CRITICAL: Website Routing Rules

### Main Website vs Dashboard
- **theforwardhorizon.com** = PUBLIC marketing website (src/app/page.tsx)
- **theforwardhorizon.com/dashboard** = INTERNAL management dashboard

### ⚠️ NEVER change the root page (src/app/page.tsx) to show dashboard!

## 🖼️ Images & Assets

### Where Images Must Be Located
- ✅ **Correct**: `/public/images/` folder
- ❌ **Wrong**: `/images/` folder (not served by Next.js)

### Image Path Format
- ✅ **Correct**: `url('/images/filename.jpg')`  
- ❌ **Wrong**: `url('images/filename.jpg')`

### Adding New Images
1. Place images in `/public/images/` folder
2. Reference with `/images/filename.jpg` (leading slash required)
3. Test locally before deploying

## 🔧 Deployment Checklist

Before any deployment:
1. Run `npm run build` to check for build errors
2. Fix any TypeScript or build errors
3. Verify images are in `/public/` folder
4. Test that theforwardhorizon.com shows MARKETING site (not dashboard)
5. Commit and push to trigger deployment

## 🛡️ Protection Against Future Issues

### Build Verification
- Always run `npm run build` before committing
- Never ignore build errors - fix them immediately
- Build errors prevent Vercel deployments

### Routing Protection  
- Root page (src/app/page.tsx) should ALWAYS show marketing website
- Dashboard content goes in src/app/dashboard/page.tsx
- Never use redirects at root - put content directly in page

### Asset Management
- Keep original images in `/images/` as backup
- Working images must be in `/public/images/`
- Use absolute paths starting with `/`

## 📱 Quick Recovery Commands

If website breaks again:
```bash
# Check build status
npm run build

# Copy images to correct location  
cp -r images/ public/

# Update image paths to use /images/ format
```

## 🎯 Testing Your Website

1. Visit theforwardhorizon.com in incognito browser
2. Should see: "Forward Horizon" marketing site with programs
3. Should NOT see: Dashboard or management interface
4. Images should load properly
5. Contact forms should work

---
*Last updated: After fixing routing and image issues*