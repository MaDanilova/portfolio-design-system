import { Card } from "@/components/Card";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function CardPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          COMPONENTS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Card
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Three variants: Default (static), Interactive (hover border + shadow),
          and Featured (acid border + glow). All use surface-raised background
          and rounded-xl.
        </p>
      </div>

      <ComponentPreview label="Default" className="flex-col items-stretch">
        <Card>
          <h3 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-2">
            Default Card
          </h3>
          <p className="text-sm text-ink-secondary">
            Static container for content grouping.
          </p>
        </Card>
      </ComponentPreview>

      <CodeBlock
        code={`<Card>
  <h3>Default Card</h3>
  <p>Static container for content grouping.</p>
</Card>`}
      />

      <ComponentPreview label="Interactive" className="flex-col items-stretch">
        <Card variant="interactive">
          <h3 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-2">
            Interactive Card
          </h3>
          <p className="text-sm text-ink-secondary">
            Hover to see border and shadow change.
          </p>
        </Card>
      </ComponentPreview>

      <CodeBlock code={`<Card variant="interactive">...</Card>`} />

      <ComponentPreview label="Featured" className="flex-col items-stretch">
        <Card variant="featured">
          <h3 className="font-display font-semibold text-lg tracking-tight text-ink-primary mb-2">
            Featured Card
          </h3>
          <p className="text-sm text-ink-secondary">
            Acid border with glow. Use for highlighted items.
          </p>
        </Card>
      </ComponentPreview>

      <CodeBlock code={`<Card variant="featured">...</Card>`} />
    </>
  );
}
