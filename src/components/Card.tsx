import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type Variant = "default" | "interactive" | "featured";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const base = "bg-surface-raised rounded-xl border border-border p-6";

const variants: Record<Variant, string> = {
  default: base,
  interactive: cn(
    base,
    "hover:border-border-strong hover:shadow-md transition-all duration-300"
  ),
  featured: cn(base, "border-border-accent shadow-glow"),
};

export function Card({
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
