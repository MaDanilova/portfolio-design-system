"use client";

import { TextReveal } from "@/components/TextReveal";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function TextRevealPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          COMPONENTS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          TextReveal
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          GSAP-powered entrance animation. Text slides up from behind a mask
          with opacity fade. Supports staggered delays for sequential reveals.
        </p>
      </div>

      <ComponentPreview label="Default reveal" className="flex-col items-start">
        <TextReveal>
          <h2 className="font-display font-black text-5xl tracking-tightest text-ink-primary">
            Your portfolio, reviewed.
          </h2>
        </TextReveal>
      </ComponentPreview>

      <CodeBlock
        code={`<TextReveal>
  <h2 className="font-display font-black text-5xl tracking-tightest">
    Your portfolio, reviewed.
  </h2>
</TextReveal>`}
      />

      <ComponentPreview label="Staggered delays" className="flex-col items-start gap-2">
        <TextReveal delay={0}>
          <p className="font-display font-bold text-2xl tracking-tight text-ink-primary">
            First line
          </p>
        </TextReveal>
        <TextReveal delay={0.15}>
          <p className="font-display font-bold text-2xl tracking-tight text-ink-secondary">
            Second line
          </p>
        </TextReveal>
        <TextReveal delay={0.3}>
          <p className="font-display font-bold text-2xl tracking-tight text-ink-muted">
            Third line
          </p>
        </TextReveal>
      </ComponentPreview>

      <CodeBlock
        code={`<TextReveal delay={0}>First line</TextReveal>
<TextReveal delay={0.15}>Second line</TextReveal>
<TextReveal delay={0.3}>Third line</TextReveal>`}
      />
    </>
  );
}
