"use client";

import { Button } from "@/components/Button";
import { MagneticButton } from "@/components/MagneticButton";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function MagneticButtonPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          COMPONENTS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          MagneticButton
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          GSAP-powered wrapper that makes its child follow the cursor within
          bounds. Configurable strength. Wraps any element, typically a Button.
        </p>
      </div>

      <ComponentPreview label="Default strength (0.4)">
        <MagneticButton>
          <Button variant="primary">Hover me</Button>
        </MagneticButton>
      </ComponentPreview>

      <CodeBlock
        code={`<MagneticButton>
  <Button variant="primary">Hover me</Button>
</MagneticButton>`}
      />

      <ComponentPreview label="Strong magnet (0.7)">
        <MagneticButton strength={0.7}>
          <Button variant="primary">Strong pull</Button>
        </MagneticButton>
      </ComponentPreview>

      <CodeBlock
        code={`<MagneticButton strength={0.7}>
  <Button variant="primary">Strong pull</Button>
</MagneticButton>`}
      />

      <ComponentPreview label="Subtle magnet (0.15)">
        <MagneticButton strength={0.15}>
          <Button variant="ghost">Subtle follow</Button>
        </MagneticButton>
      </ComponentPreview>

      <CodeBlock
        code={`<MagneticButton strength={0.15}>
  <Button variant="ghost">Subtle follow</Button>
</MagneticButton>`}
      />
    </>
  );
}
