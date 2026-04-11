# Portfolio Review AI

An AI-powered tool that analyzes design portfolio screenshots and delivers structured, actionable feedback. Upload a portfolio page, get scored across 9 dimensions with specific recommendations.

Built as a teaching project — every design decision, prompt, and architecture doc is included so you can rebuild it from scratch.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS 4 (custom design tokens, no component libraries)
- **Animation:** GSAP (scroll reveals, entrance animations, hover effects)
- **3D:** Three.js + React Three Fiber (hero WebGL background)
- **Auth & DB:** Supabase (auth, profiles, reviews storage)
- **AI:** OpenAI GPT-4o Vision API (portfolio analysis)
- **Language:** TypeScript
- **Testing:** Vitest

## Project structure

```
src/
├── app/
│   ├── (marketing)/page.tsx       # Landing page (public)
│   ├── (auth)/                    # Login, Register
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/                 # Authenticated app
│   │   ├── page.tsx               # Overview (stats, recent reviews)
│   │   ├── new/page.tsx           # Upload + analyze flow
│   │   ├── reviews/page.tsx       # All reviews list
│   │   ├── reviews/[id]/page.tsx  # Single review detail
│   │   └── settings/page.tsx      # Profile, preferences, danger zone
│   ├── design-system/             # Component showcase (localhost only)
│   │   ├── page.tsx               # Tokens overview
│   │   ├── architecture/page.tsx  # Architecture docs
│   │   └── components/            # 25 component pages
│   ├── api/
│   │   ├── review/route.ts        # POST — sends screenshot to GPT-4o
│   │   ├── auth/register/route.ts # POST — create account
│   │   └── settings/              # Profile, password, preferences, account deletion
│   ├── globals.css                # All design tokens live here
│   └── layout.tsx                 # Root layout (fonts, body classes)
│
├── components/                    # All reusable UI components (32 files)
│   ├── AppShell.tsx               # Landing page shell (nav + footer)
│   ├── DashboardShell.tsx         # Dashboard layout wrapper
│   ├── Sidebar.tsx                # Dashboard sidebar navigation
│   ├── HeroCanvas.tsx             # WebGL noise shader background
│   ├── ReviewCard.tsx             # Review list item card
│   ├── Score.tsx                  # Score ring + bar components
│   ├── Button.tsx, Card.tsx, ...  # Design system components
│   └── ...
│
├── hooks/
│   ├── useReveal.ts               # GSAP scroll-triggered entrance
│   └── useMagnet.ts               # Magnetic cursor effect for buttons
│
├── lib/
│   ├── animations.ts              # GSAP easing presets and durations
│   ├── constants.ts               # App-wide constants
│   ├── reviews.ts                 # Review CRUD (Supabase)
│   ├── system-prompt.ts           # GPT-4o system prompt (Portfolio Surgeon v1.3)
│   ├── types.ts                   # TypeScript interfaces
│   ├── utils.ts                   # cn() helper for className merging
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   └── server.ts              # Server Supabase client
│   └── security/
│       ├── file-validation.ts     # Upload type/size checks
│       ├── rate-limit.ts          # API rate limiting
│       ├── settings-rate-limit.ts # Settings endpoint limits
│       ├── request-origin.ts      # Origin header validation
│       ├── password.ts            # Password strength rules
│       └── monitoring.ts          # Security event logging
│
├── shaders/
│   ├── heroNoise.vert             # Vertex shader (passthrough)
│   └── heroNoise.frag             # Fragment shader (noise distortion)
│
└── middleware.ts                   # Auth gates + design-system localhost lock
```

## Docs and prompts

Everything used to build this project lives in the repo:

```
docs/
├── prompts/
│   ├── landing-page.md            # Full spec for the marketing page
│   ├── dashboard.md               # Full spec for the authenticated app
│   └── systemprompt.md            # GPT-4o system prompt (Portfolio Surgeon)
├── architecture/
│   ├── IA.md                      # Information architecture + site map
│   └── OOUX.md                    # Object-oriented UX map (data model)
└── security-issues-priority.md    # Threat model + prioritized fixes

CLAUDE.md                          # Design system rules (colors, typography,
                                   # components, animation, layout tokens)
```

### What each prompt does

| File | Purpose |
|------|---------|
| `CLAUDE.md` | The design system bible. Every color token, component pattern, spacing rule, and animation guideline. Read this first. |
| `docs/prompts/landing-page.md` | Step-by-step spec for the marketing page — hero with WebGL, how-it-works, testimonials, pricing, footer. Includes shader behavior. |
| `docs/prompts/dashboard.md` | Spec for the entire authenticated experience — sidebar, overview, upload flow, review list, review detail with tabs, settings. |
| `docs/prompts/systemprompt.md` | The AI prompt sent to GPT-4o. Defines Portfolio Surgeon persona, 9 scoring dimensions, red/green flags, output JSON schema. |
| `docs/architecture/IA.md` | Site map, navigation structures, auth gate logic, data flow diagram, page states. |
| `docs/architecture/OOUX.md` | Every data object (User, Review, Scores, Page, Recommendation), their attributes, relationships, and storage. |

## Design system

The design system is **monochrome black & white** — no color accents.

| Token | Value | Use |
|-------|-------|-----|
| `acid` | `#0E0E0E` (black) | Primary CTAs, main actions |
| `mist` | `#6B6B6B` (gray) | Secondary actions |
| `surface-base` | `#FFFFFF` | Page background |
| `surface-raised` | `#F7F7F7` | Cards, inputs |
| `ink-primary` | `#0E0E0E` | Headings, body text |
| `ink-secondary` | `#6B6B6B` | Supporting text |
| `ink-muted` | `#999999` | Captions, placeholders |

Status colors (error red, success green, warning amber) are used only in status contexts.

All tokens are defined in `src/app/globals.css`. See the full system at `/design-system` on localhost.

## Getting started

### Prerequisites

- Node.js >= 22
- A Supabase project (free tier works)
- An OpenAI API key with GPT-4o access

### Setup

```bash
# Clone and install
git clone <repo-url>
cd PortfolioReview
npm install

# Configure environment
cp .env.local.example .env.local
# Fill in your Supabase and OpenAI credentials in .env.local

# Run Supabase migrations
# Apply the SQL files in supabase/migrations/ to your Supabase project
# (via Supabase dashboard SQL editor or CLI)

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the app.
Open [http://localhost:3000/design-system](http://localhost:3000/design-system) for the component library.

### Environment variables

Create `.env.local` with:

```env
# Supabase (from project settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-key
```

### Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npm run test     # Vitest
```

## Database

Three migrations in `supabase/migrations/`:

1. `001_initial_schema.sql` — Base tables
2. `002_expand_reviews.sql` — Full review JSON storage
3. `003_profile_preferences.sql` — User preferences

Apply them in order via the Supabase SQL editor.

## How the AI review works

1. User uploads a portfolio screenshot (or pastes a URL)
2. Image is sent to `POST /api/review` with context (page type, focus area, experience level)
3. Server sends the image to GPT-4o Vision with the Portfolio Surgeon system prompt
4. GPT-4o returns structured JSON: overall score, 9 dimension scores, page-by-page feedback, recommendations
5. Response is validated and saved to Supabase
6. User sees the full review at `/dashboard/reviews/:id`

The system prompt includes a "portfolio gate" — it rejects non-portfolio images (e-commerce sites, dashboards, random screenshots) before scoring.

## Security

- Auth middleware protects all `/dashboard` routes
- Design system is localhost-only (middleware redirects in production)
- CSP, X-Frame-Options, and other security headers configured
- Rate limiting on review API and settings endpoints
- File upload validation (type, size)
- Origin header checks on mutating requests
- See `docs/security-issues-priority.md` for the full threat model
