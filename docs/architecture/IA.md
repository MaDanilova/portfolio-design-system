# Information Architecture

## Site Map

```
Portfolio Review AI
│
├── / ................................................ Landing Page (public)
│   ├── Hero + 3D canvas
│   ├── How it Works (4 steps)
│   ├── Sample Review (score preview)
│   ├── Testimonials
│   ├── Pricing (free tier)
│   └── CTA → /register or /login
│
├── /login .......................................... Sign In (public)
│   ├── Email + password form
│   ├── Link → /register
│   └── Success → redirect /dashboard
│
├── /register ....................................... Sign Up (public)
│   ├── Name + email + password + confirm
│   ├── Link → /login
│   └── Success → redirect /dashboard
│
├── /dashboard ...................................... Overview (auth required)
│   ├── Stats cards (total reviews, avg score, top category)
│   ├── Recent reviews (5 latest)
│   ├── Empty state → CTA /dashboard/new
│   │
│   ├── /dashboard/new ............................. New Review (auth required)
│   │   ├── File upload (drag & drop)
│   │   ├── URL input (alt to file)
│   │   ├── Context textarea
│   │   ├── Selects: page type, level, focus
│   │   ├── Submit → POST /api/review
│   │   └── Processing screen → redirect /dashboard/reviews/:id
│   │
│   ├── /dashboard/reviews ......................... All Reviews (auth required)
│   │   ├── Search bar
│   │   ├── Sort dropdown
│   │   ├── Category filter chips
│   │   └── Review cards → link to /dashboard/reviews/:id
│   │
│   ├── /dashboard/reviews/:id ..................... Review Detail (auth required)
│   │   ├── Header (title, date, focus, page type)
│   │   ├── Overall score ring + competitive position
│   │   ├── 9-dimension score bars
│   │   ├── Level assessment card (optional)
│   │   ├── Tab: Overview (summary, gaps, strengths, improvements)
│   │   ├── Tab: Page-by-Page (accordion per page)
│   │   └── Tab: Recommendations (positioning rewrite + priority list)
│   │
│   └── /dashboard/settings ........................ Settings (auth required)
│       ├── Profile (avatar, name, email)
│       ├── Preferences (default focus, toggles)
│       └── Danger zone (delete account)
│
├── /design-system .................................. DS Overview (public)
│   ├── Surface colors
│   ├── Brand colors (acid, mist)
│   ├── Status colors
│   ├── Typography scale
│   └── Spacing tokens
│
├── /design-system/components/:slug ................ Component Pages (public)
│   ├── Foundation: button, card, section, text-reveal, magnetic-button
│   ├── Forms: input, textarea, select, toggle, file-upload
│   ├── Feedback: badge, score, progress-bar, accordion, avatar, divider
│   ├── Status: spinner, skeleton, alert, empty-state
│   └── Overlays & Nav: modal, tabs, tooltip, drawer, breadcrumb
│
└── /api/review ..................................... API (POST)
    ├── Input: image (base64) or URL + context + focus + pageType + level
    ├── Processing: GPT-4o vision with Portfolio Surgeon prompt
    ├── Validation: portfolio gate (rejects non-portfolios)
    └── Output: structured JSON (scores, pages, recommendations)
```

---

## Navigation Structure

### Global Nav (Landing)
```
┌──────────────────────────────────────────────┐
│  Portfolio Review          [Login] [Sign Up]  │
└──────────────────────────────────────────────┘
```

### Dashboard Nav (Authenticated)
```
┌──────────────┬───────────────────────────────┐
│  Sidebar     │  Main Content                 │
│──────────────│                               │
│  Overview    │                               │
│  New Review  │                               │
│  Reviews     │                               │
│  Settings    │                               │
│              │                               │
│  [Sign Out]  │                               │
└──────────────┴───────────────────────────────┘
```

### Design System Nav
```
┌──────────────┬───────────────────────────────┐
│  Sidebar     │  Main Content                 │
│──────────────│                               │
│  Overview    │  Component showcase           │
│              │  with all variants,           │
│  FOUNDATION  │  states, and code             │
│  Button      │                               │
│  Card        │                               │
│  Section     │                               │
│  ...         │                               │
│              │                               │
│  FORMS       │                               │
│  Input       │                               │
│  Textarea    │                               │
│  ...         │                               │
│              │                               │
│  FEEDBACK    │                               │
│  Badge       │                               │
│  Score       │                               │
│  ...         │                               │
│              │                               │
│  STATUS      │                               │
│  Spinner     │                               │
│  ...         │                               │
│              │                               │
│  OVERLAYS    │                               │
│  Modal       │                               │
│  ...         │                               │
└──────────────┴───────────────────────────────┘
```

---

## Auth Gate Logic

```
                    ┌─────────────┐
                    │  Any Route  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Middleware   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        /dashboard/*   /login       /register
              │         /register       │
              │            │            │
        ┌─────▼─────┐ ┌───▼────┐  ┌───▼────┐
        │ Has user?  │ │Has user?│  │Has user?│
        └──┬────┬───┘ └──┬──┬──┘  └──┬──┬──┘
           │    │        │  │        │  │
          Yes   No      Yes No      Yes No
           │    │        │  │        │  │
           ▼    ▼        ▼  ▼        ▼  ▼
         Allow  →     →/dash Allow  →/dash Allow
               /login
```

---

## Data Flow

```
┌───────────────────────────────────────────────────────────────┐
│                        DATA FLOW                              │
│                                                               │
│  ┌─────────┐    ┌─────────────┐    ┌──────────────────────┐  │
│  │  User   │───▶│ /dashboard/ │───▶│  localStorage         │  │
│  │ uploads │    │    new      │    │  (reviews JSON)       │  │
│  │ file/URL│    └──────┬──────┘    └──────────┬───────────┘  │
│  └─────────┘           │                      │              │
│                        │ POST                  │ read/write   │
│                        ▼                      │              │
│               ┌────────────────┐              │              │
│               │  /api/review   │              │              │
│               └────────┬───────┘              │              │
│                        │                      │              │
│                        ▼                      │              │
│               ┌────────────────┐              │              │
│               │  OpenAI GPT-4o │              │              │
│               │  (vision)      │              │              │
│               └────────┬───────┘              │              │
│                        │                      │              │
│                        ▼                      │              │
│               ┌────────────────┐    ┌─────────▼───────────┐  │
│               │ Structured JSON│───▶│ saveReview()         │  │
│               │ (validated)    │    │ → localStorage       │  │
│               └────────────────┘    └─────────┬───────────┘  │
│                                               │              │
│                                               ▼              │
│                                    ┌──────────────────────┐  │
│                                    │ /dashboard/reviews/:id│  │
│                                    │ (detail view)        │  │
│                                    └──────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   SUPABASE                              │  │
│  │  ┌──────────────┐    ┌───────────────┐                  │  │
│  │  │  auth.users   │    │   profiles    │                  │  │
│  │  │──────────────│    │───────────────│                  │  │
│  │  │ id           │◄──▶│ id (FK)       │                  │  │
│  │  │ email        │    │ full_name     │                  │  │
│  │  │ metadata     │    │ avatar_url    │                  │  │
│  │  │ created_at   │    │ updated_at    │                  │  │
│  │  └──────────────┘    └───────────────┘                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

---

## Page States

| Page | Empty | Loading | Error | Loaded |
|------|-------|---------|-------|--------|
| Dashboard | EmptyState + CTA | Skeleton cards | - | Stats + review list |
| New Review | Upload form | Progress bar (4 steps) | Alert (red) | Redirect to detail |
| Reviews | EmptyState | - | - | Card list + filters |
| Review Detail | - | Skeleton | "Not found" | Full detail + tabs |
| Settings | Default values | - | - | Profile form |
| Login | Form | Button spinner | Alert (red) | Redirect to dashboard |
| Register | Form | Button spinner | Alert (red) | Redirect to dashboard |
