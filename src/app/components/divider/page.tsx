import { Divider } from "@/components/Divider";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function DividerPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FEEDBACK &amp; DATA
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Divider
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Visual separator for content sections. Horizontal or vertical
          orientation, with optional label.
        </p>
      </div>

      <ComponentPreview label="Horizontal (default)" className="flex-col items-stretch">
        <Divider />
      </ComponentPreview>

      <CodeBlock code={`<Divider />`} />

      <ComponentPreview label="With label" className="flex-col items-stretch">
        <Divider label="or" />
      </ComponentPreview>

      <CodeBlock code={`<Divider label="or" />`} />

      <ComponentPreview label="Vertical">
        <div className="flex items-center gap-4 h-10">
          <span className="text-sm text-ink-secondary">Section A</span>
          <Divider orientation="vertical" />
          <span className="text-sm text-ink-secondary">Section B</span>
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<div className="flex items-center gap-4 h-10">
  <span>Section A</span>
  <Divider orientation="vertical" />
  <span>Section B</span>
</div>`}
      />
    </>
  );
}
