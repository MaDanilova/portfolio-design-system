"use client";

import { Button } from "@/components/Button";
import { MagneticButton } from "@/components/MagneticButton";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function ButtonPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          COMPONENTS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Button
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Three variants: Primary (acid fill), Secondary (mist fill), and Ghost
          (transparent with border on hover). Use Primary for the single most
          important action per screen. Secondary for supporting actions. Ghost
          for tertiary actions.
        </p>
      </div>

      <ComponentPreview label="Primary">
        <Button variant="primary">Get Your Review</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </ComponentPreview>

      <CodeBlock
        code={`<Button variant="primary">Get Your Review</Button>
<Button variant="primary" disabled>Disabled</Button>`}
      />

      <ComponentPreview label="Secondary">
        <Button variant="secondary">View Details</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </ComponentPreview>

      <CodeBlock
        code={`<Button variant="secondary">View Details</Button>
<Button variant="secondary" disabled>Disabled</Button>`}
      />

      <ComponentPreview label="Ghost">
        <Button variant="ghost">See how it works</Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
      </ComponentPreview>

      <CodeBlock
        code={`<Button variant="ghost">See how it works</Button>
<Button variant="ghost" disabled>Disabled</Button>`}
      />

      <ComponentPreview label="With MagneticButton wrapper">
        <MagneticButton>
          <Button variant="primary">Magnetic Hover</Button>
        </MagneticButton>
      </ComponentPreview>

      <CodeBlock
        code={`<MagneticButton>
  <Button variant="primary">Magnetic Hover</Button>
</MagneticButton>`}
      />
    </>
  );
}
