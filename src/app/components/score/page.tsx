import { Score } from "@/components/Score";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function ScorePage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FEEDBACK &amp; DATA
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Score
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Visual score display for portfolio review metrics. Ring variant for
          overview scores, bar variant for category breakdowns. Color-coded by
          score range (acid = good, warning = fair, error = poor).
        </p>
      </div>

      <ComponentPreview label="Ring — High score">
        <Score value={8.5} max={10} label="Overall" />
        <Score value={9} max={10} label="Typography" />
      </ComponentPreview>

      <CodeBlock code={`<Score value={8.5} max={10} label="Overall" />`} />

      <ComponentPreview label="Ring — Mid score">
        <Score value={5.5} max={10} label="Accessibility" />
      </ComponentPreview>

      <CodeBlock code={`<Score value={5.5} max={10} label="Accessibility" />`} />

      <ComponentPreview label="Ring — Low score">
        <Score value={2} max={10} label="Performance" />
      </ComponentPreview>

      <CodeBlock code={`<Score value={2} max={10} label="Performance" />`} />

      <ComponentPreview label="Bar variant" className="flex-col items-stretch gap-6">
        <Score variant="bar" value={8} max={10} label="Layout" />
        <Score variant="bar" value={5} max={10} label="Color" />
        <Score variant="bar" value={3} max={10} label="Mobile" />
      </ComponentPreview>

      <CodeBlock
        code={`<Score variant="bar" value={8} max={10} label="Layout" />
<Score variant="bar" value={5} max={10} label="Color" />
<Score variant="bar" value={3} max={10} label="Mobile" />`}
      />
    </>
  );
}
