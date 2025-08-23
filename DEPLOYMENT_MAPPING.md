# Deployment Mapping & Change Management System

## 🚨 CRITICAL: Always Verify Before Making Changes

**NEVER make changes to code without first confirming which repository serves which live domain.**

## Domain-to-Repository Mapping

### Current Status (As of August 23, 2025)

| Domain | Status | Repository | Deployment Platform | Last Verified |
|--------|--------|------------|-------------------|---------------|
| `theforwardhorizon.com` | ❌ **UNKNOWN SOURCE** | **NOT IDENTIFIED** | Vercel | 2025-08-23 |
| `www.theforwardhorizon.com` | ❌ **UNKNOWN SOURCE** | **NOT IDENTIFIED** | Vercel | 2025-08-23 |

### Repositories That DO NOT Serve theforwardhorizon.com
- ❌ `/Users/jumaanebey/Documents/forward-horizon-app/` (the-forward-horizon.git)
- ❌ `/Users/jumaanebey/Documents/google-ads-landing-page/`
- ❌ `/Users/jumaanebey/Documents/GitHub/my-property-management/`

## 🔍 Verification Protocol

Before making ANY changes to code, follow this protocol:

### Step 1: Identify the Correct Source
1. **Add a unique test identifier** to the suspected source repository
2. **Deploy the change**
3. **Check if the identifier appears** on the live website
4. **Only proceed if verified**

### Step 2: Test Implementation
```bash
# Example test identifier format
<!-- DEPLOYMENT_TEST_YYYY_MM_DD_HHMMSS -->
```

### Step 3: Verification Commands
```bash
# Check DNS
dig +short theforwardhorizon.com

# Check deployment headers
curl -I https://www.theforwardhorizon.com/ | grep -i "x-vercel\|server"

# Test identifier check
curl -s https://www.theforwardhorizon.com/ | grep "DEPLOYMENT_TEST"
```

## 🛠 Change Management Workflow

### For Code Changes:
1. **STOP** - Don't make changes yet
2. **VERIFY** - Confirm repository-to-domain mapping
3. **TEST** - Add test identifier and verify it appears
4. **PROCEED** - Make actual changes only after verification
5. **VALIDATE** - Confirm changes appear on live site

### For New Domains:
1. **DOCUMENT** - Add to mapping table immediately
2. **TEST** - Verify with test identifier
3. **LINK** - Connect repository to domain in documentation

## 🚦 Status Indicators

- ✅ **VERIFIED** - Repository confirmed to serve domain
- ❓ **SUSPECTED** - Likely but not confirmed
- ❌ **NOT CONNECTED** - Confirmed NOT serving domain
- ⚠️ **UNKNOWN** - Source not identified

## 📋 Investigation Checklist

When a domain source is unknown:

- [ ] Check all local repositories for CNAME files
- [ ] Search for domain references in all codebases
- [ ] Check Vercel project dashboard
- [ ] Check GitHub Pages settings
- [ ] Check DNS records and hosting providers
- [ ] Look for static HTML deployments
- [ ] Check for multiple Vercel accounts/projects

## 🔄 Regular Maintenance

### Weekly Tasks:
- Verify all domain mappings are current
- Test at least one deployment per domain
- Update documentation with any changes

### Before Major Changes:
- Run full verification protocol
- Backup current deployment mapping
- Document all changes made

## 🚨 Emergency Protocol

If changes don't appear on live site:

1. **STOP** making more changes
2. **DOCUMENT** what was attempted
3. **INVESTIGATE** using verification protocol
4. **IDENTIFY** actual source before proceeding
5. **UPDATE** this mapping document

## 📞 Contact Information Issue Resolution

### The theforwardhorizon.com Phone Number Issue:
- **Problem**: Phone number shows `(626) 603-0954` instead of `(310) 488-5280`
- **Root Cause**: Unknown deployment source
- **Status**: ❌ UNRESOLVED - source not identified
- **Next Steps**: Must find actual repository/deployment source

## 🔍 Future Investigation Requirements

To resolve theforwardhorizon.com phone number:
1. Check Vercel dashboard for all projects
2. Check for forgotten repositories
3. Check if domain points to different hosting
4. Check for static HTML files on CDN
5. Contact hosting provider if necessary

---

## 🤖 Claude Code Integration

This document should be checked and updated by Claude Code at the start of every session involving Forward Horizon websites.

**Always read this file before making ANY changes to Forward Horizon code.**