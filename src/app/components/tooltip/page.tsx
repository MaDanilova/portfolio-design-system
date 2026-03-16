"use client";

import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/Button";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function TooltipPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          OVERLAYS &amp; NAV
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Tooltip
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Contextual hover info. Appears after a 200ms delay, uses GSAP for
          fade animation. Top and bottom placement.
        </p>
      </div>

      <ComponentPreview label="Top placement (default)">
        <Tooltip content="Start a new portfolio review">
          <Button variant="ghost">Hover me</Button>
        </Tooltip>
      </ComponentPreview>

      <CodeBlock
        code={`<Tooltip content="Start a new portfolio review">
  <Button variant="ghost">Hover me</Button>
</Tooltip>`}
      />

      <ComponentPreview label="Bottom placement">
        <Tooltip content="View review history" placement="bottom">
          <Button variant="ghost">Hover me (bottom)</Button>
        </Tooltip>
      </ComponentPreview>

      <CodeBlock
        code={`<Tooltip content="View review history" placement="bottom">
  <Button variant="ghost">Hover me</Button>
</Tooltip>`}
      />
    </>
  );
}
