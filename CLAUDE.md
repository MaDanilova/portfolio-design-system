# CLAUDE.md / .cursorrules
# Design System — Portfolio Review AI Tool
# Read this entire file before writing any UI code.

## What this project is
A **design system and component library** for the Portfolio Review AI tool.
The design system is local-only (accessible at `/design-system` on localhost). The product app lives at `/` (landing), `/dashboard` (authenticated), `/login`, `/register`.

Stack: Next.js 14 (App Router) + Tailwind CSS + GSAP + TypeScript.

### Project structure
```
src/
├── app/
│   ├── (marketing)/page.tsx  # Landing page
│   ├── (auth)/                # Login, Register
│   ├── dashboard/             # Authenticated app
│   └── design-system/         # DS showcase (local-only)
├── components/                # Reusable components
├── hooks/                     # Reusable GSAP hooks
└── lib/                       # Utilities, animation presets, tokens
```

---

## Non-negotiable rules

### Colors — Monochrome B&W
- NEVER use hardcoded hex values — ALL colors come from Tailwind tokens in `globals.css`
- Theme: **light**, clean white background, black text
- Surface scale: surface-base (#FFF) → surface-raised (#F7F7F7) → surface-overlay (#FFF) → surface-subtle (#EBEBEB)
- Text scale: ink-primary (#0E0E0E) → ink-secondary (#6B6B6B) → ink-muted (#999)
- Primary accent `acid`: black (#0E0E0E) — for CTA buttons, primary actions
- Secondary accent `mist`: gray (#6B6B6B) — for secondary actions
- No color accents — strictly black, white, gray
- Status colors (error, success, warning) are the only non-monochrome colors, used only in status contexts

### Brand color tokens (in globals.css)
```
--color-acid: #0E0E0E;
--color-acid-dim: #333333;
--color-mist: #6B6B6B;
--color-mist-dim: #555555;
```

### Status color tokens (in globals.css)
```
--color-error: #EF4444;
--color-error-dim: #DC2626;
--color-success: #22C55E;
--color-success-dim: #16A34A;
--color-warning: #F59E0B;
--color-warning-dim: #D97706;
```

### Typography — Single grotesque font
- **One font family for everything**: Inter (via `font-display` and `font-body` — both map to Inter)
- Headings: `font-display font-bold` (or `font-black` for display) + `tracking-tight`
- Body, labels, buttons: `font-body`
- Code: `font-mono` (JetBrains Mono)
- Eyebrow labels: `text-xs font-body font-medium tracking-widest uppercase text-ink-muted`

### Animation
- GSAP handles ALL entrance animations, scroll reveals, hover effects, and page transitions
- Never use CSS `transition` for animations the user notices (entrance, exit, scroll effects)
- CSS transition is OK only for: color changes on hover, opacity on focus rings
- CSS `@keyframes` exception: Skeleton shimmer and Spinner rotation — infinite looping micro-animations where GSAP is overkill
- Import GSAP presets from `lib/animations.ts` — do not hardcode easing values
- Always register ScrollTrigger: `gsap.registerPlugin(ScrollTrigger)`
- GSAP animations only animate `transform` and `opacity` — never animate colors directly

### Components
- Always use `cn()` from `lib/utils.ts` for all className merging (never string concatenation)
- Never install shadcn/ui or any external component library — all components are custom
- Icons: Lucide React only
- Images: always `next/image` with explicit width/height or fill + sizes
- Links: always `next/link`

### Forms
- All form inputs share: `bg-surface-raised border border-border rounded text-ink-primary font-body text-sm`
- Focus ring on all inputs: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base`
- Error state: `border-error` replaces default border; helper text turns `text-error`
- Disabled state: `opacity-40 cursor-not-allowed` (matches Button pattern)
- Labels: `text-sm font-body font-medium text-ink-primary mb-1.5` — always above the input
- Helper text: `text-xs font-body text-ink-muted mt-1.5` — below the input; `text-error` on error

### Layout
- Page background: `bg-surface-base` (white)
- Body tag: `bg-surface-base text-ink-primary font-body antialiased`
- Container: `max-w-full px-6 md:px-10 lg:px-16`
- Inner wrapper: `max-w-wide mx-auto` (1080px) or `max-w-content mx-auto` (720px) for text
- Section padding: `py-24` desktop, `py-16` mobile
- No `dark` class on html — light theme only

### Borders & Radius
- Hero images and large media: always `rounded-none` (sharp edges, editorial)
- Cards, modals, drawers, dropdowns: `rounded-xl`
- Buttons, inputs, selects, textareas: `rounded` (4px, subtle)
- Badges, pills, avatars: `rounded-full`
- Never add drop shadows to text — use contrast instead
- Default border color: `border-border` (#E0E0E0)

---

## Component patterns to always follow

### Button
```tsx
// Primary (black) — one per screen, main CTA
<button className={cn(
  "bg-acid text-ink-inverse font-body font-medium text-sm px-5 py-2.5 rounded",
  "hover:bg-acid-dim focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
  "disabled:opacity-40 disabled:cursor-not-allowed"
)}>

// Secondary (gray) — secondary CTAs
<button className={cn(
  "bg-mist text-ink-inverse font-body font-medium text-sm px-5 py-2.5 rounded",
  "hover:bg-mist-dim focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-mist focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
  "disabled:opacity-40 disabled:cursor-not-allowed"
)}>

// Ghost — tertiary actions
<button className={cn(
  "bg-transparent text-ink-secondary font-body text-sm px-5 py-2.5 rounded",
  "border border-transparent hover:border-border hover:text-ink-primary",
  "focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2",
  "focus-visible:ring-offset-surface-base transition-colors duration-fast"
)}>
```

### Card
```tsx
<div className="bg-surface-raised rounded-xl border border-border p-6">
// Interactive card adds:
// hover:border-border-strong hover:shadow-md transition-all duration-DEFAULT
// Featured card adds:
// border-border-accent shadow-md
```

### Section structure
```tsx
<section className="py-24">
  <div className="max-w-full px-6 md:px-10 lg:px-16">
    <div className="max-w-wide mx-auto">
      {/* eyebrow */}
      <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-4">
        SECTION LABEL
      </p>
      {/* heading */}
      <h2 className="font-display font-bold text-5xl tracking-tight text-ink-primary">
        Section Title
      </h2>
    </div>
  </div>
</section>
```

---

## What to do when unsure
1. Check `globals.css` for available tokens
2. Default to MORE whitespace, not less
3. Default to NO color, not more color — monochrome only
4. Default to sharp corners for images, soft corners for UI elements
5. If a new component needs a color not in the system — ask, don't invent
