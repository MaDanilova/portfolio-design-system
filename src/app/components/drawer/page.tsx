"use client";

import { useState } from "react";
import { Drawer } from "@/components/Drawer";
import { Button } from "@/components/Button";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function DrawerPage() {
  const [rightOpen, setRightOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);

  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          OVERLAYS &amp; NAV
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Drawer
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Slide-out side panel for secondary content, filters, or settings.
          Left or right positioning. GSAP slide animation with backdrop.
          Escape key to close.
        </p>
      </div>

      <ComponentPreview label="Right side (default)">
        <Button variant="ghost" onClick={() => setRightOpen(true)}>
          Open Right Drawer
        </Button>
        <Drawer open={rightOpen} onClose={() => setRightOpen(false)} title="Review Details">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-ink-muted mb-1">Score</p>
              <p className="text-2xl font-display font-bold text-acid">8.2/10</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted mb-1">Categories</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">Layout</span>
                  <span className="text-ink-primary">9/10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">Typography</span>
                  <span className="text-ink-primary">8/10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">Color</span>
                  <span className="text-ink-primary">7/10</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </ComponentPreview>

      <CodeBlock
        code={`<Drawer open={open} onClose={close} title="Review Details">
  ...content...
</Drawer>`}
      />

      <ComponentPreview label="Left side">
        <Button variant="ghost" onClick={() => setLeftOpen(true)}>
          Open Left Drawer
        </Button>
        <Drawer open={leftOpen} onClose={() => setLeftOpen(false)} side="left" title="Filters">
          <div className="space-y-4">
            <p className="text-sm text-ink-secondary">Filter reviews by category, score, or date.</p>
          </div>
        </Drawer>
      </ComponentPreview>

      <CodeBlock
        code={`<Drawer open={open} onClose={close} side="left" title="Filters">
  ...content...
</Drawer>`}
      />
    </>
  );
}
