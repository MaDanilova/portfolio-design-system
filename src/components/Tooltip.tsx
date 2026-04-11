"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface TooltipProps {
  content: string;
  placement?: "top" | "bottom";
  className?: string;
  children: ReactNode;
}

export function Tooltip({ content, placement = "top", className, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const el = tipRef.current;
    if (!el) return;
    if (visible) {
      gsap.fromTo(
        el,
        { opacity: 0, y: placement === "top" ? 4 : -4 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }
      );
    }
  }, [visible, placement]);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 200);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <span className={cn("relative inline-flex", className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          ref={tipRef}
          className={cn(
            "absolute z-30 bg-surface-overlay border border-border rounded px-3 py-1.5",
            "text-xs font-body text-ink-secondary whitespace-nowrap",
            placement === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
            placement === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2"
          )}
        >
          {content}
        </div>
      )}
    </span>
  );
}
