import { Spinner } from "@/components/Spinner";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function SpinnerPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          STATUS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Spinner
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Inline loading indicator in three sizes. Uses CSS animation with the
          acid accent color.
        </p>
      </div>

      <ComponentPreview label="Small">
        <Spinner size="sm" />
        <span className="text-sm text-ink-secondary">Loading...</span>
      </ComponentPreview>

      <CodeBlock code={`<Spinner size="sm" />`} />

      <ComponentPreview label="Medium (default)">
        <Spinner size="md" />
      </ComponentPreview>

      <CodeBlock code={`<Spinner size="md" />`} />

      <ComponentPreview label="Large">
        <Spinner size="lg" />
      </ComponentPreview>

      <CodeBlock code={`<Spinner size="lg" />`} />
    </>
  );
}
