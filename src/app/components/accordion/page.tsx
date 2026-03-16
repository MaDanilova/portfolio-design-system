"use client";

import { Accordion } from "@/components/Accordion";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

const singleItems = [
  {
    id: "layout",
    title: "Layout & Composition",
    content: "Your hero section follows a strong visual hierarchy. Consider adding more breathing room between the feature cards to improve scannability.",
  },
  {
    id: "typography",
    title: "Typography",
    content: "Font pairing is solid. The body text line-height could be increased to 1.6 for better readability on longer paragraphs.",
  },
  {
    id: "color",
    title: "Color & Contrast",
    content: "Primary accent usage is restrained and effective. The secondary text on dark backgrounds passes AA but not AAA contrast requirements.",
  },
];

const multiItems = [
  {
    id: "perf",
    title: "Performance",
    content: "Lighthouse score: 72. Largest Contentful Paint is 3.2s. Compress hero image and defer non-critical JS.",
  },
  {
    id: "a11y",
    title: "Accessibility",
    content: "Missing skip-to-content link. Form inputs lack associated labels. Interactive elements need visible focus indicators.",
  },
  {
    id: "responsive",
    title: "Responsive Design",
    content: "Mobile layout breaks below 375px. Navigation hamburger menu is not keyboard accessible.",
  },
];

export default function AccordionPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FEEDBACK &amp; DATA
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Accordion
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          Expandable sections for review feedback categories. Single mode
          (one panel open at a time) or multiple mode. Uses GSAP for height
          animation.
        </p>
      </div>

      <ComponentPreview label="Single mode (default)" className="flex-col items-stretch">
        <Accordion items={singleItems} />
      </ComponentPreview>

      <CodeBlock
        code={`<Accordion items={[
  { id: "layout", title: "Layout & Composition", content: "..." },
  { id: "typography", title: "Typography", content: "..." },
  { id: "color", title: "Color & Contrast", content: "..." },
]} />`}
      />

      <ComponentPreview label="Multiple mode" className="flex-col items-stretch">
        <Accordion items={multiItems} multiple />
      </ComponentPreview>

      <CodeBlock
        code={`<Accordion items={items} multiple />`}
      />
    </>
  );
}
