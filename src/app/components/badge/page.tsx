import { Badge } from "@/components/Badge";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function BadgePage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FEEDBACK &amp; DATA
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Badge
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Category tags for labeling review sections — Layout, Typography,
          Accessibility, etc. Six variants covering brand and status colors.
        </p>
      </div>

      <ComponentPreview label="Default">
        <Badge>General</Badge>
        <Badge>Layout</Badge>
        <Badge>Typography</Badge>
      </ComponentPreview>

      <CodeBlock code={`<Badge>General</Badge>`} />

      <ComponentPreview label="Acid (primary accent)">
        <Badge variant="acid">Featured</Badge>
        <Badge variant="acid">New</Badge>
      </ComponentPreview>

      <CodeBlock code={`<Badge variant="acid">Featured</Badge>`} />

      <ComponentPreview label="Mist (secondary accent)">
        <Badge variant="mist">AI Insight</Badge>
        <Badge variant="mist">Beta</Badge>
      </ComponentPreview>

      <CodeBlock code={`<Badge variant="mist">AI Insight</Badge>`} />

      <ComponentPreview label="Status variants">
        <Badge variant="success">Passed</Badge>
        <Badge variant="warning">Needs Work</Badge>
        <Badge variant="error">Critical</Badge>
      </ComponentPreview>

      <CodeBlock
        code={`<Badge variant="success">Passed</Badge>
<Badge variant="warning">Needs Work</Badge>
<Badge variant="error">Critical</Badge>`}
      />
    </>
  );
}
