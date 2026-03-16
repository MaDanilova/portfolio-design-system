"use client";

import { Select } from "@/components/Select";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

const reviewTypes = [
  { value: "full", label: "Full Review" },
  { value: "quick", label: "Quick Scan" },
  { value: "accessibility", label: "Accessibility Audit" },
];

export default function SelectPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FORMS &amp; INPUT
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Select
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Dropdown picker for choosing between predefined options. Includes
          Lucide chevron icon, label, placeholder, and error support.
        </p>
      </div>

      <ComponentPreview label="Default with placeholder">
        <div className="w-full max-w-sm">
          <Select
            options={reviewTypes}
            placeholder="Choose review type"
            defaultValue=""
          />
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<Select
  options={[
    { value: "full", label: "Full Review" },
    { value: "quick", label: "Quick Scan" },
    { value: "accessibility", label: "Accessibility Audit" },
  ]}
  placeholder="Choose review type"
/>`}
      />

      <ComponentPreview label="With label">
        <div className="w-full max-w-sm">
          <Select
            label="Review type"
            id="review-type"
            options={reviewTypes}
            placeholder="Choose review type"
            defaultValue=""
          />
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<Select
  label="Review type"
  options={reviewTypes}
  placeholder="Choose review type"
/>`}
      />

      <ComponentPreview label="Error state">
        <div className="w-full max-w-sm">
          <Select
            label="Review type"
            id="review-error"
            options={reviewTypes}
            error="Please select a review type"
            placeholder="Choose review type"
            defaultValue=""
          />
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<Select
  label="Review type"
  options={reviewTypes}
  error="Please select a review type"
/>`}
      />

      <ComponentPreview label="Disabled">
        <div className="w-full max-w-sm">
          <Select
            label="Review type"
            id="review-disabled"
            options={reviewTypes}
            placeholder="Choose review type"
            defaultValue=""
            disabled
          />
        </div>
      </ComponentPreview>

      <CodeBlock code={`<Select options={reviewTypes} disabled />`} />
    </>
  );
}
