import { Avatar } from "@/components/Avatar";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeBlock } from "@/components/CodeBlock";

export default function AvatarPage() {
  return (
    <>
      <div className="mb-12">
        <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-3">
          FEEDBACK &amp; DATA
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight text-ink-primary mb-4">
          Avatar
        </h1>
        <p className="text-ink-secondary max-w-content leading-relaxed">
          User or AI identity marker. Supports image source or initials
          fallback in three sizes.
        </p>
      </div>

      <ComponentPreview label="Sizes with initials">
        <Avatar size="sm" initials="DD" />
        <Avatar size="md" initials="DD" />
        <Avatar size="lg" initials="DD" />
      </ComponentPreview>

      <CodeBlock
        code={`<Avatar size="sm" initials="DD" />
<Avatar size="md" initials="DD" />
<Avatar size="lg" initials="DD" />`}
      />

      <ComponentPreview label="Fallback (no initials)">
        <Avatar size="sm" />
        <Avatar size="md" />
        <Avatar size="lg" />
      </ComponentPreview>

      <CodeBlock code={`<Avatar size="md" />`} />

      <ComponentPreview label="Multiple users">
        <div className="flex -space-x-2">
          <Avatar size="md" initials="AK" />
          <Avatar size="md" initials="SR" />
          <Avatar size="md" initials="JL" />
          <Avatar size="md" initials="+3" />
        </div>
      </ComponentPreview>

      <CodeBlock
        code={`<div className="flex -space-x-2">
  <Avatar size="md" initials="AK" />
  <Avatar size="md" initials="SR" />
  <Avatar size="md" initials="JL" />
</div>`}
      />
    </>
  );
}
