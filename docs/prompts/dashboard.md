# Dashboard Spec
# Portfolio Review AI — Authenticated User Dashboard
# All components reference the design system in CLAUDE.md

---

## Purpose
Where users manage their portfolio reviews — upload new portfolios, view past reviews, drill into detailed feedback, and manage settings. Persistent sidebar navigation, content area on the right.

---

## Layout shell

### Sidebar (persistent, left)
- `w-60 shrink-0 border-r border-border h-screen sticky top-0 bg-surface-base`
- Top: Logo + "Portfolio Review" (same as landing nav)
- Nav items (vertical):
  - Lucide LayoutDashboard + "Dashboard" — overview
  - Lucide Upload + "New Review" — upload flow
  - Lucide History + "My Reviews" — review history
  - Lucide Settings + "Settings" — preferences
- Active state: `bg-surface-raised text-ink-primary`
- Inactive: `text-ink-secondary hover:text-ink-primary hover:bg-surface-raised`
- Bottom: `Avatar sm` + user name + `text-xs text-ink-muted` email
- Mobile: sidebar collapses to hamburger → `Drawer left`

### Main content area
- `flex-1 min-w-0 overflow-y-auto`
- Inner: `max-w-4xl mx-auto px-8 py-10`
- Each page uses `Breadcrumb` at top for context

---

## Pages

### 1. Dashboard (overview)

**Route:** `/dashboard`

**Header:**
- `Breadcrumb`: Dashboard
- Heading: `font-display font-bold text-3xl tracking-tight` "Welcome back"
- Subtext: `text-ink-secondary` "Here's a summary of your portfolio reviews."

**Stats row** (3 cards, horizontal):
- `Card default` × 3, each containing:
  - Label: `text-xs text-ink-muted uppercase tracking-wider` (e.g., "Total Reviews")
  - Value: `font-display font-bold text-2xl text-ink-primary`
  - Trend: `Badge success` "+2 this week" or `Badge default` "No change"
- Cards: "Total Reviews", "Average Score", "Top Category"

**Recent reviews list:**
- Section heading: `font-display font-semibold text-lg tracking-tight` "Recent Reviews"
- List of `Card interactive`, each showing:
  - Left: `Avatar md` with portfolio thumbnail (or initials fallback)
  - Center: Portfolio name (`text-sm font-medium text-ink-primary`) + date (`text-xs text-ink-muted`) + `Badge` tags for top categories
  - Right: `Score ring` (small, w-10 h-10) with overall score
- Click → navigates to review detail
- If no reviews: `EmptyState` with Lucide FileSearch icon + "No reviews yet" + `Button primary` "Upload Your First Portfolio"

**Quick upload CTA:**
- `Card featured` at bottom:
  - "Ready for another review?" + `Button primary` "Upload Portfolio"

---

### 2. New Review (upload flow)

**Route:** `/dashboard/new`

**Header:**
- `Breadcrumb`: Dashboard / New Review
- Heading: "Upload your portfolio"
- Subtext: "We accept PDFs, images, or website URLs."

**Upload section:**
- `FileUpload` component (full width, large drop zone)
- Below: `Divider with label` "OR"
- `Input` with label "Portfolio URL" + placeholder "https://your-portfolio.com"
- `Textarea` with label "Context (optional)" + placeholder "Any specific areas you want feedback on?"
- `Select` with label "Review focus":
  - Options: "Full Review", "Layout Only", "Typography Only", "Visual Hierarchy", "Storytelling"

**Action row:**
- `Button primary` "Start Review"
- `Button ghost` "Cancel"

**Processing state** (after submit):
- Replace upload form with centered layout:
  - `Spinner lg` centered
  - `ProgressBar` (indeterminate or stepped: Uploading → Analyzing → Scoring → Generating)
  - Step labels below: `text-sm text-ink-secondary`
  - Current step: `text-sm text-ink-primary font-medium`
  - `text-xs text-ink-muted` "This usually takes 30–60 seconds"
- On complete: auto-redirect to review detail page
- On error: `Alert error` with retry option

---

### 3. My Reviews (history)

**Route:** `/dashboard/reviews`

**Header:**
- `Breadcrumb`: Dashboard / My Reviews
- Heading: "My Reviews"
- Right-aligned: `Input` (search, with Lucide Search icon) + `Select` (sort: "Newest", "Oldest", "Highest Score", "Lowest Score")

**Filters row:**
- Horizontal row of `Badge` acting as filter chips:
  - "All", "Layout", "Typography", "Hierarchy", "Storytelling"
  - Active filter: `Badge accent(acid)`, inactive: `Badge default`
  - Click toggles filter

**Reviews list:**
- Same card pattern as dashboard recent reviews, but full list
- `Card interactive` per review:
  - Thumbnail / Avatar, name, date, category badges, score ring
  - Click → review detail
- `Tabs` at top if needed: "All Reviews" | "Favorites" | "Archived"

**Empty state:**
- `EmptyState` with appropriate icon + "No reviews match your filters" or "No reviews yet"

**Pagination:**
- Bottom: simple "← Previous | Page X of Y | Next →" in `text-sm text-ink-secondary`

---

### 4. Review Detail

**Route:** `/dashboard/reviews/[id]`

**Header:**
- `Breadcrumb`: Dashboard / My Reviews / [Portfolio Name]
- Heading: Portfolio name (`font-display font-bold text-2xl tracking-tight`)
- Subtext: Review date + review focus badge
- Right-aligned: `Button ghost` "Download PDF" + `Button ghost` "Share"

**Overall score section:**
- `Card featured`, horizontal layout:
  - Left: `Score ring` (large, w-20 h-20) with overall score
  - Right: 4 `Score bar` rows for sub-categories:
    - "Layout" + bar + numeric score
    - "Typography" + bar + numeric score
    - "Visual Hierarchy" + bar + numeric score
    - "Storytelling" + bar + numeric score
  - Color coding per bar based on score range

**Detailed feedback:**
- `Tabs`: "Overview" | "Page-by-Page" | "Recommendations"

**Overview tab:**
- Summary paragraph: `text-sm text-ink-secondary leading-relaxed` in `Card default`
- Strengths section: heading + list of items with Lucide Check `text-success`
- Areas for improvement: heading + list with Lucide AlertTriangle `text-warning`

**Page-by-Page tab:**
- `Accordion` (multiple mode):
  - Each item = one page/screen from portfolio
  - Trigger: page number + page name + mini `Score ring` (sm)
  - Content: feedback text + annotated screenshot (if available) + `Badge` tags
  - Each feedback point has a severity `Badge`: `Badge success` "Strong" / `Badge warning` "Improve" / `Badge error` "Issue"

**Recommendations tab:**
- Ordered list of action items in `Card interactive`:
  - Priority `Badge` (1–5, using `Badge accent(acid)` for top priority, `Badge accent(mist)` for secondary)
  - Recommendation title: `text-sm font-medium text-ink-primary`
  - Description: `text-sm text-ink-secondary`
  - Category `Badge default`

---

### 5. Settings

**Route:** `/dashboard/settings`

**Header:**
- `Breadcrumb`: Dashboard / Settings
- Heading: "Settings"

**Sections (using `Divider` between):**

**Profile:**
- `Avatar lg` with edit overlay
- `Input` "Display Name"
- `Input` "Email" (disabled, shows current)
- `Button secondary` "Update Profile"

**Review Preferences:**
- `Select` "Default review focus" (Full Review, Layout, etc.)
- `Toggle` "Include typography audit" (on by default)
- `Toggle` "Include storytelling assessment" (on by default)
- `Toggle` "Receive email when review is ready"
- `Button secondary` "Save Preferences"

**Danger Zone:**
- `Card default` with `border-error` override:
  - "Delete Account" + `text-sm text-ink-secondary` description
  - `Button ghost` with `text-error` "Delete My Account"
  - Click opens `Modal sm` with confirmation:
    - "Are you sure?" heading
    - Warning text
    - `Input` "Type DELETE to confirm"
    - `Button ghost` "Cancel" + `Button primary` with `bg-error` "Delete Account"

---

## Shared patterns

### Loading states
- Initial page load: `Skeleton` matching the layout (cards → skeleton cards, text → skeleton text lines)
- Data fetching: `Spinner md` centered in content area
- Button loading: `Spinner sm` inline replacing button text + `disabled`

### Error states
- API errors: `Alert error` at top of content area with retry button
- Empty data: `EmptyState` with contextual icon and CTA
- Form validation: `Input` / `Textarea` error state with `text-error` helper text

### Toast notifications
- Review complete: `Toast success` "Your review is ready!"
- Upload failed: `Toast error` "Upload failed. Please try again."
- Settings saved: `Toast success` "Settings updated."
- Generic: `Toast info` for non-critical messages

---

## Responsive breakpoints

| Element | Mobile (< 768px) | Desktop (≥ 768px) |
|---------|-------------------|---------------------|
| Sidebar | Hidden → Drawer left | Visible, w-60 |
| Stats row | 1 column, stacked | 3 columns |
| Review cards | Full width, stacked | Full width, list |
| Review detail scores | Stacked (ring above bars) | Side by side |
| Settings sections | Full width | max-w-lg |
| Tabs | Scrollable horizontal | Full width |

---

## Components used from DS
**All 25 components are used across the dashboard:**

Forms: Input, Textarea, FileUpload, Select, Toggle
Feedback: Badge, Score (ring + bar), ProgressBar, Accordion, Avatar, Divider
Status: Toast, Skeleton, Spinner, Alert, EmptyState
Overlays & Nav: Modal, Tabs, Tooltip, Drawer, Breadcrumb
Foundation: Button (primary, secondary, ghost), Card (default, interactive, featured), Section
