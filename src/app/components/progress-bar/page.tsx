import { ProgressBar } from "@/components/ProgressBar";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function ProgressBarPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FEEDBACK &amp; DATA
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          ProgressBar
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Linear progress indicator. Determinate mode for known progress
          (upload percentage), indeterminate mode for unknown duration
          (AI analysis in progress).
        </p>
      </div>

      <ComponentPreview label="Determinate — 0%" className="flex-col items-stretch">
        <ProgressBar value={0} />
      </ComponentPreview>

      <ComponentPreview label="Determinate — 45%" className="flex-col items-stretch">
        <ProgressBar value={45} />
      </ComponentPreview>

      <ComponentPreview label="Determinate — 100%" className="flex-col items-stretch">
        <ProgressBar value={100} />
      </ComponentPreview>

      <CodeBlock
        code={`<ProgressBar value={0} />
<ProgressBar value={45} />
<ProgressBar value={100} />`}
      />

      <ComponentPreview label="Indeterminate" className="flex-col items-stretch">
        <ProgressBar indeterminate />
      </ComponentPreview>

      <CodeBlock code={`<ProgressBar indeterminate />`} />
    </>
  );
}
