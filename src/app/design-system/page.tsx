const surfaceColors = [
  { name: "surface-base", hex: "#FFFFFF" },
  { name: "surface-raised", hex: "#F7F7F7" },
  { name: "surface-overlay", hex: "#FFFFFF" },
  { name: "surface-subtle", hex: "#EBEBEB" },
];

const brandColors = [
  { name: "acid", hex: "#0E0E0E", role: "Primary accent / CTA" },
  { name: "acid-dim", hex: "#333333", role: "Primary hover" },
  { name: "mist", hex: "#6B6B6B", role: "Secondary accent" },
  { name: "mist-dim", hex: "#555555", role: "Secondary hover" },
];

const statusColors = [
  { name: "success", hex: "#15803D" },
  { name: "success-dim", hex: "#166534" },
  { name: "warning", hex: "#A16207" },
  { name: "warning-dim", hex: "#854D0E" },
  { name: "error", hex: "#DC2626" },
  { name: "error-dim", hex: "#B91C1C" },
];

const textColors = [
  { name: "ink-primary", hex: "#0E0E0E" },
  { name: "ink-secondary", hex: "#6B6B6B" },
  { name: "ink-muted", hex: "#767676" },
  { name: "ink-inverse", hex: "#FFFFFF" },
];

const borderColors = [
  { name: "border", hex: "#E0E0E0" },
  { name: "border-strong", hex: "#CCCCCC" },
  { name: "border-accent", hex: "#0E0E0E" },
];

export default function OverviewPage() {
  return (
    <>
      <div className="mb-16">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mb-3">
          OVERVIEW
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Design System
        </h1>
        <p className="text-ink-secondary text-lg max-w-content leading-relaxed">
          Tokens, colors, typography, and components for the Portfolio Review AI
          tool. Every element on this page is built from the system.
        </p>
      </div>

      {/* Surfaces */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl tracking-tight text-ink-primary mb-6">
          Surface Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {surfaceColors.map((c) => (
            <div key={c.name}>
              <div
                className="h-20 rounded-xl border border-border mb-3"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-sm text-ink-primary font-medium">{c.name}</p>
              <p className="text-xs font-mono text-ink-muted">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Colors */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl tracking-tight text-ink-primary mb-6">
          Brand Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {brandColors.map((c) => (
            <div key={c.name}>
              <div
                className="h-20 rounded-xl border border-border mb-3"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-sm text-ink-primary font-medium">{c.name}</p>
              <p className="text-xs font-mono text-ink-muted">{c.hex}</p>
              <p className="text-xs text-ink-muted">{c.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Status Colors */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl tracking-tight text-ink-primary mb-6">
          Status Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statusColors.map((c) => (
            <div key={c.name}>
              <div
                className="h-16 rounded-xl border border-border mb-3"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-sm text-ink-primary font-medium">{c.name}</p>
              <p className="text-xs font-mono text-ink-muted">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Text Colors */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl tracking-tight text-ink-primary mb-6">
          Text Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {textColors.map((c) => (
            <div
              key={c.name}
              className="bg-surface-raised border border-border rounded-xl p-5"
            >
              <p className="text-lg font-medium mb-2" style={{ color: c.hex }}>
                Aa
              </p>
              <p className="text-sm text-ink-primary font-medium">{c.name}</p>
              <p className="text-xs font-mono text-ink-muted">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Border Colors */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl tracking-tight text-ink-primary mb-6">
          Border Colors
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {borderColors.map((c) => (
            <div key={c.name}>
              <div
                className="h-16 rounded-xl mb-3"
                style={{ border: `2px solid ${c.hex}` }}
              />
              <p className="text-sm text-ink-primary font-medium">{c.name}</p>
              <p className="text-xs font-mono text-ink-muted">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl tracking-tight text-ink-primary mb-6">
          Typography
        </h2>
        <div className="space-y-8">
          <div className="bg-surface-raised border border-border rounded-xl p-8">
            <p className="text-xs font-mono text-ink-muted mb-4">
              Inter — All text (display + body)
            </p>
            <p className="font-display font-black text-5xl tracking-tightest text-ink-primary">
              Display Heading
            </p>
            <p className="font-display font-bold text-3xl tracking-tight text-ink-primary mt-2">
              Section Heading
            </p>
            <p className="font-display font-semibold text-xl tracking-tight text-ink-primary mt-2">
              Subsection Heading
            </p>
          </div>
          <div className="bg-surface-raised border border-border rounded-xl p-8">
            <p className="text-xs font-mono text-ink-muted mb-4">
              Inter — Body, labels, buttons
            </p>
            <p className="font-body text-base text-ink-primary">
              Body text at base size. Used for paragraphs and general content.
            </p>
            <p className="font-body text-sm text-ink-secondary mt-2">
              Small text in secondary color. Used for descriptions.
            </p>
            <p className="text-xs font-body font-medium tracking-widest uppercase text-ink-muted mt-4">
              EYEBROW LABEL
            </p>
          </div>
          <div className="bg-surface-raised border border-border rounded-xl p-8">
            <p className="text-xs font-mono text-ink-muted mb-4">
              JetBrains Mono — Code
            </p>
            <p className="font-mono text-sm text-ink-secondary">
              const review = await analyzePortfolio(url);
            </p>
          </div>
        </div>
      </section>

      {/* Border Radius */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl tracking-tight text-ink-primary mb-6">
          Border Radius
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "rounded-none", desc: "Hero images", className: "rounded-none" },
            { label: "rounded", desc: "Buttons, inputs", className: "rounded" },
            { label: "rounded-xl", desc: "Cards, modals", className: "rounded-xl" },
            { label: "rounded-full", desc: "Badges, avatars", className: "rounded-full" },
          ].map((r) => (
            <div key={r.label} className="text-center">
              <div
                className={`h-20 w-full bg-surface-subtle border border-border mb-3 ${r.className}`}
              />
              <p className="text-sm text-ink-primary font-medium">{r.label}</p>
              <p className="text-xs text-ink-muted">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Textures */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl tracking-tight text-ink-primary mb-6">
          Textures
        </h2>
        <p className="text-sm text-ink-secondary mb-6">
          CSS-only background patterns used as section backgrounds and dividers. Apply with a single utility class.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "bg-dots", desc: "Dotted paper — trust strips, CTAs" },
            { label: "bg-diagonal", desc: "Diagonal lines — testimonials, quotes" },
          ].map((t) => (
            <div key={t.label}>
              <div
                className={`h-32 rounded-xl border border-border mb-3 ${t.label}`}
              />
              <p className="text-sm text-ink-primary font-medium font-mono">{t.label}</p>
              <p className="text-xs text-ink-muted">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
