import { FileSearch, FolderOpen, Star } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/Button";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function EmptyStatePage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          STATUS
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          EmptyState
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Zero-data placeholder for empty lists and first-use screens.
          Icon + heading + description + optional call-to-action button.
        </p>
      </div>

      <ComponentPreview label="No reviews yet" className="flex-col">
        <EmptyState
          icon={FileSearch}
          heading="No reviews yet"
          description="Submit your first portfolio URL to get an AI-powered design review."
          action={<Button variant="primary">Start a Review</Button>}
        />
      </ComponentPreview>

      <CodeBlock
        code={`<EmptyState
  icon={FileSearch}
  heading="No reviews yet"
  description="Submit your first portfolio URL..."
  action={<Button variant="primary">Start a Review</Button>}
/>`}
      />

      <ComponentPreview label="Empty folder" className="flex-col">
        <EmptyState
          icon={FolderOpen}
          heading="This folder is empty"
          description="Saved reviews will appear here."
        />
      </ComponentPreview>

      <CodeBlock
        code={`<EmptyState
  icon={FolderOpen}
  heading="This folder is empty"
  description="Saved reviews will appear here."
/>`}
      />

      <ComponentPreview label="No favorites" className="flex-col">
        <EmptyState
          icon={Star}
          heading="No favorites"
          description="Star a review to save it for quick access."
        />
      </ComponentPreview>

      <CodeBlock
        code={`<EmptyState
  icon={Star}
  heading="No favorites"
/>`}
      />
    </>
  );
}
