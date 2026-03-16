"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary: cn(
    "bg-acid text-ink-inverse font-body font-medium text-sm px-5 py-2.5 rounded",
    "hover:bg-acid-dim focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-acid focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    "disabled:opacity-40 disabled:cursor-not-allowed"
  ),
  secondary: cn(
    "bg-mist text-ink-inverse font-body font-medium text-sm px-5 py-2.5 rounded",
    "hover:bg-mist-dim focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-mist focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    "disabled:opacity-40 disabled:cursor-not-allowed"
  ),
  ghost: cn(
    "bg-transparent text-ink-secondary font-body text-sm px-5 py-2.5 rounded",
    "border border-transparent hover:border-border hover:text-ink-primary",
    "focus-visible:ring-2 focus-visible:ring-acid focus-visible:ring-offset-2",
    "focus-visible:ring-offset-surface-base transition-colors duration-fast"
  ),
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
