import { Skeleton } from "@/components/Skeleton";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function SkeletonPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          STATUS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Skeleton
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Loading placeholder that mimics content shape. Three variants: text
          lines, circle (avatar placeholder), and card. Uses CSS pulse
          animation.
        </p>
      </div>

      <ComponentPreview label="Text (3 lines — default)" className="flex-col items-stretch">
        <Skeleton variant="text" />
      </ComponentPreview>

      <CodeBlock code={`<Skeleton variant="text" />`} />

      <ComponentPreview label="Text (5 lines)" className="flex-col items-stretch">
        <Skeleton variant="text" lines={5} />
      </ComponentPreview>

      <CodeBlock code={`<Skeleton variant="text" lines={5} />`} />

      <ComponentPreview label="Circle">
        <Skeleton variant="circle" />
        <Skeleton variant="circle" className="w-14 h-14" />
      </ComponentPreview>

      <CodeBlock
        code={`<Skeleton variant="circle" />
<Skeleton variant="circle" className="w-14 h-14" />`}
      />

      <ComponentPreview label="Card" className="flex-col items-stretch">
        <Skeleton variant="card" />
      </ComponentPreview>

      <CodeBlock code={`<Skeleton variant="card" />`} />

      <ComponentPreview label="Composed — Review card loading" className="flex-col items-stretch">
        <div className="flex items-start gap-4">
          <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
          <div className="flex-1">
            <Skeleton variant="text" lines={2} />
          </div>
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<div className="flex items-start gap-4">
  <Skeleton variant="circle" className="w-10 h-10" />
  <Skeleton variant="text" lines={2} />
</div>`}
      />
    </>
  );
}
