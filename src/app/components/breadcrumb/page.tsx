import { Breadcrumb } from "@/components/Breadcrumb";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function BreadcrumbPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          OVERLAYS &amp; NAV
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Breadcrumb
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Navigation trail showing the user&apos;s current location in the app hierarchy.
          Lucide chevron separators, last item is non-linked active state.
        </p>
      </div>

      <ComponentPreview label="Two levels">
        <Breadcrumb
          items={[
            { label: "Reviews", href: "/" },
            { label: "Portfolio Review #42" },
          ]}
        />
      </ComponentPreview>

      <CodeBlock
        code={`<Breadcrumb items={[
  { label: "Reviews", href: "/" },
  { label: "Portfolio Review #42" },
]} />`}
      />

      <ComponentPreview label="Three levels">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "My Reviews", href: "/reviews" },
            { label: "Review Detail" },
          ]}
        />
      </ComponentPreview>

      <CodeBlock
        code={`<Breadcrumb items={[
  { label: "Dashboard", href: "/" },
  { label: "My Reviews", href: "/reviews" },
  { label: "Review Detail" },
]} />`}
      />

      <ComponentPreview label="Single item (root)">
        <Breadcrumb items={[{ label: "Dashboard" }]} />
      </ComponentPreview>

      <CodeBlock code={`<Breadcrumb items={[{ label: "Dashboard" }]} />`} />
    </>
  );
}
