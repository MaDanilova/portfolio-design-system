# Landing Page Spec
# Portfolio Review AI — Marketing / Conversion Page
# All components reference the design system in CLAUDE.md

---

## Purpose
Convert visiting designers into users. Single-page, scroll-driven layout. No auth required to start — the CTA leads directly to the upload flow.

---

## Dependencies
- `three` (Three.js) — WebGL renderer
- `@react-three/fiber` — React bindings for Three.js
- `@react-three/drei` — helpers (optional, only if needed for shaders)

---

## Page structure (top → bottom)

### 1. Navigation Bar
- Fixed top, `bg-surface-base/90 backdrop-blur-md border-b border-border z-30`
- Left: Logo mark + "Portfolio Review" — `font-display font-bold text-sm tracking-tight`
- Right: `Button ghost` "How It Works" (anchor scroll) + `Button primary` "Get Your Review"
- Mobile: hamburger icon (Lucide Menu), opens Drawer from right

### 2. Hero (with WebGL background)
- Full viewport height: `min-h-screen flex items-center relative`
- **WebGL canvas** sits behind all hero content (see WebGL section below)
- Eyebrow: `AI PORTFOLIO REVIEW`
- Heading (TextReveal): `font-display font-black text-6xl md:text-8xl tracking-tightest`
  - Line 1: "Your portfolio,"
  - Line 2: "reviewed by AI."
- Subheading (TextReveal delay 0.15): `text-lg md:text-xl text-ink-secondary max-w-content`
  - "Upload your design portfolio and get structured, actionable feedback on layout, hierarchy, storytelling, and presentation — in seconds."
- CTA row (TextReveal delay 0.3):
  - `MagneticButton` → `Button primary` "Get Your Review"
  - `Button ghost` "See how it works"
- No image in hero — editorial, text-first. The WebGL noise is the visual interest.

### 3. Trust Strip
- `py-8 border-y border-border`
- Row of 4–6 muted logos or text: "Trusted by designers from" + company names
- `text-xs text-ink-muted tracking-widest uppercase`
- Logos: `opacity-40 grayscale` (keep minimal, don't distract)

### 4. How It Works
- `Section` with eyebrow "HOW IT WORKS" + heading "Four steps to a stronger portfolio."
- 2×2 grid of `Card interactive`:
  - **Upload** — Lucide Upload icon, title, description
  - **Analyze** — Lucide Sparkles icon, title, description
  - **Score** — Lucide BarChart3 icon, title, description
  - **Improve** — Lucide MessageSquare icon, title, description
- Each card uses `useReveal` with staggered delays (0, 0.1, 0.2, 0.3)
- Icons: `w-5 h-5 text-acid mb-4`

### 5. Sample Review Preview
- `Section` with eyebrow "SEE IT IN ACTION" + heading "What your review looks like."
- Left side (60%): Mock review card stack
  - `Card featured` (top): Score ring showing 7.8/10 + category badges
    - Badges: `Badge accent(acid)` "Layout" + `Badge accent(mist)` "Typography" + `Badge default` "Hierarchy"
  - Below: 2–3 `Card default` showing sample feedback lines
    - Each with a `Score bar` + one-line feedback text
- Right side (40%): Bullet list of what's included
  - Checkmark (Lucide Check, `text-success`) + label per line
  - "Page-by-page analysis", "Visual hierarchy scoring", "Typography audit", "Storytelling assessment", "Actionable next steps"
- Use `useReveal` on each element

### 6. Testimonials
- `Section` with eyebrow "WHAT DESIGNERS SAY" + heading "Real feedback on real feedback."
- 3-column grid (stack on mobile): `Card default` each containing:
  - Quote text: `text-sm text-ink-secondary italic` (2–3 sentences)
  - `Divider horizontal` below quote
  - `Avatar sm` + name (`text-sm text-ink-primary font-medium`) + role (`text-xs text-ink-muted`)
- Staggered `useReveal`

### 7. Pricing / Value
- `Section narrow` with eyebrow "PRICING" + heading "Start for free."
- Single centered `Card featured`:
  - Price: `font-display font-bold text-4xl` "Free" + `text-ink-muted text-sm` "for your first review"
  - `Divider with label` "INCLUDES"
  - Feature list: 5–6 items with Lucide Check icons
  - `Button primary` "Get Your Free Review" (full width)
- Below card: `text-xs text-ink-muted text-center` "No account required. Your portfolio is never stored."

### 8. Final CTA
- `Section narrow`, `text-center`
- Heading: `font-display font-bold text-4xl md:text-5xl` "Ready to level up?"
- Subtext: `text-ink-secondary text-lg` "Get your portfolio reviewed in under a minute."
- `MagneticButton` → `Button primary` "Review My Portfolio"

### 9. Footer
- `border-t border-border py-12`
- `max-w-wide mx-auto`
- Left: "Portfolio Review Tool — Built for designers." `text-xs text-ink-muted`
- Right: Year + links (Privacy, Terms) `text-xs text-ink-muted`

---

## WebGL — Hero Noise Distortion

### Concept
A full-screen fragment shader behind the hero that creates a living, breathing noise field. Think: light surface with subtle ridges of black and gray peeking through. Reacts to mouse position and fades out as the user scrolls past the hero.

### Technical spec

**Component:** `HeroCanvas`
- `"use client"` — client component
- Uses `@react-three/fiber` `<Canvas>` with a fullscreen quad (plane geometry filling the viewport)
- Canvas is `absolute inset-0 z-0` behind hero content (hero text is `relative z-10`)
- `pointer-events-none` on the canvas — don't block text interaction

**Shader: `heroNoise.glsl`**
- Fragment shader on a `ShaderMaterial` applied to a fullscreen plane
- Uniforms:
  - `uTime` (float) — elapsed time, drives noise evolution
  - `uMouse` (vec2) — normalized mouse position (0–1), creates local distortion around cursor
  - `uResolution` (vec2) — viewport dimensions
  - `uScrollProgress` (float) — 0 at top, 1 when hero is fully scrolled past → controls fade-out
  - `uColorAcid` (vec3) — acid #0E0E0E (black) as RGB
  - `uColorMist` (vec3) — mist #6B6B6B (gray) as RGB
  - `uColorBase` (vec3) — surface-base #FFFFFF (white) as RGB

**Visual behavior:**
- Base: light noise field matching `surface-base` (white) — barely visible at rest
- Noise type: layered simplex noise (2–3 octaves), slow drift (`uTime * 0.15`)
- Color mapping: noise value drives mix between base → acid (peaks) and base → mist (valleys)
  - Most of the canvas stays near base color (white) — only ridges/peaks show color
  - Acid (black) appears on high noise values (dark ridges)
  - Mist (gray) appears on mid-range values (subtle fills between ridges)
  - Overall intensity is LOW — `mix(base, color, noiseValue * 0.15)` — this is background, not a light show
- Mouse interaction:
  - Within ~200px radius of cursor: noise amplitude increases slightly, creating a gentle ripple/warp
  - Effect: `noiseValue += smoothstep(200.0, 0.0, dist) * 0.1`
  - Smooth GSAP lerp on mouse position (don't track raw — ease toward target)
- Scroll fade-out:
  - As `uScrollProgress` goes 0→1, multiply final color opacity by `1.0 - uScrollProgress`
  - Canvas becomes invisible by the time hero is scrolled away
  - Use GSAP ScrollTrigger to feed scroll progress to the uniform

**Performance:**
- Render at 0.75x DPR (`dpr={[1, 1.5]}` on Canvas) — noise doesn't need retina precision
- Use `frameloop="always"` but consider `frameloop="demand"` + invalidate on mouse/scroll only if perf is a concern
- No post-processing passes — single shader, single draw call
- Mobile: reduce to 0.5x DPR, simplify to 1 octave of noise
- Respect `prefers-reduced-motion`: if enabled, freeze noise at a static frame (set uTime to a constant, disable mouse reactivity)

**Fade-in on load:**
- Canvas starts at `opacity: 0`
- After hero TextReveal completes (~0.8s), GSAP fades canvas to `opacity: 1` over 1.2s
- This prevents the shader from appearing before the text, keeping the editorial reveal sequence clean

### File structure
```
src/
├── components/
│   └── HeroCanvas.tsx      # React component wrapping Canvas + shader
├── shaders/
│   ├── heroNoise.vert      # Simple passthrough vertex shader
│   └── heroNoise.frag      # Noise distortion fragment shader
└── lib/
    └── noise.glsl          # Reusable simplex noise function (imported in frag)
```

### Integration with hero
```tsx
<section className="min-h-screen flex items-center relative">
  {/* WebGL background */}
  <HeroCanvas />

  {/* Content on top */}
  <div className="relative z-10 max-w-full px-6 md:px-10 lg:px-16">
    <div className="max-w-wide mx-auto">
      {/* eyebrow, heading, subheading, CTAs */}
    </div>
  </div>
</section>
```

### Design rules for WebGL
- WebGL is NEVER the focal point — it's atmospheric background only
- Colors MUST come from the design system tokens (acid, mist, surface-base)
- Intensity stays LOW — if you can't read the text comfortably, it's too bright
- No additional colors, no rainbow effects, no heavy glow
- Mouse effect is subtle — enhance, don't distract
- Scroll fade-out is mandatory — WebGL lives in the hero only
- Falls back gracefully: if WebGL not supported, hero renders as plain `bg-surface-base` (no broken state)

---

## Animation sequence

| Element | Animation | Trigger |
|---------|-----------|---------|
| Nav | Fade in | Page load, 0.3s delay |
| Hero eyebrow | fadeIn | Page load |
| Hero heading | TextReveal (line by line) | Page load |
| Hero subheading | TextReveal delay 0.15 | Page load |
| Hero CTAs | TextReveal delay 0.3 | Page load |
| Hero WebGL canvas | GSAP opacity 0→1 over 1.2s | After TextReveal completes (~0.8s) |
| Hero WebGL canvas | Opacity → 0 via uScrollProgress | Scroll past hero |
| Trust strip logos | fadeIn staggered | Scroll into view |
| How It Works cards | useReveal staggered | Scroll into view |
| Sample Review cards | useReveal + slideLeft for right column | Scroll into view |
| Testimonials | useReveal staggered | Scroll into view |
| Pricing card | useReveal | Scroll into view |
| Final CTA | TextReveal | Scroll into view |

---

## Responsive breakpoints

| Section | Mobile (< 768px) | Desktop (≥ 768px) |
|---------|-------------------|---------------------|
| Nav | Hamburger → Drawer | Full links visible |
| Hero heading | text-5xl | text-8xl |
| How It Works | 1 column | 2×2 grid |
| Sample Review | Stacked (full width) | 60/40 split |
| Testimonials | 1 column | 3 columns |
| Pricing | Full width card | max-w-sm centered |

---

## Components used from DS
Button (primary, secondary, ghost), Card (default, interactive, featured), Section, TextReveal, MagneticButton, Badge (default, accent acid, accent mist), Score (ring, bar), Divider (horizontal, with label), Avatar (sm), Drawer (mobile nav)

## Additional dependencies (landing only)
- `three` — WebGL renderer
- `@react-three/fiber` — React Three.js bindings
- `HeroCanvas` component + GLSL shaders (not part of core DS — landing-page-specific)
