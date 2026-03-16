"use client";

import { useState } from "react";
import { Toggle } from "@/components/Toggle";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function TogglePage() {
  const [on, setOn] = useState(false);
  const [checked, setChecked] = useState(true);

  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FORMS &amp; INPUT
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Toggle
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          On/off switch for boolean settings. Uses the mist accent color for
          the active state.
        </p>
      </div>

      <ComponentPreview label="Off state">
        <Toggle checked={on} onChange={setOn} label="Enable notifications" />
      </ComponentPreview>

      <CodeBlock
        code={`<Toggle
  checked={on}
  onChange={setOn}
  label="Enable notifications"
/>`}
      />

      <ComponentPreview label="On state">
        <Toggle checked={checked} onChange={setChecked} label="Auto-review new uploads" />
      </ComponentPreview>

      <CodeBlock
        code={`<Toggle
  checked={true}
  onChange={setChecked}
  label="Auto-review new uploads"
/>`}
      />

      <ComponentPreview label="Disabled">
        <Toggle checked={false} disabled label="Premium feature" />
        <Toggle checked={true} disabled label="Always on" />
      </ComponentPreview>

      <CodeBlock
        code={`<Toggle checked={false} disabled label="Premium feature" />
<Toggle checked={true} disabled label="Always on" />`}
      />
    </>
  );
}
