# Forward Horizon Project Structure Guide

## 🏗️ **Main Project: forward-horizon-app**
**Purpose**: Complete Forward Horizon website + management dashboard
**Live URL**: https://theforwardhorizon.com
**Dashboard**: https://theforwardhorizon.com/dashboard

---

## 📁 **Directory Organization**

### **Core Application Files**
- `src/` - Next.js application source code
- `public/` - Static assets (images, icons, etc.)
- `package.json` - Dependencies and scripts
- `vercel.json` - Deployment configuration
- `CLAUDE.md` - Maintenance and prevention guide

### **Documentation**
- `_docs/setup-guides/` - Technical setup instructions
- `_docs/marketing-materials/` - Marketing docs and PDFs
- `README.md` - Project overview
- `PROJECT_STRUCTURE_GUIDE.md` - This file

### **Archives & Backups**
- `_archive/temp-files/` - Temporary/backup HTML files
- `ORIGINAL_WEBSITE_BACKUP.html` - Backup of original website
- `images/` - Original image files (backup)

### **Database & Config**
- `lib/` - Database schemas and utilities
- `scripts/` - Database setup scripts

---

## 🔧 **Key Files Explained**

### **Website Content**
- `src/app/page.tsx` - **MAIN WEBSITE** (theforwardhorizon.com)
- `src/app/dashboard/page.tsx` - Management dashboard
- `src/app/main-site/page.tsx` - Duplicate of main website
- `public/images/` - Website images (ACTIVE)

### **Configuration Files**
- `vercel.json` - Vercel deployment settings
- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Styling configuration

### **Important Guides**
- `CLAUDE.md` - **READ FIRST** - Maintenance guide
- `QUICK_ADMIN_ACCESS_GUIDE.md` - How to access dashboard
- `DATABASE_SETUP_GUIDE.md` - Database configuration
- `TROUBLESHOOTING_CONTACT_FORM.md` - Form issue fixes

---

## 🚨 **CRITICAL: What NOT to Delete**

### **Essential Files (NEVER DELETE)**
- `src/` folder - The entire application
- `public/` folder - All website assets
- `package.json` - Dependencies
- `vercel.json` - Deployment config
- `CLAUDE.md` - Prevention guide
- `node_modules/` - Dependencies (auto-generated)

### **Safe to Delete Files**
- `_archive/` folder - Old/temporary files
- `ORIGINAL_WEBSITE_BACKUP.html` - Backup only
- `images/` folder - Duplicated in `public/images/`
- Individual `.html` files in root - Not used by Next.js

---

## 🗑️ **Recommended Cleanup**

### **Files You Can Safely Delete**
```bash
# Old HTML files (not used by Next.js app)
rm application.html careers.html house-rules.html housing-inventory.html resources.html

# Duplicate/unused config files
rm _config.yml postcss.config.js pwa-register.js sw.js
rm robots.txt sitemap.xml (duplicated in public/)

# Old scripts that aren't used
rm deploy.sh deploy-to-github.sh
rm generate-lead-magnets.js generate-pdf.js

# Server logs
rm server.log

# Misc unused files
rm other manifest.json upload-instructions.md
```

### **Keep These Files**
- All files in `src/`, `public/`, `_docs/`
- `package.json`, `package-lock.json`  
- `next.config.ts`, `tailwind.config.js`, `tsconfig.json`
- `vercel.json`, `eslint.config.mjs`
- `CLAUDE.md`, `README.md`

---

## 🔄 **Other Project: forward-horizon-marketing**

**Status**: ❌ **UNUSED** - Can be deleted entirely
**Purpose**: Was supposed to be marketing-only, but forward-horizon-app handles everything

### **Recommendation**: Delete the entire `forward-horizon-marketing` folder
- It's redundant with the main project
- Not connected to any live website
- Creates confusion

---

## 📋 **Quick Commands**

### **Build and Test**
```bash
npm run build    # Test for errors
npm run dev      # Local development
```

### **Deploy**
```bash
git add .
git commit -m "Your changes"
git push        # Auto-deploys to Vercel
```

### **Access Points**
- **Public Website**: https://theforwardhorizon.com
- **Admin Dashboard**: https://theforwardhorizon.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

---

*Last updated: After cleanup and organization*