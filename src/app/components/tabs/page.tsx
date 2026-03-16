"use client";

import { Tabs } from "@/components/Tabs";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

const reviewTabs = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <p className="text-sm text-ink-secondary">
        Overall score and summary of the portfolio review. Includes top-level metrics for layout, typography, color, and accessibility.
      </p>
    ),
  },
  {
    id: "details",
    label: "Details",
    content: (
      <p className="text-sm text-ink-secondary">
        Detailed breakdown of each review category with specific recommendations and examples.
      </p>
    ),
  },
  {
    id: "history",
    label: "History",
    content: (
      <p className="text-sm text-ink-secondary">
        Previous review versions and score changes over time.
      </p>
    ),
  },
];

export default function TabsPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          OVERLAYS &amp; NAV
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Tabs
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Content section switcher for organizing review data. Horizontal
          layout with an acid underline indicator on the active tab.
        </p>
      </div>

      <ComponentPreview label="Default" className="flex-col items-stretch">
        <Tabs tabs={reviewTabs} />
      </ComponentPreview>

      <CodeBlock
        code={`<Tabs tabs={[
  { id: "overview", label: "Overview", content: <Overview /> },
  { id: "details", label: "Details", content: <Details /> },
  { id: "history", label: "History", content: <History /> },
]} />`}
      />

      <ComponentPreview label="With default tab" className="flex-col items-stretch">
        <Tabs tabs={reviewTabs} defaultTab="details" />
      </ComponentPreview>

      <CodeBlock code={`<Tabs tabs={tabs} defaultTab="details" />`} />
    </>
  );
}
