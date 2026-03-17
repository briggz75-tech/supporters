# 🚀 Quick Start Guide

## Status
✅ **Your supporter search app is built and running!**

Development server: **http://localhost:3000**

## What You Need to Do (5 minutes)

### 1. Create `.env.local` file
In the project root, create a file named `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Get Supabase Credentials
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Copy your Project URL and Anon Key from Settings → API
4. Paste into `.env.local`

### 3. Create Database Table
In Supabase dashboard, go to SQL Editor and run:

```sql
CREATE TABLE supporters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  ward TEXT,
  llg TEXT,
  village TEXT,
  status TEXT CHECK (status IN ('strong', 'leaning', 'undecided')),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access" ON supporters
FOR SELECT USING (true);
```

### 4. Add Test Data
In Supabase → Table → supporters, click "Insert" and add a row:

| Field | Value |
|-------|-------|
| name | John Doe |
| phone | +675 1234567 |
| ward | Central Ward |
| llg | Port Moresby LLG |
| village | Koki |
| status | strong |

### 5. Restart Dev Server
```bash
npm run dev
```

### 6. Test It
1. Go to http://localhost:3000
2. Type "john" in the search box
3. See your supporter card appear!

## 📚 Full Documentation
See `README.md` and `SETUP.md` for detailed information.

## Features Included
✅ Beautiful search interface (Google style)
✅ Debounced search (automatic, no lag)
✅ Responsive design (mobile, tablet, desktop)
✅ Color-coded status badges
✅ Loading states
✅ Empty state messages
✅ Smooth animations
✅ Card hover effects
✅ Built for production

## Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Check code quality
```

That's it! Your app is ready. Happy searching! 🎉
