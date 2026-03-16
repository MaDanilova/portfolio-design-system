"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Toggle({ checked = false, onChange, disabled, label }: ToggleProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2.5 cursor-pointer",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative w-10 h-6 rounded-full transition-all duration-fast",
          checked ? "bg-mist" : "bg-surface-subtle"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-4 h-4 rounded-full bg-ink-primary transition-transform duration-fast",
            checked && "translate-x-4"
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-body text-ink-primary">{label}</span>
      )}
    </label>
  );
}
