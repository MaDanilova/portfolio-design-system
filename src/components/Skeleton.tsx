import { cn } from "@/lib/utils";

type Variant = "text" | "circle" | "card";

interface SkeletonProps {
  variant?: Variant;
  className?: string;
  lines?: number;
}

export function Skeleton({ variant = "text", className, lines = 3 }: SkeletonProps) {
  if (variant === "circle") {
    return (
      <div
        className={cn("w-10 h-10 rounded-full bg-surface-subtle animate-pulse", className)}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn("h-48 w-full rounded-xl bg-surface-subtle animate-pulse", className)}
      />
    );
  }

  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-surface-subtle animate-pulse"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}
