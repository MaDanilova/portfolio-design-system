const surfaceColors = [
  { name: "surface-base", hex: "#0E0E0E" },
  { name: "surface-raised", hex: "#161616" },
  { name: "surface-overlay", hex: "#1E1E1E" },
  { name: "surface-subtle", hex: "#252525" },
];

const brandColors = [
  { name: "acid", hex: "#C8FF00", role: "Primary accent" },
  { name: "acid-dim", hex: "#B0E000", role: "Primary hover" },
  { name: "mist", hex: "#A78BFA", role: "Secondary accent" },
  { name: "mist-dim", hex: "#8B5CF6", role: "Secondary hover" },
];

const statusColors = [
  { name: "success", hex: "#22C55E" },
  { name: "success-dim", hex: "#16A34A" },
  { name: "warning", hex: "#F59E0B" },
  { name: "warning-dim", hex: "#D97706" },
  { name: "error", hex: "#EF4444" },
  { name: "error-dim", hex: "#DC2626" },
];

const textColors = [
  { name: "ink-primary", hex: "#F0F0F0" },
  { name: "ink-secondary", hex: "#A0A0A0" },
  { name: "ink-muted", hex: "#666666" },
  { name: "ink-inverse", hex: "#0E0E0E" },
];

const borderColors = [
  { name: "border", hex: "#2A2A2A" },
  { name: "border-strong", hex: "#3A3A3A" },
  { name: "border-accent", hex: "#C8FF00" },
];

export default function OverviewPage() {
  return (
    <>
      <div className="mb-16">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
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
              font-display (Syne) — Headings only
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
              font-body (Inter) — Body, labels, buttons
            </p>
            <p className="font-body text-base text-ink-primary">
              Body text at base size. Used for paragraphs and general content.
            </p>
            <p className="font-body text-sm text-ink-secondary mt-2">
              Small text in secondary color. Used for descriptions.
            </p>
            <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mt-4">
              EYEBROW LABEL
            </p>
          </div>
          <div className="bg-surface-raised border border-border rounded-xl p-8">
            <p className="text-xs font-mono text-ink-muted mb-4">
              font-mono (JetBrains Mono) — Code
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
                className={`h-20 w-full bg-surface-overlay border border-border mb-3 ${r.className}`}
              />
              <p className="text-sm text-ink-primary font-medium">{r.label}</p>
              <p className="text-xs text-ink-muted">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
