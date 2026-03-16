"use client";

import { Input } from "@/components/Input";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function InputPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FORMS &amp; INPUT
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Input
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Text field for URLs, search queries, and user names. Supports label,
          helper text, error state, and disabled state.
        </p>
      </div>

      <ComponentPreview label="Default">
        <div className="w-full max-w-sm">
          <Input placeholder="Enter portfolio URL..." />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<Input placeholder="Enter portfolio URL..." />`} />

      <ComponentPreview label="With label and helper text">
        <div className="w-full max-w-sm">
          <Input
            label="Portfolio URL"
            id="url"
            placeholder="https://example.com"
            helperText="We'll analyze your live site"
          />
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<Input
  label="Portfolio URL"
  id="url"
  placeholder="https://example.com"
  helperText="We'll analyze your live site"
/>`}
      />

      <ComponentPreview label="Error state">
        <div className="w-full max-w-sm">
          <Input
            label="Portfolio URL"
            id="url-error"
            placeholder="https://example.com"
            error="Please enter a valid URL"
            defaultValue="not-a-url"
          />
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<Input
  label="Portfolio URL"
  error="Please enter a valid URL"
  defaultValue="not-a-url"
/>`}
      />

      <ComponentPreview label="Disabled">
        <div className="w-full max-w-sm">
          <Input label="Portfolio URL" id="url-disabled" placeholder="https://example.com" disabled />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<Input label="Portfolio URL" placeholder="https://example.com" disabled />`} />
    </>
  );
}
