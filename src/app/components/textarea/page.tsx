"use client";

import { Textarea } from "@/components/Textarea";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function TextareaPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FORMS &amp; INPUT
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Textarea
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Multi-line text input for notes, context, and detailed feedback.
          Auto-resizable with label, helper text, and error states.
        </p>
      </div>

      <ComponentPreview label="Default">
        <div className="w-full max-w-md">
          <Textarea placeholder="Add context about your portfolio..." />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<Textarea placeholder="Add context about your portfolio..." />`} />

      <ComponentPreview label="With label and helper text">
        <div className="w-full max-w-md">
          <Textarea
            label="Additional context"
            id="context"
            placeholder="Tell us about your design goals..."
            helperText="Optional — helps our AI give better feedback"
          />
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<Textarea
  label="Additional context"
  id="context"
  placeholder="Tell us about your design goals..."
  helperText="Optional — helps our AI give better feedback"
/>`}
      />

      <ComponentPreview label="Error state">
        <div className="w-full max-w-md">
          <Textarea
            label="Notes"
            id="notes-error"
            error="Notes cannot exceed 500 characters"
            defaultValue="Some text that is too long..."
          />
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<Textarea
  label="Notes"
  error="Notes cannot exceed 500 characters"
/>`}
      />

      <ComponentPreview label="Disabled">
        <div className="w-full max-w-md">
          <Textarea label="Notes" id="notes-disabled" placeholder="Disabled textarea" disabled />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<Textarea label="Notes" placeholder="Disabled textarea" disabled />`} />
    </>
  );
}
