"use client";

import { cn } from "@/lib/utils";
import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Textarea({
  label,
  helperText,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
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
      <textarea
        id={id}
        className={cn(
          "w-full bg-surface-raised border rounded px-3.5 py-2.5",
          "text-sm font-body text-ink-primary placeholder:text-ink-muted",
          "min-h-[100px] resize-y",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          error ? "border-error" : "border-border",
          className
        )}
        {...props}
      />
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
