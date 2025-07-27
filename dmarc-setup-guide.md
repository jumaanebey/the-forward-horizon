# DMARC Setup Guide for theforwardhorizon.com

## 🚨 CRITICAL SECURITY ISSUE
Your domain is currently vulnerable to email spoofing and phishing attacks because it lacks a DMARC record.

## What is DMARC?
DMARC (Domain-based Message Authentication, Reporting, and Conformance) prevents email spoofing by telling email providers how to handle unauthenticated emails from your domain.

## How to Add DMARC Record

### Step 1: Access Your DNS Provider
1. Log into your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
2. Find "DNS Management" or "DNS Settings"
3. Look for "DNS Records" or "Manage DNS"

### Step 2: Add TXT Record
Add a new TXT record with these settings:

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@theforwardhorizon.com
TTL: 3600 (or default)
```

### Step 3: Choose Your Policy Level
- **p=none** - Monitor only (start here)
- **p=quarantine** - Send to spam (recommended)
- **p=reject** - Block completely (maximum protection)

### Step 4: Verify Setup
After adding, check with:
```bash
dig _dmarc.theforwardhorizon.com TXT
```

## Recommended DMARC Records

### For Monitoring (Start Here):
```
v=DMARC1; p=none; rua=mailto:admin@theforwardhorizon.com
```

### For Protection (After Monitoring):
```
v=DMARC1; p=quarantine; rua=mailto:admin@theforwardhorizon.com
```

### For Maximum Security:
```
v=DMARC1; p=reject; rua=mailto:admin@theforwardhorizon.com
```

## Why This Matters
- Prevents criminals from sending fake emails from your domain
- Protects your brand reputation
- Improves email deliverability
- Required for many enterprise email systems

## Next Steps
1. Add the DMARC record
2. Monitor reports for 30 days
3. Gradually increase policy strength
4. Set up email monitoring for reports 