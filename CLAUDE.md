# CLAUDE.md / .cursorrules
# Design System — Portfolio Review AI Tool
# Read this entire file before writing any UI code.

## What this project is
A **design system and component library** for the Portfolio Review AI tool.
This is NOT the product app — it's the living reference for every token, component, and pattern. Think Storybook: a browsable showcase where each component is displayed with all its variants, states, and usage examples. Other projects consume components from here.

Stack: Next.js 14 (App Router) + Tailwind CSS + GSAP + TypeScript.

### Project structure
```
src/
├── app/                    # DS showcase pages (the "Storybook")
│   ├── page.tsx            # Overview — tokens, colors, typography at a glance
│   └── components/
│       └── [slug]/page.tsx # One page per component
├── components/             # The actual reusable components (the library)
├── hooks/                  # Reusable GSAP hooks
└── lib/                    # Utilities, animation presets, tokens
```

### Showcase page conventions
- Every component gets its own route: `/components/button`, `/components/card`, etc.
- Each showcase page shows: component name, description, all variants, interactive states (hover, focus, disabled), and code snippet
- Use a consistent layout: sidebar nav + main content area
- Showcase pages use a `<ComponentPreview>` wrapper that renders the component on a `surface-raised` stage with a label

---

## Non-negotiable rules

### Colors
- NEVER use #000, #fff, or any hardcoded hex values
- ALL colors come from Tailwind tokens defined in `globals.css`
- Surface scale: surface-base → surface-raised → surface-overlay → surface-subtle
- Text scale: ink-primary → ink-secondary → ink-muted
- Primary accent: `acid` (#C8FF00) — for the single most important action/element per screen
- Secondary accent: `mist` (#A78BFA) — a soft lavender for secondary CTAs, links, active states, and UI elements that need distinction from acid without competing for attention
- Never use acid for decoration, only for the primary interactive/highlighted element
- Use mist for: secondary buttons, link hover states, active tab indicators (when acid is already used), breadcrumb active state, toggle tracks, or any element that needs color but isn't the primary action
- Status colors exist for feedback: `error`, `success`, `warning` — use only in status contexts

### Brand color tokens (add to globals.css)
```
--color-acid: #C8FF00;
--color-acid-dim: #B0E000;
--color-mist: #A78BFA;
--color-mist-dim: #8B5CF6;
```

### Status color tokens (add to globals.css)
```
--color-error: #EF4444;
--color-error-dim: #DC2626;
--color-success: #22C55E;
--color-success-dim: #16A34A;
--color-warning: #F59E0B;
--color-warning-dim: #D97706;
```

### Typography
- Headings (h1–h4, display text): always `font-display` (Syne), `tracking-tight` or tighter
- Body copy, labels, buttons: always `font-body` (Inter)
- Code: always `font-mono` (JetBrains Mono)
- Never use font-display for body copy
- Never use font-bold on paragraph text
- Eyebrow labels above sections: `text-xs font-body font-medium tracking-widest uppercase text-acid`

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
- Page background: `bg-surface-base`
- Body tag: `bg-surface-base text-ink-primary font-body antialiased`
- Container: `max-w-full px-6 md:px-10 lg:px-16`
- Inner wrapper: `max-w-wide mx-auto` (1080px) or `max-w-content mx-auto` (720px) for text
- Section padding: `py-24` desktop, `py-16` mobile
- html tag always has `class="dark"`

### Borders & Radius
- Hero images and large media: always `rounded-none` (sharp edges, editorial)
- Cards, modals, drawers, dropdowns: `rounded-xl`
- Buttons, inputs, selects, textareas: `rounded` (4px, subtle)
- Badges, pills, avatars: `rounded-full`
- Never add drop shadows to text — use contrast instead
- Default border color: `border-border` (#2A2A2A)

---

## Component patterns to always follow

### Button
```tsx
// Primary (acid) — one per screen, main CTA
<button className={cn(
  "bg-acid text-ink-inverse font-body font-medium text-sm px-5 py-2.5 rounded",
  "hover:bg-acid-dim focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
  "disabled:opacity-40 disabled:cursor-not-allowed"
)}>

// Secondary (mist) — secondary CTAs, complementary actions
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
// border-border-accent shadow-glow
```

### Input
```tsx
// Default
<div>
  <label className="block text-sm font-body font-medium text-ink-primary mb-1.5">
    Label
  </label>
  <input className={cn(
    "w-full bg-surface-raised border border-border rounded px-3.5 py-2.5",
    "text-sm font-body text-ink-primary placeholder:text-ink-muted",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    "disabled:opacity-40 disabled:cursor-not-allowed"
  )} />
  <p className="text-xs font-body text-ink-muted mt-1.5">Helper text</p>
</div>

// Error state: replace border-border with border-error
// Helper text becomes: text-error
```

### Textarea
```tsx
// Same styling as Input but with:
// min-h-[100px] resize-y
<textarea className={cn(
  "w-full bg-surface-raised border border-border rounded px-3.5 py-2.5",
  "text-sm font-body text-ink-primary placeholder:text-ink-muted",
  "min-h-[100px] resize-y",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
  "disabled:opacity-40 disabled:cursor-not-allowed"
)} />
```

### FileUpload
```tsx
// Idle state
<div className={cn(
  "border-2 border-dashed border-border rounded-xl p-10 text-center",
  "hover:border-border-strong transition-colors duration-fast cursor-pointer"
)}>
  <Upload className="w-8 h-8 text-ink-muted mx-auto mb-3" />
  <p className="text-sm text-ink-secondary">Drop your portfolio here</p>
  <p className="text-xs text-ink-muted mt-1">PDF, PNG, or URL</p>
</div>

// Dragover: border-acid bg-acid/5
// Uploading: show Spinner + progress text
// Success: border-success, show check icon
// Error: border-error, show error message
```

### Select
```tsx
// Wrapper with Lucide ChevronDown
<div className="relative">
  <select className={cn(
    "w-full appearance-none bg-surface-raised border border-border rounded",
    "px-3.5 py-2.5 pr-10 text-sm font-body text-ink-primary",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    "disabled:opacity-40 disabled:cursor-not-allowed"
  )}>
    <option>Option</option>
  </select>
  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
</div>
```

### Toggle
```tsx
// Container: w-10 h-6 rounded-full, bg-surface-subtle (off) / bg-mist (on)
// Thumb: w-4 h-4 rounded-full bg-ink-primary, translate-x-0 (off) / translate-x-4 (on)
// Transition: CSS transition-all duration-fast (simple state swap)
// Disabled: opacity-40 cursor-not-allowed
```

### Badge
```tsx
// Default (muted)
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium bg-surface-subtle text-ink-secondary">

// Accent (acid)
<span className="... bg-acid/10 text-acid">

// Accent (mist) — for secondary categorization
<span className="... bg-mist/10 text-mist">

// Status variants — use status token colors:
// Success: bg-success/10 text-success
// Warning: bg-warning/10 text-warning
// Error: bg-error/10 text-error
```

### Score
```tsx
// Ring variant — circular score display
// Outer ring: w-16 h-16, stroke-border (track) + stroke-acid (fill, dasharray based on score)
// Center: font-display font-bold text-lg text-ink-primary
// Label below: text-xs text-ink-muted

// Bar variant — horizontal score bar
// Track: h-2 w-full bg-surface-subtle rounded-full
// Fill: h-2 bg-acid rounded-full, width = score %
// Color coding: score >= 7 → acid, 4–6 → warning, < 4 → error
```

### ProgressBar
```tsx
// Determinate
<div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden">
  <div className="h-full bg-acid rounded-full transition-all duration-DEFAULT"
       style={{ width: `${percent}%` }} />
</div>

// Indeterminate: CSS @keyframes slide animation (exception to GSAP rule)
// Accent variant: bg-acid fill
```

### Accordion
```tsx
// Trigger: flex justify-between items-center w-full py-4 border-b border-border
// Label: text-sm font-body font-medium text-ink-primary
// Icon: Lucide ChevronDown, rotate-180 when open (CSS transition-transform duration-fast)
// Content panel: GSAP height tween (0 → auto) on open/close
// Single mode: one panel open at a time
// Multiple mode: any panels can be open
```

### Avatar
```tsx
// Base: rounded-full overflow-hidden bg-surface-subtle flex items-center justify-center
// Sizes: sm (w-8 h-8), md (w-10 h-10), lg (w-14 h-14)
// Image: next/image fill + sizes, object-cover
// Fallback: font-body font-medium text-ink-secondary, sized to match variant
```

### Divider
```tsx
// Horizontal
<div className="h-px bg-border w-full" />

// Vertical
<div className="w-px bg-border h-full" />

// With label
<div className="flex items-center gap-3">
  <div className="h-px bg-border flex-1" />
  <span className="text-xs font-body text-ink-muted">OR</span>
  <div className="h-px bg-border flex-1" />
</div>
```

### Toast
```tsx
// Base: fixed bottom-6 right-6 z-40, bg-surface-overlay border border-border rounded-xl p-4
// Layout: flex items-start gap-3, with icon + text + close button
// Animation: GSAP slide-in from bottom (y: 16, opacity: 0) on mount, reverse on dismiss
// Auto-dismiss: 5s default, configurable
// Status variants:
//   info: default (no accent)
//   success: left border-success, Lucide CheckCircle icon text-success
//   warning: left border-warning, Lucide AlertTriangle icon text-warning
//   error: left border-error, Lucide XCircle icon text-error
// Close button: Lucide X, text-ink-muted hover:text-ink-primary
```

### Skeleton
```tsx
// Base: bg-surface-subtle rounded animate-pulse
// CSS @keyframes pulse exception — infinite shimmer loop
// Variants:
//   text: h-4 w-full rounded (multiple lines with varying widths)
//   circle: w-10 h-10 rounded-full
//   card: h-48 w-full rounded-xl
//   custom: accept className for arbitrary shapes
```

### Spinner
```tsx
// CSS @keyframes spin exception — infinite rotation
// Base: border-2 border-surface-subtle border-t-acid rounded-full animate-spin
// Sizes: sm (w-4 h-4), md (w-6 h-6), lg (w-8 h-8)
```

### Alert
```tsx
// Base: bg-surface-raised border rounded-xl p-4 flex items-start gap-3
// Dismissible: add Lucide X close button at top-right
// Status variants (same pattern as Toast):
//   info: border-border, Lucide Info icon text-ink-secondary
//   success: border-success, Lucide CheckCircle icon text-success
//   warning: border-warning, Lucide AlertTriangle icon text-warning
//   error: border-error, Lucide XCircle icon text-error
// Title: text-sm font-body font-medium text-ink-primary
// Description: text-sm font-body text-ink-secondary
```

### EmptyState
```tsx
// Centered layout: text-center py-16
// Icon: Lucide icon, w-10 h-10 text-ink-muted mx-auto mb-4
// Heading: font-display font-semibold text-lg tracking-tight text-ink-primary mb-2
// Description: text-sm text-ink-secondary mb-6 max-w-sm mx-auto
// Optional CTA: <Button variant="primary"> or <Button variant="ghost">
```

### Modal
```tsx
// Backdrop: fixed inset-0 z-40 bg-surface-base/80
// Animation: GSAP fade backdrop (opacity: 0→0.8) + scale panel (scale: 0.95→1, opacity: 0→1)
// Panel: bg-surface-overlay border border-border rounded-xl p-6
// Sizes: sm (max-w-sm), md (max-w-md), lg (max-w-lg) — all mx-auto centered
// Close button: absolute top-4 right-4, Lucide X, text-ink-muted hover:text-ink-primary
// Header: font-display font-semibold text-lg tracking-tight mb-4
// Focus trap: trap focus within modal when open
// Close on: backdrop click, Escape key, close button
```

### Tabs
```tsx
// Tab list: flex border-b border-border gap-0
// Tab trigger: px-4 py-2.5 text-sm font-body font-medium text-ink-muted
//   Active: text-ink-primary border-b-2 border-acid -mb-px
//   Hover: text-ink-secondary
// Tab content: pt-6
// No GSAP needed — simple CSS border/color transition-colors duration-fast
```

### Tooltip
```tsx
// Trigger: inline wrapper, shows tooltip on hover/focus
// Content: absolute z-30 bg-surface-overlay border border-border rounded px-3 py-1.5
//   text-xs font-body text-ink-secondary, whitespace-nowrap
// Arrow: 4px rotated square matching bg-surface-overlay
// Placement: top (default), bottom, left, right
// Animation: GSAP fade + slight translate (y: 4 → 0 for top)
// Show delay: 200ms; hide immediately
```

### Drawer
```tsx
// Backdrop: fixed inset-0 z-40 bg-surface-base/80 (same as Modal)
// Panel: fixed top-0 bottom-0 z-40 bg-surface-overlay border-l border-border w-80 md:w-96 p-6
//   Right (default): right-0, slides in from right
//   Left: left-0, border-r instead, slides in from left
// Animation: GSAP translateX (100% → 0 for right, -100% → 0 for left) + backdrop fade
// Close on: backdrop click, Escape key, close button
// Close button: Lucide X at top-right
```

### Breadcrumb
```tsx
// Container: flex items-center gap-1.5
// Item: text-sm font-body text-ink-muted hover:text-ink-secondary
// Active (last item): text-ink-primary, no hover, not a link
// Separator: Lucide ChevronRight, w-3.5 h-3.5 text-ink-muted
```

### Section structure
```tsx
<section className="py-24">
  <div className="max-w-full px-6 md:px-10 lg:px-16">
    <div className="max-w-wide mx-auto">
      {/* eyebrow */}
      <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
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

### GSAP scroll reveal pattern
```tsx
import { useReveal } from "@/hooks/useReveal"
const ref = useRef(null)
useReveal(ref)
return <div ref={ref}>...</div>
```

### MagneticButton pattern
```tsx
import { useMagnet } from "@/hooks/useMagnet"
const ref = useRef(null)
useMagnet(ref, { strength: 0.4 })
return <div ref={ref}><Button>...</Button></div>
```

### TextReveal pattern
```tsx
<div className="overflow-hidden">
  <TextReveal>
    <h1 className="font-display font-black text-8xl tracking-tightest">
      Headline Here
    </h1>
  </TextReveal>
</div>
```

---

## Component inventory

### Existing (built)
- Button (primary, secondary, ghost)
- Card (default, interactive, featured)
- Section (eyebrow, heading, narrow)
- TextReveal (delay)
- MagneticButton (strength)

### To build
**Forms:** Input, Textarea, FileUpload, Select, Toggle
**Feedback:** Badge, Score, ProgressBar, Accordion, Avatar, Divider
**Status:** Toast, Skeleton, Spinner, Alert, EmptyState
**Overlays & Nav:** Modal, Tabs, Tooltip, Drawer, Breadcrumb

---

## Noise overlay (global)
Add once in `app/layout.tsx`:
```tsx
<div
  aria-hidden="true"
  className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
  style={{ backgroundImage: "url('/noise.png')" }}
/>
```

---

## What to do when unsure
1. Check `globals.css` for available tokens
2. Default to MORE whitespace, not less
3. Default to NO color, not more color
4. Default to sharp corners for images, soft corners for UI elements
5. If a new component needs a color not in the system — ask, don't invent
