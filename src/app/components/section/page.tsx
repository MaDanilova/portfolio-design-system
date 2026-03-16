import { Section } from "@/components/Section";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function SectionPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          COMPONENTS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Section
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Page section wrapper with optional eyebrow, heading, and narrow mode.
          Handles container, padding, and max-width automatically.
        </p>
      </div>

      <ComponentPreview
        label="With eyebrow + heading"
        className="flex-col items-stretch bg-surface-base"
      >
        <Section eyebrow="Features" heading="How it works">
          <p className="text-ink-secondary">Section content goes here.</p>
        </Section>
      </ComponentPreview>

      <CodeBlock
        code={`<Section eyebrow="Features" heading="How it works">
  <p>Section content goes here.</p>
</Section>`}
      />

      <ComponentPreview
        label="Narrow (720px max-width)"
        className="flex-col items-stretch bg-surface-base"
      >
        <Section narrow heading="Centered content">
          <p className="text-ink-secondary text-center">
            Narrow sections are ideal for text-heavy content blocks.
          </p>
        </Section>
      </ComponentPreview>

      <CodeBlock
        code={`<Section narrow heading="Centered content">
  <p>Narrow sections are ideal for text-heavy content.</p>
</Section>`}
      />
    </>
  );
}
