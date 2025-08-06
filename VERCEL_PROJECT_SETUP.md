# Vercel Project Organization Guide

## 🎯 Problem Solved
This setup prevents pages from being overwritten during deployments by properly separating different parts of the Forward Horizon platform.

## 🏗️ Project Structure

### **Main Application (Current)**
- **Project Name**: `forward-horizon-main-app`
- **URL**: `https://the-forward-horizon.vercel.app/`
- **Contains**: Full platform with marketing pages + dashboard
- **Root**: `/` (main directory)

### **Separate Projects (Optional Future Deployment)**
1. **Marketing Site**: `forward-horizon-marketing`
2. **Management Platform**: `forward-horizon-management` 
3. **Tenant Portal**: `forward-horizon-tenant-portal`

## 🚀 Deployment Strategy

### **Current Setup (Recommended)**
Deploy as **one unified application** with different routes:
- `/` - Marketing homepage
- `/dashboard` - Management dashboard
- `/veterans-housing` - Veterans program page
- `/recovery-housing` - Recovery program page
- `/contact` - Contact forms
- `/api/*` - Backend APIs

### **Multi-Project Setup (Advanced)**
If you want completely separate deployments:

1. **Create 3 separate Vercel projects:**
   ```bash
   # Marketing Site
   vercel --name forward-horizon-marketing ./marketing-website
   
   # Management Platform  
   vercel --name forward-horizon-management ./management-platform
   
   # Tenant Portal
   vercel --name forward-horizon-tenant-portal ./tenant-portal
   ```

2. **Domain Setup:**
   - `theforwardhorizon.com` → Marketing site
   - `admin.theforwardhorizon.com` → Management platform
   - `portal.theforwardhorizon.com` → Tenant portal

## 🔧 Configuration Files

### **Main vercel.json**
```json
{
  "name": "forward-horizon-main-app",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### **.vercelignore**
Prevents conflicts by ignoring subdirectory configs:
```
marketing-website/vercel.json
management-platform/vercel.json
tenant-portal/vercel.json
```

## 📋 Deployment Checklist

### ✅ **Current Status (Unified App)**
- [x] Main application with proper naming
- [x] Dashboard with functional tabs
- [x] Conflict prevention with .vercelignore
- [x] No cron job limits exceeded

### 🎯 **To Prevent Overwrites:**
1. **Always deploy from main directory**
2. **Use git branches for different features**
3. **Test changes locally first**
4. **Use proper commit messages**

### 🚨 **Avoid These Issues:**
- ❌ Don't deploy from subdirectories
- ❌ Don't have multiple vercel.json files active
- ❌ Don't exceed plan limits (cron jobs)
- ❌ Don't skip testing builds locally

## 🔄 Current Deployment Process

1. **Make changes in main directory**
2. **Test locally**: `npm run build && npm run dev`
3. **Commit changes**: `git add . && git commit -m "description"`
4. **Deploy**: `git push origin main`
5. **Vercel auto-deploys** from main branch

## 📞 Support

If pages get overwritten again:
1. Check `.vercelignore` is working
2. Ensure only main `vercel.json` is active
3. Deploy from main directory only
4. Contact support with specific project names