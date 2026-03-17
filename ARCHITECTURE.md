# Component Architecture

## File Structure

```
supporter-search/
│
├── app/
│   ├── layout.tsx              # Root HTML layout + metadata
│   ├── page.tsx                # Main page component (orchestrates everything)
│   └── globals.css             # Tailwind + global styles
│
├── components/
│   ├── SearchBar.tsx           # Search input + debounce logic
│   └── SupporterCard.tsx       # Individual supporter card
│
├── lib/
│   └── supabaseClient.ts       # Supabase client setup + types
│
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
├── next.config.js              # Next.js config
├── postcss.config.js           # PostCSS plugins
├── .eslintrc.json              # ESLint rules
│
├── .env.local.example          # Environment template
├── .gitignore
├── README.md                   # Full documentation
├── SETUP.md                    # Setup guide
└── QUICKSTART.md              # Quick start guide
```

## Component Hierarchy

```
<RootLayout>
  ├── Global CSS
  ├── Metadata
  └── <HomePage>
      ├── Title & Description
      ├── <SearchBar>
      │   ├── Input field
      │   ├── Icon
      │   ├── Loading spinner
      │   └── Debounce logic (300ms)
      │
      └── Results Section
          ├── Loading skeleton (if isLoading)
          ├── Card Grid (if results exist)
          │   └── <SupporterCard> x N
          │       ├── Name (bold)
          │       ├── Status badge
          │       ├── Phone
          │       ├── Location
          │       └── Ward/LLG tags
          │
          └── Empty state (if no results)
```

## Data Flow

```
User Input
    ↓
SearchBar Component
    ├─ Capture input
    ├─ Debounce (300ms timer)
    └─ Call performSearch()
        ↓
    validateSupabaseConfig()
        ↓
    supabase.from('supporters')
        .select('*')
        .or(name.ilike | phone.ilike | ward.ilike | llg.ilike)
        .limit(50)
        ↓
    Response: Supporter[]
        ↓
    onSearch(results)
        ↓
    Update state in HomePage
        ↓
    Render <SupporterCard> for each result
        ↓
    Display with fade-in animation
```

## Key Components

### SearchBar.tsx
**Purpose**: Handle search input and fetch results

**Props**:
- `onSearch: (supporters: Supporter[], loading: boolean) => void`

**State**:
- `searchQuery: string` - Current input value
- `isLoading: boolean` - Loading indicator
- `debounceTimer: NodeJS.Timeout | null` - Debounce reference

**Features**:
- 300ms debounce to avoid excessive API calls
- Loading spinner in input
- Real-time search as user types
- Case-insensitive search via Supabase ILIKE

---

### SupporterCard.tsx
**Purpose**: Display individual supporter information

**Props**:
- `supporter: Supporter` - Supporter object with all fields

**Display**:
- Name (1.125rem, bold)
- Status badge (color-coded: green/yellow/gray)
- Phone with icon
- Location with icon
- Ward and LLG tags

**Styling**:
- Rounded corners (1rem)
- Shadow on focus
- Hover scale (1.05x)
- Fade-in animation on mount
- Smooth transitions (300ms)

---

### HomePage (page.tsx)
**Purpose**: Orchestrate search and results display

**State**:
- `supporters: Supporter[]` - Search results
- `hasSearched: boolean` - Whether user performed search
- `isLoading: boolean` - Fetch loading state

**Sections**:
1. **Hero**: Title + description (always visible)
2. **Search Panel**: SearchBar in card container (always visible)
3. **Results**: Cards grid / skeleton / empty state (conditional)

## Type System

```typescript
// From lib/supabaseClient.ts
export type Supporter = {
  id: string                    // UUID from database
  name: string                  // Supporter name
  phone: string                 // Phone number (searchable)
  ward: string                  // Electoral ward (searchable)
  llg: string                   // Local Level Government (searchable)
  village: string               // Village/location
  status: 'strong' | 'leaning' | 'undecided'  // Status badge
  created_at: string            // ISO timestamp
}
```

## Styling Approach

### Utility-First (Tailwind CSS)
- No CSS files needed for components
- Classes compose in JSX
- Example: `"rounded-xl shadow-lg hover:shadow-2xl transition-all"`

### Custom Animations
- Fade-in: 0.5s ease-in with slide up
- Defined in `tailwind.config.ts`
- Applied via `animate-fade-in` class

### Responsive Design
```
Mobile (sm):   min-width 640px   → 1 column
Tablet (md):   min-width 768px   → 2 columns
Desktop (lg):  min-width 1024px  → 3 columns
```

## API Integration

### Supabase Query
```typescript
await supabase
  .from('supporters')
  .select('*')
  .or(`
    name.ilike.%${query}%,
    phone.ilike.%${query}%,
    ward.ilike.%${query}%,
    llg.ilike.%${query}%
  `)
  .limit(50)
```

- Uses PostgreSQL ILIKE for case-insensitive matching
- Returns up to 50 results
- Partial string matching (e.g., "john" matches "john doe")

## Performance Optimizations

1. **Debouncing**: Prevents too many API calls
   - Timer: 300ms
   - Cleared and reset on each keystroke
   - Only final pause triggers search

2. **Skeleton Loading**: Shows immediately while fetching
   - Fake cards appear instantly
   - Better UX than blank space

3. **Result Limit**: Max 50 results per query
   - Prevents oversized responses
   - Keeps UI fast

4. **CSS Animations**: GPU-accelerated
   - Uses `transform` and `opacity`
   - Not `left`/`top` properties

5. **Lazy Component Loading**:
   - Cards only render when needed
   - Grid layout for efficient DOM

## Environment Configuration

```bash
# .env.local (never commit to git)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...

# These are embedded in client JS (safe to expose)
# NEXT_PUBLIC_ prefix tells Next.js to include in build
```

## Error Handling

### Runtime Validation
```typescript
export function validateSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
}
```

### Search Error Handling
```typescript
try {
  const { data, error } = await supabase.from('supporters').select('*')
  
  if (error) {
    console.error('Search error:', error)
    onSearch([], false)  // Show empty state
  } else {
    onSearch(data, false)  // Show results
  }
} catch (err) {
  console.error('Search exception:', err)
  onSearch([], false)  // Fail gracefully
}
```

---

## Next Steps After Setup

1. ✅ Create Supabase project
2. ✅ Add environment variables
3. ✅ Create `supporters` table
4. ✅ Add test data
5. 🔄 Test search in browser
6. 🎨 Customize colors/styles
7. 📱 Test responsive design
8. 🚀 Deploy to Vercel/production
9. 📊 Monitor performance
10. 🔐 Add authentication (if needed)
