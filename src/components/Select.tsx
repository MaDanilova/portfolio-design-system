"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  helperText,
  error,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-body font-medium text-ink-primary mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(
            "w-full appearance-none bg-surface-raised border rounded",
            "px-3.5 py-2.5 pr-10 text-sm font-body text-ink-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error ? "border-error" : "border-border",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
      </div>
      {(error || helperText) && (
        <p
          className={cn(
            "text-xs font-body mt-1.5",
            error ? "text-error" : "text-ink-muted"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
