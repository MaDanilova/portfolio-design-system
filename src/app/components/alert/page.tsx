"use client";

import { Alert } from "@/components/Alert";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function AlertPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          STATUS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Alert
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Persistent banner messages for important information. Four status
          variants with Lucide icons. Optionally dismissible.
        </p>
      </div>

      <ComponentPreview label="Info (default)" className="flex-col items-stretch">
        <Alert title="New feature available">
          You can now export review reports as PDF. Check the settings page.
        </Alert>
      </ComponentPreview>

      <CodeBlock
        code={`<Alert title="New feature available">
  You can now export review reports as PDF.
</Alert>`}
      />

      <ComponentPreview label="Success" className="flex-col items-stretch">
        <Alert status="success" title="Review complete">
          Your portfolio scored 8.2/10. View the full breakdown below.
        </Alert>
      </ComponentPreview>

      <CodeBlock
        code={`<Alert status="success" title="Review complete">
  Your portfolio scored 8.2/10.
</Alert>`}
      />

      <ComponentPreview label="Warning" className="flex-col items-stretch">
        <Alert status="warning" title="Slow loading detected">
          Some pages took over 3 seconds to load. This may affect your score.
        </Alert>
      </ComponentPreview>

      <CodeBlock code={`<Alert status="warning" title="Slow loading detected">...</Alert>`} />

      <ComponentPreview label="Error" className="flex-col items-stretch">
        <Alert status="error" title="Analysis failed">
          We couldn&apos;t reach the provided URL. Please check the link and try again.
        </Alert>
      </ComponentPreview>

      <CodeBlock code={`<Alert status="error" title="Analysis failed">...</Alert>`} />

      <ComponentPreview label="Dismissible" className="flex-col items-stretch">
        <Alert status="info" title="Tip" dismissible onDismiss={() => {}}>
          Add a meta description to improve your SEO score.
        </Alert>
      </ComponentPreview>

      <CodeBlock
        code={`<Alert status="info" dismissible onDismiss={() => setVisible(false)}>
  Add a meta description to improve your SEO score.
</Alert>`}
      />
    </>
  );
}
