import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ComponentPreviewProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function ComponentPreview({
  label,
  children,
  className,
}: ComponentPreviewProps) {
  return (
    <div className="mb-10">
      <p className="text-xs font-mono text-ink-muted mb-3">{label}</p>
      <div
        className={cn(
          "bg-surface-raised border border-border rounded-xl p-8 flex flex-wrap items-center gap-4",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
