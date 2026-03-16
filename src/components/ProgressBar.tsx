import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value?: number;
  indeterminate?: boolean;
  className?: string;
}

export function ProgressBar({
  value = 0,
  indeterminate = false,
  className,
}: ProgressBarProps) {
  return (
    <div
      className={cn(
        "h-2 w-full bg-surface-subtle rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "h-full bg-acid rounded-full",
          indeterminate
            ? "animate-[slide_1.5s_ease-in-out_infinite] w-1/3"
            : "transition-all duration-300"
        )}
        style={indeterminate ? undefined : { width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}
