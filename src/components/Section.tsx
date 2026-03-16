import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  heading?: string;
  narrow?: boolean;
}

export function Section({
  eyebrow,
  heading,
  narrow,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)} {...props}>
      <div className="max-w-full px-6 md:px-10 lg:px-16">
        <div className={cn(narrow ? "max-w-content mx-auto" : "max-w-wide mx-auto")}>
          {eyebrow && (
            <p className="text-xs font-body font-medium tracking-widest uppercase text-acid mb-4">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-ink-primary mb-12">
              {heading}
            </h2>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
