# Environment Variables Reference

## Overview
This app uses **Supabase** for the database. To connect, you need two credentials.

## Setting Up `.env.local`

### 1. Create the File
In your project root, create a file named `.env.local`:

```bash
# On Windows (PowerShell)
New-Item -Path .\.env.local -ItemType File

# On Mac/Linux
touch .env.local
```

### 2. Add Your Credentials

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Restart Dev Server
```bash
npm run dev
```

---

## Getting Your Credentials

### From Supabase Dashboard

#### Step 1: Create Supabase Account
- Go to https://supabase.com
- Sign up with GitHub, Google, or email
- Create a new project

#### Step 2: Find Your Project URL
1. Open your project dashboard
2. Click **Settings** (gear icon)
3. Click **API** in the left sidebar
4. Copy the **Project URL** under "API"
5. Paste as `NEXT_PUBLIC_SUPABASE_URL`

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abc123xyz.supabase.co
```

#### Step 3: Find Your Anon Key
1. Still in **Settings → API**
2. Find the **Anon public** key section
3. Copy the key that starts with `eyJ`
4. Paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Example:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Variable Explanation

### `NEXT_PUBLIC_SUPABASE_URL`
- **Type**: String (URL)
- **Purpose**: Tells the app where your Supabase database is hosted
- **Visibility**: Public (embedded in client JavaScript)
- **Example**: `https://abc123xyz.supabase.co`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type**: String (JWT Token)
- **Purpose**: API key for read-only database access
- **Visibility**: Public (safe to expose, read-only)
- **Restrictions**: Set via Row Level Security in Supabase
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Why `NEXT_PUBLIC_` Prefix?

In Next.js:
- Variables with `NEXT_PUBLIC_` are embedded in client-side JavaScript
- Variables without prefix are only available on the server
- Our app searches from the browser, so needs public access

**Security Note**: The Anon Key is intentionally public and read-only. Supabase's Row Level Security (RLS) policies restrict what authenticated/anonymous users can do.

---

## .env.local vs .env.production

### Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-key-here
```

### Production (Set in Vercel/Hosting Dashboard)
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-key-here
```

---

## Troubleshooting

### "Missing Supabase environment variables" Error

**Cause**: Variables not set or incorrectly named

**Solution**:
1. Check `.env.local` exists in project root (not `app/` or `components/`)
2. Verify exact spelling (case-sensitive):
   - `NEXT_PUBLIC_SUPABASE_URL` ✅
   - `Next_Public_Supabase_Url` ❌
3. Restart dev server: `npm run dev`
4. Check browser console (F12) for actual error

**Quick Check**:
```bash
# Should show your URLs
cat .env.local

# Or on Windows
Get-Content .env.local
```

### Search Returns No Results

**Potential Causes**:
1. `.env.local` not set → no connection to Supabase
2. Table name wrong → query fails
3. RLS policy denying access → no data returned
4. No test data added → empty results legitimate

**Solution**:
1. Verify `.env.local` has correct values
2. Verify table exists in Supabase (Tables → supporters)
3. Check RLS policy allows public read access
4. Add test data manually in Supabase dashboard

---

## File Location Reference

### Correct ✅
```
supporter-search/
├── .env.local                 ← HERE
├── app/
├── components/
└── lib/
```

### Wrong ❌
```
supporter-search/
├── app/
│   └── .env.local             ← NOT HERE
├── components/
└── lib/
```

---

## Never Commit!

Your `.env.local` file contains sensitive credentials. 

### Add to .gitignore
```bash
# .gitignore
.env.local
.env.*.local
```

This is already done in your project! ✅

---

## Verification Checklist

- [ ] Created `.env.local` in project root
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Values match exactly from Supabase dashboard
- [ ] Dev server restarted (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Test data exists in Supabase `supporters` table
- [ ] Search returns results when typing

---

## Advanced Configuration

### Multiple Environments

**For Vercel deployment:**

1. Go to Vercel Project → Settings → Environment Variables
2. Add variables:
   - Framework: Next.js
   - Auto-exposed: Check "Expose to client" for NEXT_PUBLIC_
3. Vercel automatically uses these on deploy

**For local testing with different Supabase:**

Create `.env.local.staging`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-key
```

Then: `npm run dev -- --env-file .env.local.staging`

---

## Security Best Practices

✅ **Do This**:
- Use Supabase's Row Level Security
- Limit anon key to read-only operations
- Rotate keys if compromised
- Use different projects for dev/prod

❌ **Don't Do This**:
- Commit `.env.local` to Git
- Use database password as anon key
- Share `.env.local` in emails/messages
- Use same project for development and production

---

## Support

**Can't find your credentials?**

1. Supabase Help: https://supabase.com/docs/guides/api#api-url-and-keys
2. Common issues: https://supabase.com/docs/api/auth#api-auth
3. Discord community: https://discord.supabase.com

**Need to regenerate keys?**

In Supabase → Settings → API → Service Role Keys or Anon Keys → click the 🔄 icon

---

**Status**: Ready to configure ✅
**Next**: Create Supabase account and copy credentials
