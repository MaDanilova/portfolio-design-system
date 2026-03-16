import { cn } from "@/lib/utils";

interface ScoreProps {
  value: number;
  max?: number;
  variant?: "ring" | "bar";
  label?: string;
  className?: string;
}

function getScoreColor(value: number, max: number) {
  const pct = value / max;
  if (pct >= 0.7) return { stroke: "stroke-acid", bg: "bg-acid", text: "text-acid" };
  if (pct >= 0.4) return { stroke: "stroke-warning", bg: "bg-warning", text: "text-warning" };
  return { stroke: "stroke-error", bg: "bg-error", text: "text-error" };
}

function ScoreRing({ value, max = 10, label, className }: ScoreProps) {
  const pct = value / max;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const color = getScoreColor(value, max);

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <svg width={64} height={64} viewBox="0 0 64 64" className="-rotate-90">
        <circle
          cx={32} cy={32} r={radius}
          fill="none" strokeWidth={4}
          className="stroke-surface-subtle"
        />
        <circle
          cx={32} cy={32} r={radius}
          fill="none" strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(color.stroke, "transition-all duration-300")}
        />
      </svg>
      <span className="absolute font-display font-bold text-lg text-ink-primary">
        {value}
      </span>
      {label && <p className="text-xs text-ink-muted">{label}</p>}
    </div>
  );
}

function ScoreBar({ value, max = 10, label, className }: ScoreProps) {
  const pct = (value / max) * 100;
  const color = getScoreColor(value, max);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-body text-ink-primary">{label}</span>
          <span className={cn("text-sm font-body font-medium", color.text)}>
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-300", color.bg)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Score({ variant = "ring", ...props }: ScoreProps) {
  if (variant === "bar") return <ScoreBar {...props} />;
  return (
    <div className="relative flex items-center justify-center">
      <ScoreRing {...props} />
    </div>
  );
}
