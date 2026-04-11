"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Upload,
  Sparkles,
  BarChart3,
  MessageSquare,
  Check,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Score } from "@/components/Score";
import { Divider } from "@/components/Divider";
import { Avatar } from "@/components/Avatar";
import { Drawer } from "@/components/Drawer";
import { Section } from "@/components/Section";
import { TextReveal } from "@/components/TextReveal";
import { MagneticButton } from "@/components/MagneticButton";
import { HeroCanvas } from "@/components/HeroCanvas";
import { useReveal } from "@/hooks/useReveal";

// ─── Reveal wrapper ────────────────────────────────────────
function Reveal({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { delay });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drop your portfolio PDF or images. We analyze every page in seconds.",
  },
  {
    icon: Sparkles,
    title: "Analyze",
    description: "Our AI examines layout, hierarchy, typography, storytelling, and presentation.",
  },
  {
    icon: BarChart3,
    title: "Score",
    description: "Get a structured score across 9 dimensions with page-by-page breakdowns.",
  },
  {
    icon: MessageSquare,
    title: "Improve",
    description: "Receive actionable, specific feedback you can apply to your next iteration.",
  },
];

const features = [
  "Page-by-page analysis",
  "Visual hierarchy scoring",
  "Typography audit",
  "Storytelling assessment",
  "Actionable next steps",
];

const testimonials = [
  {
    quote:
      "I was stuck in a loop of self-doubt about my portfolio. The AI review gave me a clear roadmap of what to fix first — typography and hierarchy were my weak spots.",
    name: "Sara Mendez",
    role: "Product Designer",
    initials: "SM",
  },
  {
    quote:
      "What surprised me was how specific the feedback was. Not generic tips — actual observations about my case studies and how I structured the narrative.",
    name: "Liam Chen",
    role: "UX Designer",
    initials: "LC",
  },
  {
    quote:
      "I used this before applying to my dream job. The scoring helped me prioritize which pages needed the most work. Landed the interview.",
    name: "Aisha Patel",
    role: "Visual Designer",
    initials: "AP",
  },
];

const pricingFeatures = [
  "Full 9-dimension analysis",
  "Page-by-page breakdown",
  "Typography & hierarchy audit",
  "Storytelling assessment",
  "Actionable improvement plan",
  "Instant results",
];

const trustCompanies = ["Google", "Spotify", "Figma", "Stripe", "Notion", "Linear"];

// ─── Page ──────────────────────────────────────────────────

export default function LandingPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="bg-surface-base min-h-screen">
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-surface-base/90 backdrop-blur-md border-b border-border">
        <div className="max-w-full px-6 md:px-10 lg:px-16">
          <div className="max-w-wide mx-auto flex items-center justify-between h-14">
            <Link href="/" className="font-display font-bold text-sm tracking-tight text-ink-primary">
              Portfolio Review
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <a href="#how-it-works">How It Works</a>
              </Button>
              <Button variant="primary" asChild>
                <Link href="/register">Get Your Review</Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-ink-secondary hover:text-ink-primary transition-colors duration-fast"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="right" title="Menu">
        <div className="flex flex-col gap-4 mt-4">
          <a
            href="#how-it-works"
            onClick={() => setDrawerOpen(false)}
            className="text-sm font-body text-ink-secondary hover:text-ink-primary transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={() => setDrawerOpen(false)}
            className="text-sm font-body text-ink-secondary hover:text-ink-primary transition-colors"
          >
            Pricing
          </a>
          <Divider />
          <Button variant="primary" asChild>
            <Link href="/register">Get Your Review</Link>
          </Button>
        </div>
      </Drawer>

      {/* ─── Hero ─── */}
      <section className="min-h-screen flex items-center relative pt-14">
        <HeroCanvas />

        <div className="relative z-10 max-w-full px-6 md:px-10 lg:px-16 w-full">
          <div className="max-w-wide mx-auto">
            <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
              AI Portfolio Review
            </p>

            <div className="overflow-hidden">
              <TextReveal>
                <h1 className="font-display font-black text-5xl md:text-8xl tracking-tightest text-ink-primary">
                  Your portfolio,
                </h1>
              </TextReveal>
            </div>
            <div className="overflow-hidden">
              <TextReveal delay={0.1}>
                <h1 className="font-display font-black text-5xl md:text-8xl tracking-tightest text-ink-primary">
                  reviewed by AI.
                </h1>
              </TextReveal>
            </div>

            <div className="overflow-hidden mt-6">
              <TextReveal delay={0.15}>
                <p className="text-lg md:text-xl text-ink-secondary max-w-content">
                  Upload your design portfolio and get structured, actionable feedback on
                  layout, hierarchy, storytelling, and presentation — in seconds.
                </p>
              </TextReveal>
            </div>

            <div className="overflow-hidden mt-8">
              <TextReveal delay={0.3}>
                <div className="flex items-center gap-4">
                  <MagneticButton>
                    <Button variant="primary" asChild>
                      <Link href="/register">Get Your Review</Link>
                    </Button>
                  </MagneticButton>
                  <Button variant="ghost" asChild>
                    <a href="#how-it-works">See how it works</a>
                  </Button>
                </div>
              </TextReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Strip ─── */}
      <section className="py-8 border-y border-border bg-dots">
        <div className="max-w-full px-6 md:px-10 lg:px-16">
          <div className="max-w-wide mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            <span className="text-xs text-ink-muted tracking-widest uppercase">
              Trusted by designers from
            </span>
            {trustCompanies.map((company) => (
              <Reveal key={company} delay={0.05}>
                <span className="text-xs text-ink-muted tracking-widest uppercase opacity-40">
                  {company}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="bg-dots">
        <Section eyebrow="How It Works" heading="Four steps to a stronger portfolio.">
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <Card variant="interactive" className="h-full">
                  <step.icon className="w-5 h-5 text-acid mb-4" />
                  <h3 className="font-display font-semibold text-base tracking-tight text-ink-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink-secondary">{step.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>
      </section>

      {/* ─── Sample Review ─── */}
      <Section eyebrow="See It In Action" heading="What your review looks like.">
        <div className="grid md:grid-cols-5 gap-8 mt-10">
          {/* Left — mock review */}
          <div className="md:col-span-3 space-y-4">
            <Reveal>
              <Card variant="featured">
                <div className="flex items-center gap-6 mb-4">
                  <Score value={7.8} max={10} variant="ring" label="Overall" />
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="acid">Layout</Badge>
                    <Badge variant="mist">Typography</Badge>
                    <Badge>Hierarchy</Badge>
                  </div>
                </div>
                <p className="text-sm text-ink-secondary">
                  Strong visual identity with consistent use of whitespace. Typography
                  hierarchy could be tightened — body text competes with headings on
                  pages 3 and 5.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card>
                <div className="flex items-center gap-4 mb-2">
                  <Score value={8.5} max={10} variant="bar" label="Layout" />
                </div>
                <p className="text-sm text-ink-secondary">
                  Grid system is well-applied. Consistent margins create strong rhythm.
                </p>
              </Card>
            </Reveal>

            <Reveal delay={0.2}>
              <Card>
                <div className="flex items-center gap-4 mb-2">
                  <Score value={6.2} max={10} variant="bar" label="Storytelling" />
                </div>
                <p className="text-sm text-ink-secondary">
                  Case studies lack a clear problem → process → outcome structure.
                </p>
              </Card>
            </Reveal>
          </div>

          {/* Right — feature list */}
          <div className="md:col-span-2">
            <Reveal delay={0.15}>
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-base tracking-tight text-ink-primary mb-4">
                  What&apos;s included
                </h3>
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm text-ink-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ─── Testimonials ─── */}
      <div className="bg-diagonal">
      <Section eyebrow="What Designers Say" heading="Real feedback on real feedback.">
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <Card className="h-full flex flex-col">
                <p className="text-sm text-ink-secondary italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <Divider />
                  <div className="flex items-center gap-3 mt-4">
                    <Avatar size="sm" initials={t.initials} />
                    <div>
                      <p className="text-sm font-body font-medium text-ink-primary">
                        {t.name}
                      </p>
                      <p className="text-xs text-ink-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      </div>

      {/* ─── Pricing ─── */}
      <section id="pricing">
        <Section eyebrow="Pricing" heading="Start for free." narrow>
          <div className="mt-10 max-w-sm mx-auto">
            <Reveal>
              <Card variant="featured">
                <div className="text-center mb-6">
                  <span className="font-display font-bold text-4xl text-ink-primary">
                    Free
                  </span>
                  <p className="text-sm text-ink-muted mt-1">for your first review</p>
                </div>

                <Divider label="INCLUDES" />

                <div className="space-y-3 mt-6 mb-8">
                  {pricingFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      <span className="text-sm text-ink-secondary">{f}</span>
                    </div>
                  ))}
                </div>

                <Button variant="primary" className="w-full" asChild>
                  <Link href="/register">Get Your Free Review</Link>
                </Button>
              </Card>
            </Reveal>
            <p className="text-xs text-ink-muted text-center mt-4">
              No account required. Your portfolio is never stored.
            </p>
          </div>
        </Section>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-24 bg-dots">
        <div className="max-w-full px-6 md:px-10 lg:px-16">
          <div className="max-w-content mx-auto text-center">
            <div className="overflow-hidden">
              <TextReveal>
                <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-ink-primary">
                  Ready to level up?
                </h2>
              </TextReveal>
            </div>
            <p className="text-ink-secondary text-lg mt-4 mb-8">
              Get your portfolio reviewed in under a minute.
            </p>
            <MagneticButton>
              <Button variant="primary" asChild>
                <Link href="/register">Review My Portfolio</Link>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border py-12">
        <div className="max-w-full px-6 md:px-10 lg:px-16">
          <div className="max-w-wide mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ink-muted">
              Portfolio Review Tool — Built for designers.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-ink-muted">© 2026</span>
              <a href="#" className="text-xs text-ink-muted hover:text-ink-secondary transition-colors duration-fast">
                Privacy
              </a>
              <a href="#" className="text-xs text-ink-muted hover:text-ink-secondary transition-colors duration-fast">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
